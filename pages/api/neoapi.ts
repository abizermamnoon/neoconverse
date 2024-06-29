
//import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';
import CryptoJS from "crypto-js";
import { NeoDatabaseConstants } from "../../components/database/constants";
import { BackEndAgentQuery } from "../../agents/agentRegistry";
import { Agent } from "../../agents/agent";
import { runCypher } from "../../components/database/callNeo";

export const config = {
  runtime: "edge",
};

// this is to overcome runtime errors where it's looking for window
//   without this you get: err:  [ReferenceError: window is not defined]
if (global && typeof global.window === 'undefined') {
  global.window = {};
  // used in bolt-agent.js
  global.window.navigator = {};
  // we'll pretend that this is our browser
  global.window.navigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36';
}


const NeoDatabaseBackendConfig: Agent = {
  key: NeoDatabaseConstants.BackendDatabaseKey,
  databaseInfo: {
    databaseName: '',
    hostUrl: process.env.NEXT_PUBLIC_BACKEND_HOST, 
    username: process.env.NEXT_PUBLIC_BACKEND_UNAME,
    password: process.env.NEXT_PUBLIC_BACKEND_PWD
  }
}
console.log('NeoDatabaseBackendConfig:', NeoDatabaseBackendConfig);

let NeoAgents: Map<String, Agent> = new Map();

const initAgents = async () => {
  try {
    // Run the initial query to populate agents
    let result = await run(NeoDatabaseConstants.BackendDatabaseKey, BackEndAgentQuery);
    result
      .map(row => row.agentInfo)
      .forEach(row => {
        NeoAgents.set(row.key, {
          key: row.key,
          databaseInfo: {
            ...row.databaseInfo,
            password: decrypt(row.databaseInfo.password)
          }
        });
        console.log(`Agent ${row.key} configured successfully`);
      });
  } catch (err) {
    console.error("Error initializing agents:", err);
    throw err;
  }
};


const decrypt = (encryptedString) => {
  let bytes = CryptoJS.AES.decrypt(encryptedString, process.env.ENCRYPTION_KEY)
  var decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedString;
}

const run = async (agentName: string, cypher: string, options: Map<string, any> = new Map()) => {
  console.log(`Running cypher query for agent: ${agentName}`);
  let neoAgent = NeoAgents.get(agentName) || NeoDatabaseBackendConfig;

  const databaseInfo = neoAgent.databaseInfo;
  if (!databaseInfo) {
    throw new Error(`NeoAgent '${agentName}' has no configured database`);
  }

  return runCypher(databaseInfo, cypher, options);
};

const handler = async (req: Request): Promise<Response> => {
  //res.status(200).json({ name: 'John Doe' })
  console.log("Handler invoked");
  let json = await req.json();
  console.log('json: ', json);
  const { agentName, cypherQuery, options } = json;
  try {
    console.log("Executing cypher query...");
    //console.log("before run");
    const result = await run(agentName, cypherQuery, options);
    console.log("Query result:", result);
    //console.log("result: ", result);
    return new Response(JSON.stringify({ result }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error("Error executing cypher query:", err);
    return new Response(JSON.stringify({ error: err.toString() }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  } 
};

initAgents()
  .then(() => console.log("Agents initialized successfully"))
  .catch((err) => console.log("Error initializing agents:", err));

//export default withApiAuthRequired(handler);
export default handler;

