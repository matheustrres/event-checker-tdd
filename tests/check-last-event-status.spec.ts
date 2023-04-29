export class CheckLastEventStatus {
	constructor(
		private readonly loadLastEventRepository: LoadLastEventRepository,
	) {}

	public async exec(groupId: string): Promise<string> {
		await this.loadLastEventRepository.loadLastEvent(groupId);

		return 'done';
	}
}

export interface LoadLastEventRepository {
	loadLastEvent(groupId: string): Promise<undefined>;
}

export class LoadLastEventRepositorySpy implements LoadLastEventRepository {
	public callsCount = 0;
	public groupId?: string;
	public output: undefined;

	public async loadLastEvent(groupId: string): Promise<undefined> {
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
	it('should get last event data', async (): Promise<void> => {
    const { sut, loadLastEventRepository } = makeSUT();

		await sut.exec('any_group_id');

		expect(loadLastEventRepository.groupId).toBe('any_group_id');
		expect(loadLastEventRepository.callsCount).toBe(1);
	});

	it('should return status done when group has no event', async (): Promise<void> => {
    const { sut, loadLastEventRepository } = makeSUT();

		loadLastEventRepository.output = undefined;

		const status = await sut.exec('any_group_id');

		expect(status).toBe('done');
	});
});
