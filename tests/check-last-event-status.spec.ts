export class CheckLastEventStatus {
	constructor(
		private readonly loadLastEventRepository: LoadLastEventRepository,
	) {}

	public async exec(groupId: string): Promise<void> {
		await this.loadLastEventRepository.loadLastEvent(groupId);
	}
}

export interface LoadLastEventRepository {
	loadLastEvent(groupId: string): Promise<void>;
}

export class LoadLastEventRepositoryMock implements LoadLastEventRepository {
  public callsCount: number = 0;
	public groupId?: string;

	public async loadLastEvent(groupId: string) {
    this.callsCount++;
    
		this.groupId = groupId;
	}
}

describe('CheckLastEventStatus', (): void => {
	it('should get last event data', async (): Promise<void> => {
		const loadLastEventRepository = new LoadLastEventRepositoryMock();
		const sut = new CheckLastEventStatus(loadLastEventRepository);

		await sut.exec('any_group_id');

		expect(loadLastEventRepository.groupId).toBe('any_group_id');
		expect(loadLastEventRepository.callsCount).toBe(1);
	});
});
