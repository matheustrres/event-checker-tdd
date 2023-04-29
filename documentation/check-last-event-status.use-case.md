# CheckLastEventStatus UseCase

> ## Data

- Group ID

> ## Primary flow
- Obtain data from the last group event (end date and duration of the note market)
- Return status "active" if the event has not yet been closed

> ## Alternative flow: Event is on the verge of closing
- Return status "active"

> ## Alternative flow: Event closed, but is within the market period for banknotes
- Return status "inReview"

> ## Alternative flow: Event and note market closed
- Return status "done"

> ## Alternative flow: Group does not have any events scheduled
- Return status "done"