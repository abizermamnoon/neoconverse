
import { talkToLLM } from "../../components/llm/llmCommunication";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {

  if (req.method !== 'POST') {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { prompt, provider, model } = (await req.json()) as {
    prompt?: string;
    provider?:string;
    model:string;
  };

  return talkToLLM({ prompt, provider:process.env.DEFUALT_PROVIDER, model: process.env.DEFUALT_MODEL, llmKeys: process.env.OPENAI_API_KEY });
}

export default handler;