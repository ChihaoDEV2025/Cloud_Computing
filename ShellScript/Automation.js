#!/usr/bin/env node
const os = require("os");
const fs = require("fs");

function checkSystemResources() {
  console.log("System Resources");

  // CPU
  console.log(`CPU: ${os.cpus().length} cores`);
  console.log(`CPU Architecture: ${os.arch()}`);

  // TMemory
  const totalMem = os.totalmem() / 1024 ** 3; // GB
  const freeMem = os.freemem() / 1024 ** 3; // GB
  const usedMem = totalMem - freeMem;

  console.log(`Total memory: ${totalMem.toFixed(2)} GB`);
  console.log(`Used Memory: ${usedMem.toFixed(2)} GB`);
  console.log(`Free Memory: ${freeMem.toFixed(2)} GB`);
  console.log(`Used Memory Rate: ${((usedMem / totalMem) * 100).toFixed(1)}%`);

  // System
  console.log(`Operation System: ${os.platform()} ${os.release()}`);
  console.log(`User: ${os.userInfo().username}`);
  console.log(`Home Direction: ${os.homedir()}`);

  //Log
  const logData = {
    timestamp: new Date().toISOString(),
    memoryUsage: `${((usedMem / totalMem) * 100).toFixed(1)}%`,
    freeMemoryGB: freeMem.toFixed(2),
    cpuCores: os.cpus().length,
  };

  fs.writeFileSync("/tmp/system-check.log", JSON.stringify(logData, null, 2));

  console.log("Save at:  /tmp/system-check.log");
}

//run
checkSystemResources();
