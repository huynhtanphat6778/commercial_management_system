import { createApp } from "./app.ts";
import { loadEnv } from "./config/env.ts";

const env = loadEnv();
const app = createApp({ corsOrigin: env.corsOrigin });

app.listen(env.port, () => {
  console.log(`Backend dang chay tai http://localhost:${env.port}/api/v1/health`);
});
