import { set, reset } from 'mockdate';

type EventStatus = {
  status: string;
}

export class CheckLastEventStatus {
  constructor(
    private readonly loadLastEventRepository: LoadLastEventRepository,
  ) {}

  public async exec(input: { groupId: string }): Promise<EventStatus> {
    const event = await this.loadLastEventRepository.loadLastEventFromGroup(input.groupId);

    if (!event) {
      return {
        status: 'done',
      }
    }

    const now = new Date();

    return {
      status: event.endDate >= now ? 'active' : 'inReview',
    }
  }
}

export interface LoadLastEventRepository {
  loadLastEventFromGroup(groupId: string): Promise<{ 
    endDate: Date;
    reviewDurationInHours: number; 
  } | undefined>;
}

export class LoadLastEventRepositorySpy implements LoadLastEventRepository {
  public callsCount = 0;
  public groupId?: string;
  public output?: {
    endDate: Date;
    reviewDurationInHours: number;
  };

  public async loadLastEventFromGroup(groupId: string): Promise<{ 
    endDate: Date;
    reviewDurationInHours: number;
    } | undefined> {
    this.callsCount++;
    this.groupId = groupId;

    return this.output;
  }
}

type SUTType = {
  loadLastEventRepository: LoadLastEventRepositorySpy;
  sut: CheckLastEventStatus;
}

const makeSUT = (): SUTType => {
  const loadLastEventRepository = new LoadLastEventRepositorySpy();
  const sut = new CheckLastEventStatus(
    loadLastEventRepository,
  );

  return {
    loadLastEventRepository,
    sut,
  }
}

describe('CheckLastEventStatus', (): void => {
  const groupId = 'any_group_id';

  beforeAll((): void => {
    set(new Date());
  });

  afterAll((): void => {
    reset();
  });

  it('should get last event data', async (): Promise<void> => {
    const { sut, loadLastEventRepository } = makeSUT();

    await sut.exec({ groupId });

    expect(loadLastEventRepository.groupId).toBe('any_group_id');
    expect(loadLastEventRepository.callsCount).toBe(1);
  });

  it('should return status "done" when group has no event', async (): Promise<void> => {
    const { sut, loadLastEventRepository } = makeSUT();

    loadLastEventRepository.output = undefined;

    const eventStatus = await sut.exec({ groupId });

    expect(eventStatus.status).toBe('done');
  });

  it('should return status "active" when NOW is BEFORE event end time', async (): Promise<void> => {
    const { sut, loadLastEventRepository } = makeSUT();

    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() + 1),
      reviewDurationInHours: 1,
    }

    const eventStatus = await sut.exec({ groupId });

    expect(eventStatus.status).toBe('active');
  });

  it('should return status "active" when NOW is EQUAL to event end time', async (): Promise<void> => {
    const { sut, loadLastEventRepository } = makeSUT();

    loadLastEventRepository.output = {
      endDate: new Date(),
      reviewDurationInHours: 1,
    };

    const eventStatus = await sut.exec({ groupId });

    expect(eventStatus.status).toBe('active');
  });

  it('should return status "inReview" when NOW is AFTER event end time', async (): Promise<void> => {
    const { sut, loadLastEventRepository } = makeSUT();

    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() - 1),
      reviewDurationInHours: 1,
    }

    const eventStatus = await sut.exec({ groupId });

    expect(eventStatus.status).toBe('inReview');
  });

  it('should return status "inReview" when NOW is BEFORE review time', async (): Promise<void> => {
    const { sut, loadLastEventRepository } = makeSUT();

    const reviewDurationInHours: number = 1;
    const reviewDurationInMs: number = reviewDurationInHours * 60 * 60 * 1000;

    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() - reviewDurationInMs + 1),
      reviewDurationInHours: 1,
    }

    const eventStatus = await sut.exec({ groupId });

    expect(eventStatus.status).toBe('inReview');
  });

  it('should return status "inReview" when NOW is EQUAL to review time', async (): Promise<void> => {
    const { sut, loadLastEventRepository } = makeSUT();

    const reviewDurationInHours: number = 1;
    const reviewDurationInMs: number = reviewDurationInHours * 60 * 60 * 1000;

    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() - reviewDurationInMs),
      reviewDurationInHours: 1,
    }

    const eventStatus = await sut.exec({ groupId });

    expect(eventStatus.status).toBe('inReview');
  });
});
