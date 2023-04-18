import mime from "mime-types";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const fileCache = {};
const cwd = process.cwd();

// serve static resources
async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;

  let data = fileCache[pathname];

  if (!data) {
    try {
      const absPath = `${cwd}/www${pathname}`;
      const file = await fs.readFile(absPath);
      const hash = crypto.createHash("md5"); // use a weak but fast algo
      hash.update(file);
      const digest = hash.digest("base64");
      const br = await new Promise((resolve, reject) => {
        zlib.brotliCompress(file, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      data = fileCache[pathname] = { file, br, digest };
    } catch (error) {
      process.stderr.write(`${error}\n`);
      res.statusCode = 404;
      return res.end(`File ${pathname} not found!`);
    }
  }

  res.setHeader("ETag", data.digest);

  if (req.headers["if-none-match"] === data.digest) {
    res.statusCode = 304;
    return res.end();
  }

  const ext = path.extname(pathname);
  res.setHeader("content-type", mime.lookup(ext));

  // TEMP: maby disable this later?
  res.setHeader("access-control-allow-origin", "*");

  res.setHeader("cache-control", "max-age=604800");

  if (/\bbr\b/.test(req.headers["accept-encoding"] || "")) {
    res.setHeader("content-encoding", "br");
    return res.end(data.br);
  }

  return res.end(data.file);
}

export default serveStatic;
