import EventEmitter from "event-lite";

export const events = new EventEmitter();
export const EVENT_FETCHING_DATA = "EVENT_FETCHING_DATA";

export default function hookFetch() {
  events.emit(EVENT_FETCHING_DATA);
}
