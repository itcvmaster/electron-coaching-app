import watcher from "@parcel/watcher";
import EventEmitter from "node:events";
import path from "node:path";

const WATCH_DIR = path.join(process.cwd(), "src");

const SSE_RESPONSE_HEADERS = {
  Connection: "keep-alive",
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
};

const CHANGE_EVENT = "change";
const emitter = new EventEmitter();

let sub;
async function watchDir() {
  const subscription = await watcher.subscribe(WATCH_DIR, (error, events) => {
    emitter.emit(CHANGE_EVENT, events);
  });
  return subscription;
}

export function handleSSE(req, res) {
  res.writeHead(200, SSE_RESPONSE_HEADERS);
  res.flushHeaders();
  if (!sub) sub = watchDir();

  function changeListener(events) {
    res.write(`data: ${JSON.stringify(events)}\n\n`);
  }
  emitter.on(CHANGE_EVENT, changeListener);

  // heartbeat
  let timer;
  function heartbeat() {
    timer = setTimeout(() => {
      res.write(":\n\n");
      heartbeat();
    }, 30 * 1000);
  }
  heartbeat();

  res.on("close", () => {
    clearTimeout(timer);
    emitter.off(CHANGE_EVENT, changeListener);
  });
}
