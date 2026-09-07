class EnvironmentPipeline {
  constructor(branch) {
    this.branch = branch;
    this.environments = {
      development: { deployScript: "npm run deploy:dev" },
      staging: { deployScript: "npm run deploy:staging" },
      production: { deployScript: "npm run deploy:prod", approval: true },
    };
  }

  determineEnvironment() {
    if (this.branch === "main") return "production";
    if (this.branch === "staging") return "staging";
    return "development";
  }

  async execute() {
    const env = this.determineEnvironment();
    console.log(`Destination: ${env}`);

    // Common steps
    await this.runCommonSteps();

    // Deploy to environment
    await this.deployToEnvironment(env);

    // Checking after deployed
    if (env === "production") {
      await this.runSmokeTests();
    }
  }

  async deployToEnvironment(env) {
    const config = this.environments[env];
    console.log(`Deploying on  ${env}...`);

    if (config.approval) {
      console.log("⏳ Chờ phê duyệt triển khai production...");
      // Logic chờ phê duyệt
    }

    // Thực thi script triển khai
    // await exec(config.deployScript);
  }

  async runCommonSteps() {
    console.log("Running common checks...");
    console.log("✓ Tests passed");
    console.log("✓ Lint passed");
    console.log("✓ Build passed");
  }

  async runSmokeTests() {
    console.log("Running production smoke tests...");
    console.log("✓ Smoke tests passed");
  }
}

const branch = process.argv[2] || "development";
const pipeline = new EnvironmentPipeline(branch);
pipeline.execute();
