import { set, reset } from 'mockdate'; 

export class CheckLastEventStatus {
	constructor(
		private readonly loadLastEventRepository: LoadLastEventRepository,
	) {}

	public async exec(input: { groupId: string }): Promise<string> {
		const event = await this.loadLastEventRepository.loadLastEventFromGroup(input.groupId);

		return event ? 'active' : 'done';
	}
}

export interface LoadLastEventRepository {
	loadLastEventFromGroup(groupId: string): Promise<{ endDate: Date } | undefined>;
}

export class LoadLastEventRepositorySpy implements LoadLastEventRepository {
	public callsCount = 0;
	public groupId?: string;
	public output?: { 
    endDate: Date 
  };

	public async loadLastEventFromGroup(groupId: string): Promise<{ endDate: Date } | undefined> {
		this.callsCount++;
		this.groupId = groupId;

		return this.output;
	}
}

type SUTType = {
  loadLastEventRepository: LoadLastEventRepositorySpy;
  sut: CheckLastEventStatus;
}

const makeSUT = (): SUTType  => {
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

	it('should return status done when group has no event', async (): Promise<void> => {
    const { sut, loadLastEventRepository } = makeSUT();

		loadLastEventRepository.output = undefined;

		const status = await sut.exec({ groupId });

		expect(status).toBe('done');
	});

  it('should return status active when now is before event end time', async (): Promise<void> => {
    const { sut, loadLastEventRepository } = makeSUT();

		loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() + 1),
    };

		const status = await sut.exec({ groupId });

		expect(status).toBe('active');
	});
});
