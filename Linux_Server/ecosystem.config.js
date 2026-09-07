module.exports = {
  apps: [
    {
      name: "devops-server-app",
      script: "./server.js",
      instances: "max", // use all CPU Cores
      exec_mode: "cluster", // Cluster mode
      autorestart: true, //restart server after crashing automatically
      watch: false,
      max_memory_restart: "1G", // restart if memory reaches 1GB
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 80,
      },
      // Log configuration
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
    },
  ],
};
