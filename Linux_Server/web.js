//
const http = require("http");
const os = require("os");

//Port
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

//Create Server
const server = http.createServer((req, res) => {
  // Configure Header
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  // Server Information
  const serverInfo = {
    message: " Welcom to Linux Server DevOps!",
    timestamp: new Date().toISOString(),
    server: {
      hostname: os.hostname(),
      platform: os.platform(),
      architecture: os.arch(),
      uptime: Math.floor(os.uptime() / 60) + " Minutes",
      memory: {
        total: Math.round(os.totalmem() / (1024 * 1024)) + " MB",
        free: Math.round(os.freemem() / (1024 * 1024)) + " MB",
      },
      cpus: os.cpus().length,
    },
    request: {
      url: req.url,
      method: req.method,
      headers: req.headers,
    },
  };

  // send respond by Json format
  res.end(JSON.stringify(serverInfo, null, 2));

  // Log request
  console.log(
    `📥 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`,
  );
});

//Start server
server.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
});

// Finish Server by signals
process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server is finish");
    process.exit(0);
  });
});

//signal : crt+C
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
