import OpenAI from "openai";
import { ENV } from "./env";
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: ENV.OPEN_AI_API_KEY,
});

export { openai as OpenAI };

