import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
  API_URL: str(),
  PORT: port() || 4000,
});
