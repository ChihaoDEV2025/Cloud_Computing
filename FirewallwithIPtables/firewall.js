// firewall.js - thin wrapper around the iptables CLI
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);

/**
 * Run one iptables command safely.
 * Args are passed as an ARRAY (not a shell string) to avoid injection.
 * @param {string[]} args - e.g. ['-A', 'INPUT', '-p', 'tcp']
 */
async function iptables(args) {
  // execFile does not spawn a shell, so metacharacters are not interpreted
  const { stdout } = await execFileAsync("sudo", ["iptables", ...args]);
  return stdout;
}

/** Allow inbound traffic on a validated port. */
async function allowPort(port, protocol = "tcp") {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid port: ${port}`);
  }
  if (protocol !== "tcp" && protocol !== "udp") {
    throw new Error(`Invalid protocol: ${protocol}`);
  }
  await iptables([
    "-A",
    "INPUT",
    "-p",
    protocol,
    "--dport",
    String(port),
    "-j",
    "ACCEPT",
  ]);
  console.log(`Opened port ${port}/${protocol}`);
}

/** Block a specific source IP (validate it first!). */
async function blockIp(ip) {
  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    throw new Error(`Invalid IPv4 address: ${ip}`);
  }
  await iptables(["-A", "INPUT", "-s", ip, "-j", "DROP"]);
  console.log(`Blocked IP: ${ip}`);
}

module.exports = { iptables, allowPort, blockIp };
