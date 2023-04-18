import { exec } from "node:child_process";

export default function setupGitStep() {
  exec("git config pull.rebase true", (err, _, stderr) => {
    if (err) process.stderr.write(stderr);
  });
}
