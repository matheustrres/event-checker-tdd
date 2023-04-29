export interface LoadLastEventRepository {
	loadLastEventFromGroup(groupId: string): Promise<
		| {
				endDate: Date;
				reviewDurationInHours: number;
		  }
		| undefined
	>;
}
