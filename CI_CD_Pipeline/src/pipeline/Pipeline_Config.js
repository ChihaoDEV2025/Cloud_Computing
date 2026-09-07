// pipeline-config.js - Cấu hình pipeline đơn giản
const LinearPipeline = {
  stages: [
    {
      name: "Retrieve Program",
      script: "git clone https://github.com/your-repo.git",
    },
    {
      name: "Install Dependencies",
      script: "npm install",
    },
    {
      name: "Run test",
      script: "npm test",
    },
    {
      name: "Build Application",
      script: "npm run build",
    },
    {
      name: "Deploy",
      script: "npm run deploy",
    },
  ],
};

// Simulate Linear Pipeline process
async function executeLP(pl) {
  for (const stage of pl.stages) {
    console.log(`Implementing: ${stage.name}`);
  }
  console.log("Pipeline is done!");
}
