enum EventStatusEnum {
	DONE = 'done',
	ACTIVE = 'active',
	IN_REVIEW = 'inReview',
}

export class EventStatus {
	status?: EventStatusEnum;

	constructor(event?: { endDate: Date; reviewDurationInHours: number }) {
		if (!event) {
			this.status = EventStatusEnum.DONE;

			return;
		}

		const now = new Date();

		if (event.endDate >= now) {
			this.status = EventStatusEnum.ACTIVE;

			return;
		}

		const reviewDurationInMs: number =
			event.reviewDurationInHours * 60 * 60 * 1000;
		const reviewDate = new Date(event.endDate.getTime() + reviewDurationInMs);

		this.status =
			reviewDate >= now ? EventStatusEnum.IN_REVIEW : EventStatusEnum.DONE;
	}
}
