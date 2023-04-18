import http from "node:http";
import https from "node:https";

/**
 * Kustom proxy function since we don't need all the features of http-proxy,
 * and gives us lower-level kontrol over how it works. This is a non-streaming
 * proxy since we need to validate the entire response first.
 */
function staticProxy(target, rewritePath) {
  return (req, res) => {
    const { pathname } = new URL(
      req.url,
      `${req.protocol}://${req.headers.host}`
    );
    const originPath = rewritePath(pathname);
    if (!originPath) {
      writeError(res, 500, "rewrite failed");
      return;
    }
    const originURL = originPath.startsWith("localhost/")
      ? new URL(
          originPath.slice("localhost".length),
          `${req.protocol || "http"}://${req.headers.host}`
        ).toString()
      : `${target}${originPath}`;

    (originURL.startsWith("https") ? https : http)
      .get(originURL, (proxyRes) => {
        if (
          proxyRes.headers["content-length"] === "0" ||
          proxyRes.statusCode > 299
        ) {
          writeError(res, 404, `${originURL} not found`);
          return;
        }
        const chunks = [];
        proxyRes.on("data", (d) => {
          chunks.push(d);
        });
        proxyRes.on("end", () => {
          if (!chunks.length) {
            writeError(res, 500, "end failed");
            return;
          }
          const buf = Buffer.concat(chunks);
          const headers = {
            // We want to assign the content-length ourselves since the original
            // request is chunked.
            "content-length": `${buf.length}`,
            "content-type": proxyRes.headers["content-type"] || "text/html",
          };
          res.writeHead(200, headers);
          res.end(buf);
        });
      })
      .on("error", () => {
        writeError(res, 500, "get failed");
      });
  };
}

function writeError(res, statusCode = 500, reason = "unknown") {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain",
  });
  res.end(`guru meditation ${Date.now()} - ${reason}`);
}

export default staticProxy;
