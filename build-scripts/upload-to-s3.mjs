/*
  Please setup your AWS credentials via the AWS CLI
  (https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
  and/or ensure you have a profile named "blitz" in "~/.aws/credentials".
*/

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";
import color from "ansi-colors";
import { lookup } from "mime-types";
import { createReadStream, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";

const { version } = JSON.parse(readFileSync(resolve("package.json")));

const args = process.argv.slice(2);
const IS_APPVEYOR = process.env.APPVEYOR;
const IS_DESKTOP = args.includes("--desktop");

const S3_BUCKET = "blitz-desktop.blitz.gg";
const S3_REGION = "us-west-1";
const INPUT_DIRECTORY = "www";

exitProcess(
  !IS_DESKTOP,
  "Only S3 uploads for desktop are supported at the moment, aborting upload!"
);

const client = new S3Client({
  credentials: getCredentials(),
  region: S3_REGION,
});

const existingVersion = await isExistingVersion(version);
exitProcess(
  existingVersion,
  `Version "${version}" already exists on S3, aborting upload!`
);

const files = await getFiles(resolve(INPUT_DIRECTORY));
let filesCompleted = 0;
await Promise.all(
  files.map((file, _, array) =>
    onComplete(uploadFile(file), file.basePath, array.length)
  )
);

async function isExistingVersion(version) {
  try {
    await client.send(
      new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: version + "/index.html",
      })
    );
    return true;
  } catch (error) {
    return false;
  }
}

async function getFiles(path) {
  const cwd = join(process.cwd(), INPUT_DIRECTORY).split(sep).join("/");
  const entries = await readdir(path, { withFileTypes: true });
  const files = entries
    .filter((file) => !file.isDirectory())
    .map((file) => ({
      name: file.name,
      contentType: lookup(extname(file.name)),
      basePath: join(path, file.name).split(sep).join("/").replace(cwd, ""),
      filePath: resolve(join(path, file.name)),
    }));
  const directories = entries.filter((directory) => directory.isDirectory());
  for (const directory of directories) {
    // eslint-disable-next-line no-await-in-loop
    files.push(...(await getFiles(join(path, directory.name))));
  }
  return files;
}

async function uploadFile(file) {
  try {
    const fileStream = createReadStream(file.filePath);
    await client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: version + file.basePath,
        Body: fileStream,
        ContentType: file.contentType,
      })
    );
  } catch (error) {
    exitProcess(error, error.message);
  }
}

function getCredentials() {
  if (process.env.CI) {
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
    exitProcess(
      !(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY),
      'Environment variables "AWS_ACCESS_KEY_ID" and/or "AWS_SECRET_ACCESS_KEY" are missing, aborting upload!'
    );
    return {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    };
  }
  return fromIni({
    profile: "blitz",
  });
}

function exitProcess(conditions, message) {
  if (conditions) {
    // eslint-disable-next-line no-console
    console.error(color.bold(color.red(message)));
    process.exit(1);
  }
}

async function onComplete(promise, filePath, length) {
  const result = await promise;
  filesCompleted++;
  const progress = ((filesCompleted / length) * 100).toFixed(1);
  if (!IS_APPVEYOR) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }
  if (filesCompleted === length) {
    process.stdout.write(
      `Successfully uploaded ${color.cyan(
        filesCompleted + "/" + length
      )} files to ${color.cyan(S3_BUCKET + "/" + version)}.`
    );
  } else {
    process.stdout.write(
      `Upload progress: ${color.cyan(
        `${filesCompleted}/${length} (${progress}%)`
      )} | Uploaded file: ${color.cyan(filePath)}`
    );
  }
  return result;
}
