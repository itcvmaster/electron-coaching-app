import color from "ansi-colors";
import cluster from "node:cluster";
import os from "node:os";

const CPU_COUNT = os.cpus().length;

cluster.setupPrimary({
  exec: "server/worker.mjs",
});

// Fork workers.
for (let i = 0; i < CPU_COUNT; i++) {
  fork();
}

let hasListener = false;
function fork() {
  let startedListening = false;
  const worker = cluster.fork();
  worker.on("exit", () => {
    if (startedListening) fork();
  });
  worker.once("listening", ({ port, address }) => {
    startedListening = true;
    if (!hasListener) {
      hasListener = true;
      process.stdout.write(
        color.cyan(
          `server listening at ${color.underline(
            `${address || "0.0.0.0"}:${port}`
          )} with ${CPU_COUNT} threads...\n`
        ) + color.magenta(`worker process IDs:`)
      );
    }
    process.stdout.write(` ${color.yellow(worker.process.pid)}`);
  });
}
