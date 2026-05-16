import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Importa o handler SSR do TanStack Start
const { default: handler } = await import(
  path.join(__dirname, "dist", "server", "server.js")
);

const server = createServer(async (req, res) => {
  try {
    // Serve arquivos estaticos do client
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    if (url.pathname.startsWith("/assets/")) {
      const filePath = path.join(__dirname, "dist", "client", url.pathname);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        const mime = ext === ".js" ? "application/javascript" : ext === ".css" ? "text/css" : "application/octet-stream";
        res.writeHead(200, { "Content-Type": mime });
        res.end(content);
        return;
      }
    }

    // Delega pro handler SSR
    const webRes = await handler.fetch(new Request(req.url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req : undefined,
    }));

    res.writeHead(webRes.status, Object.fromEntries(webRes.headers));
    if (webRes.body) {
      const reader = webRes.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error("[StatusHub]", err);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[StatusHub] Running on port ${PORT}`);
});
