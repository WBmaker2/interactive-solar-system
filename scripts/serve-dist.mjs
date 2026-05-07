import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const args = new Map(
  process.argv.slice(2).reduce((pairs, arg, index, values) => {
    if (!arg.startsWith("--")) {
      return pairs;
    }

    pairs.push([arg.slice(2), values[index + 1]]);
    return pairs;
  }, [])
);

const host = args.get("host") ?? "127.0.0.1";
const port = Number(args.get("port") ?? 4273);
const basePathInput = args.get("base") ?? "/interactive-solar-system/";
const basePath = `/${basePathInput.replace(/^\/+|\/+$/g, "")}/`;
const distDir = resolve(
  fileURLToPath(new URL("../dist", import.meta.url))
);
const indexFile = join(distDir, "index.html");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function sendFile(response, filePath) {
  const extension = extname(filePath);

  response.writeHead(200, {
    "Cache-Control": "no-cache",
    "Content-Type": contentTypes[extension] ?? "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}

function resolveDistFile(pathname) {
  const relativePath = decodeURIComponent(pathname.slice(basePath.length));
  const normalizedPath = normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = resolve(distDir, normalizedPath);

  if (!filePath.startsWith(`${distDir}${sep}`) && filePath !== distDir) {
    return undefined;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  return indexFile;
}

const server = createServer((request, response) => {
  const requestURL = new URL(request.url ?? "/", `http://${host}:${port}`);
  const pathname = requestURL.pathname;

  if (pathname === "/" || pathname === basePath.slice(0, -1)) {
    response.writeHead(302, { Location: basePath });
    response.end();
    return;
  }

  if (!pathname.startsWith(basePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const filePath = resolveDistFile(pathname);

  if (!filePath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  sendFile(response, filePath);
});

server.listen(port, host, () => {
  console.log(`Serving dist at http://${host}:${port}${basePath}`);
});
