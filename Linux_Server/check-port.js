//Net
const net = require("net");

//List of Available Port
const requirePort = [
  { port: 22, service: "SSH", description: "Remote connection" },
  { port: 80, service: "HTTP", description: "Web server" },
  { port: 443, service: "HTTPS", description: "Security Web Server" },
  { port: 3000, service: "Node.js App", description: "Demo Application" },
];

//Check Port Gate's Status
requirePort.forEach(({ port, service, description }) => {
  const tester = net.createConnection({ port, host: "localhost" }, () => {
    console.log(`Port: ${port} (${service}) - ${description}: Starting`);
    tester.end();
  });

  tester.on("error", (err) => {
    console.log(
      ` Port: ${port} (${service}) - ${description}: Closing or no response`,
    );
  });

  tester.setTimeout(1000);
});
