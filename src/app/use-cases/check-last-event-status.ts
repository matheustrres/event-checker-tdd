import { type LoadLastEventRepository } from '../repositories/load-last-event-repository';
import { EventStatus } from '@/domain/models/event-status';

export class CheckLastEventStatus {
	constructor(
		private readonly loadLastEventRepository: LoadLastEventRepository,
	) {}

	public async exec(input: { groupId: string }): Promise<EventStatus> {
		const event = await this.loadLastEventRepository.loadLastEventFromGroup(
			input.groupId,
		);

		return new EventStatus(event);
	}
}
