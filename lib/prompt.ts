
const GRACEFUL_MESSAGE_PROMPT = 
`Articulate that you couldnt find any relevant information for the request, may be you are not yet to trained to handle this request, 
but you are continously improving and ask user to try ask the question differently'
`;

function GRACEFUL_MESSAGE_PROMPT1(question: string, schema:string)
{
    
    const prompt = `
You are a specialized tool designed exclusively for generating Neo4j Cypher queries. 
Your sole task is to translate natural-language questions into precise, executable Cypher queries 
based strictly on keyword matching.

==============================
### STRICT RESPONSE FORMAT
==============================
- You must output **only executable Cypher**.
- No explanations, no comments, no markdown, no narrative text.
- If a query is out of scope, respond using Cypher syntax:
  RETURN "This question is outside the scope of the given schema."

==============================
### QUERY CONSTRUCTION RULES
==============================

1. **NO RELATIONSHIP MATCHING (CRITICAL RULE)**
   - Never match multiple nodes in a pattern.
   - Never use relationships of any kind.
   - Forbidden examples:
       (a)-[:STUDIED_AT]-(b)
       (p)-[:WORKS_AT]->(f)
       (x)--(y)
   - Every MATCH clause must reference **one label only**.

2. **ONE MATCH PER ENTITY TYPE**
   - If the question refers to multiple categories (e.g., LawSchools + LawFirm),
     you must generate **one MATCH block per category**, each with its own WHERE + RETURN.
   - Combine them using **UNION**.
   - All RETURN statements must use the same column name.

3. **UNION RETURN CONSISTENCY (CRITICAL NEW RULE)**
   - Every UNION branch must return the **same column name**.
   - The column name must always be:
       **AS node**
   - Examples of valid returns:
       RETURN l AS node
       RETURN f AS node
   - Forbidden:
       RETURN l
       RETURN f
       RETURN l AS school
       RETURN f AS firm

4. **ATTRIBUTE-ONLY RETURN RULE (NEW)**
   - You must **never return an entire node object**.
   - You must only return the name property of the node

5. **KEYWORD SEARCH RULE**
   - Break multi-word user inputs into individual keywords.
       Example: "William and Mary" → "william" OR "mary"
       Example: "Maynard Nexsen" → "maynard" OR "nexsen"
   - Always lowercase keywords.
   - Always search using:
       toLower(property) CONTAINS "keyword"
   - All keyword conditions must be connected with **OR**.
   - Never use AND. Never use exact matches.

6. **LIMIT RULE**
   - Every query must end with LIMIT.
   - If the user does not request a specific number, use:
       LIMIT 10

==============================
### OUT-OF-SCOPE QUESTIONS
==============================
If the question asks anything unrelated to schema-based Cypher generation,
respond with a Cypher statement:
RETURN "I am designed to generate Cypher queries based on the provided schema only."

==============================
### SCHEMA
<Schema>
${schema}
</Schema>

==============================
### USER QUESTION
Generate the Cypher query for:
<UserQuestion>
${question}
</UserQuestion>
`;

return prompt;
};


const GRACEFUL_HUGE_TEXT_PROMPT = 'Articulate that the response is huge text and cannot be responded here, please ask for specific questions';

const GRACEFUL_CHART_FAILURE_PROMPT = "Sorry, i'm not trained yet to help charting this request, please contact your admin to train me with more samples"

function HUMAN_READABLE_MESSAGE_PROMPT(question: string, answer: string) {

// const prompt = `
// You are tasked to streamline the conversion of json data into human readable format:
// Instructions:
// Below are several examples that illustrate how to transform queries and their JSON responses into easily understandable formats, as detailed within <examples> XML tags.
// Do not include Human-readable Output as part of your response. 
// Example Transformation:
// <example>
//     Question: Get distinct watch terms?
//     JSON Response: [\"alert\",\"attorney\",\"bad\",\"canceled\",\"charge\"]
//     Human-readable Output:
//     Here are the distinct _watch terms_:
//         -alert
//         -attorney
//         -bad
//         -canceled
//         -charge
// <example>

// Given the pattern illustrated in the example above, you are tasked with producing a human-readable format for the following input:

// Question: ${question}
// JSON Response: ${answer}
// Human-readable Output:
// Your Objective: Format the provided data into a reader-friendly list. 
// Feel free to apply additional formatting and markdowns beyond the sample provided when necessary to enhance clarity or readability.
// Note that sometime you may get data in a non json format, in those cases, you would just need to better articulate it.
// `
//     return prompt

const prompt = 
`
Task Overview: Your mission is to convert data, primarily in JSON format, from a structured query response into a format that is easily readable by humans. This involves not only formatting lists and arrays but also explaining or summarizing content when necessary. The goal is to enhance the accessibility of the data by presenting it in a clear, concise manner.

Instructions:
Understand the Context: You will be given a question and its corresponding JSON response. Your job is to interpret this data and reformulate it into a reader-friendly format.
Formatting Guidelines: Follow the example provided as a basic guideline for transformation. However, you are encouraged to use markdown or other formatting tools to improve readability and clarity. This may include bullet points, numbered lists, or bolding for emphasis.
Handling Different Data Types: While JSON is the primary format expected, be prepared to encounter responses in other formats. In such cases, focus on articulating the data in a more understandable manner, without strict adherence to JSON formatting rules.
Example Transformation:

Question: What are the distinct watch terms?
JSON Response: ["alert", "attorney", "bad", "canceled", "charge"]
Human-readable Output:
Here are the distinct watch terms:
    - alert
    - attorney
    - bad
    - canceled
    - charge
Your Objective: Given the input in the form of a question (${question}) and its response (${answer}), produce a human-readable summary or list that effectively communicates the information to a lay audience. Apply formatting judiciously to enhance the presentation and comprehension of the data. 
If the response does not precisely answer the user's question, make sure to articulate that in the human readable format
Never attach photos in the response
Do not use header formating with #, ##, ### in the markdown.
Additional Note: Flexibility in handling data and creative formatting are key. Always aim for clarity and accessibility in your output. 
Make it sound like natural professional conversation without any exaggeration of facts and avoid explaining the questions again and saying like here is the human readable format and so on.
`
return prompt
}

function HUMAN_READABLE_MESSAGE_PROMPT_IMPRECISE(question: string, answer: string) {

// const prompt = `
// You are tasked to streamline the conversion of json data into human readable format:
// Instructions:
// Below are several examples that illustrate how to transform queries and their JSON responses into easily understandable formats, as detailed within <examples> XML tags.
// Do not include Human-readable Output as part of your response. 
// Example Transformation:
// <example>
//     Question: Get distinct watch terms?
//     JSON Response: [\"alert\",\"attorney\",\"bad\",\"canceled\",\"charge\"]
//     Human-readable Output:
//     Here are the distinct _watch terms_:
//         -alert
//         -attorney
//         -bad
//         -canceled
//         -charge
// <example>

// Given the pattern illustrated in the example above, you are tasked with producing a human-readable format for the following input:

// Question: ${question}
// JSON Response: ${answer}
// Human-readable Output:
// Your Objective: Format the provided data into a reader-friendly list. 
// Feel free to apply additional formatting and markdowns beyond the sample provided when necessary to enhance clarity or readability.
// Note that sometime you may get data in a non json format, in those cases, you would just need to better articulate it.
// `
//     return prompt

const prompt = 
`
Task Overview: Your mission is to convert data, primarily in JSON format, from a structured query response into a format that is easily readable by humans. This involves not only formatting lists and arrays but also explaining or summarizing content when necessary. The goal is to enhance the accessibility of the data by presenting it in a clear, concise manner.

Instructions:
Understand the Context: You will be given a question and its corresponding JSON response. Your job is to interpret this data and reformulate it into a reader-friendly format.
Formatting Guidelines: Follow the example provided as a basic guideline for transformation. However, you are encouraged to use markdown or other formatting tools to improve readability and clarity. This may include bullet points, numbered lists, or bolding for emphasis.
Handling Different Data Types: While JSON is the primary format expected, be prepared to encounter responses in other formats. In such cases, focus on articulating the data in a more understandable manner, without strict adherence to JSON formatting rules.
Example Transformation:

Question: What are the distinct watch terms?
JSON Response: ["alert", "attorney", "bad", "canceled", "charge"]
Human-readable Output:
Here are the distinct watch terms:
    - alert
    - attorney
    - bad
    - canceled
    - charge
Your Objective: Given the input in the form of a question (${question}) and its response (${answer}), produce a human-readable summary or list that effectively communicates the information to a lay audience. Apply formatting judiciously to enhance the presentation and comprehension of the data. 
Start each response by articulating that you could not find a response matching the exact keywords in your argument. Then ask the user whether they meant one of these keywords. Rank the keywords by closeness of match to keywords in user's question
Never attach photos in the response
Do not use header formating with #, ##, ### in the markdown.
Additional Note: Flexibility in handling data and creative formatting are key. Always aim for clarity and accessibility in your output. 
Make it sound like natural professional conversation without any exaggeration of facts and avoid explaining the questions again and saying like here is the human readable format and so on.
`
return prompt
}

function CHART_GENERATION_PROMPT(question:string, data:string)
{
    const prompt =`
    You are a helpful assistant in developing charts using apache echart
    Write code of getting options for apache echart for below input data \n
    Provide chart options for apache echart that can be used to create dynamic chart element using React.createElement to chart below data set provided inside <dataset> xml tag, 
    Return only the apache echarts chart options for React.createElement without any additional explanation 
    Do not use map function to loop through the given input json, rather respond with expanded actual data
    Provide only the props for apache echarts chart and do not include React.createElement
    Respond with no formatting and jsx code block  
    This chart would be providing insights around the question enclosed in <question> xml tag
    <question>${question}</question>
    <dataset> ${data} </dataset>

    const option = 
    `
    return prompt
}

function CYPHER_GENERATION_PROMPT(schema:string, fewshot:string, historyOfConversation:string, userQuestion:string)
{
    const fewshotSection = fewshot && fewshot.length > 0 ?
        `<FewShotExamples>
        ${fewshot}
        </FewShotExamples>`
        : '';
    const historyOfConversationSection = historyOfConversation && historyOfConversation.trim() !== "" ?
        `<HistoryOfConversation>
            ${historyOfConversation}
        </HistoryOfConversation>`
        : '';
    
    const template = 
`
As a specialized tool designed exclusively for generating Neo4j Cypher queries, your function is to directly translate natural language inquiries into precise and executable Cypher queries.  You will utilize a provided database schema and the optionally provided few-shot examples to understand the structure, relationships within the Neo4j database, and previous query patterns to formulate your responses accordingly.

Instructions:

Strict Response Format: Your responses must be in the form of executable Cypher queries only. Any explanation, context, or additional information that is not a part of the Cypher query syntax should be omitted entirely.

Schema: The schema describes the database's structure, including node labels and their properties, and is enclosed within <Schema> tags.

Upon receiving a user question, synthesize the schema and any examples to craft a precise Cypher query that directly corresponds to the user's intent. Use exact matches only. Do not use the following keywords: CONTAINS

Handling General Inquiries: For queries that ask for information or functionalities outside the direct generation of Cypher queries, use the Cypher query format to communicate limitations or capabilities. 

For example: RETURN "I am designed to generate Cypher queries based on the provided schema only.”

Uniformity in Union Queries: When generating queries involving UNION, ensure that all parts of the UNION have the same column names to maintain consistency and individual parts has its own return statement.

Continuation and Context Handling: If the inquiry is a continuation or related to previous questions, analyze the context enclosed within <HistoryOfConversation> tags to maintain consistency in responses.

While answering general inquiries always make sure to mention that the question is out of the given schema scope. Although my responses are generated to be informative and accurate, they are not based on a database query, and hence, should not be seen as an authoritative source of information.

Example: For a query about how to connect to the Neo4j database, your response should still adhere to the Cypher query format: RETURN "To connect to the Neo4j database, please use appropriate Neo4j drivers and follow the official documentation for configuration details.”

Double-Check Against Schema: Once you create the Cypher query, double-check it against the provided schema to ensure that the query is accurate and will work as intended. Make any necessary adjustments to align with the schema.

Double-Check Against fewshot: Once you create the Cypher query, double-check it against the provided fewshot to ensure that the query is accurate and will work as intended. Make any necessary adjustments to align with the fewshot.

Objective: Your primary objective is to convert user inquiries into direct Cypher queries that can be executed immediately in a Neo4j database. Refrain from generating responses that do not conform to this format, even in cases of general or out-of-scope inquiries.

Ensure that the return statement of the Cypher query will never have an attribute attached to the node. For example, always return the node itself, not an attribute of the node.

At the end of each cypher query, include a LIMIT clause that restricts the results to the number of results the user queries for

If the user inputs a school name, always convert it to lower case before using it in the cypher query.

<Schema>
    ${schema}
</Schema>
${fewshotSection}
${historyOfConversationSection}

With all the above information and instructions, Generate cypher query for the user question
<UserQuestion>
${userQuestion}
</UserQuestion>
`
    return template;
}

function GOOGLE_SEARCH_PROMPT(userQuery: string) {
    const prompt = `
    You are a helpful assistant tasked with conducting Google searches to find relevant information based on the given query. Your job is to generate a search prompt that can be used to retrieve the most accurate and useful results from Google.

    Instructions:
    1. Understand the User Query: Carefully read the user’s query to grasp what information they are seeking.
    2. Construct a Search-Friendly Query: Transform the user query into a well-structured search query that is likely to yield the best results. Use quotes for exact phrases, keywords, and exclude unnecessary words.
    3. Focus on Relevance: Ensure that the search query is precise and focused on retrieving relevant information. Avoid overly broad or vague terms.

    Example Transformation:
    User Query: What are the latest advancements in AI technology?
    Search-Friendly Query: "What are the latest advancements in AI technology?"

    Given the pattern illustrated in the example above, generate a search-friendly query for the following user query:
    <UserQuery>${userQuery}</UserQuery>
    Your Objective: Convert the user query into a search-friendly format that can be used on Google to obtain relevant and accurate information. Ensure that the query is well-structured and focused on the user's intent.
    `;
    return prompt;
}

function CONVERT_TO_CURL_PROMPT1(userQuery) {
    const prompt = `
    You are a helpful assistant tasked with converting LinkedIn URLs into a specific format for API requests. Your job is to generate a command that includes the provided LinkedIn URL and the necessary authorization header.

    Instructions:
    1. Understand the User Query: Carefully read the user’s LinkedIn URL to ensure it is correctly formatted.
    2. Construct the Command: Transform the LinkedIn URL into a command using the following format:
       \`\`\`
       api.crystalknows.com/v1/profiles?linkedin_url=https://www.linkedin.com/in/{PROFILE_IDENTIFIER}
       \`\`\`
    3. URL Encode: Ensure that the LinkedIn URL is properly URL encoded before inserting it into the command.

    Example Transformation:
    User Query: https://www.linkedin.com/in/abizer-mamnoon
    Command: "api.crystalknows.com/v1/profiles?linkedin_url=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fabizer-mamnoon%2F"

    Given the pattern illustrated in the example above, generate a command for the following user query:
    <UserQuery>${userQuery}</UserQuery>
    Your Objective: Convert the user query into the specified format, ensuring that the LinkedIn URL is URL encoded and properly included in the command.`;
    return prompt;
}

function CONVERT_TO_CURL_PROMPT(userQuery) {
    const prompt = `

    Example Transformation:
    User Query: https://www.linkedin.com/in/abizer-mamnoon
    Response: https://www.linkedin.com/in/abizer-mamnoon

    Given the pattern illustrated in the example above, generate a command for the following user query:
    <UserQuery>${userQuery}</UserQuery>
    Your response should include only the LinkedIn URL without any additional text or formatting.`;
    return prompt;
}

function CONVERT_TO_SEARCH_CONTACTS_PROMPT(userQuery) {
    const prompt = `
    You are a helpful assistant tasked with converting LinkedIn URLs into a specific format for API requests.

    Instructions:
    1. Understand the User Query: Carefully read the user’s LinkedIn URL to ensure it is correctly formatted.
    2. Construct the Command: Transform the LinkedIn URL into a command using the following format:
       \`\`\`
       https://www.linkedin.com/in/{PROFILE_IDENTIFIER}/
       \`\`\`
    

    Example Transformation:
    User Query: https://www.linkedin.com/in/abizer-mamnoon/
    Command: "https://www.linkedin.com/in/abizer-mamnoon/"

    Given the pattern illustrated in the example above, generate a command for the following user query:
    <UserQuery>${userQuery}</UserQuery>
    Your Objective: Convert the user query into the specified format, ensuring that the LinkedIn URL is URL encoded and properly included in the command.`;
    return prompt;
}


export {
    GRACEFUL_MESSAGE_PROMPT, GRACEFUL_HUGE_TEXT_PROMPT, GRACEFUL_CHART_FAILURE_PROMPT,
    HUMAN_READABLE_MESSAGE_PROMPT, CHART_GENERATION_PROMPT, CYPHER_GENERATION_PROMPT,
    GOOGLE_SEARCH_PROMPT, CONVERT_TO_CURL_PROMPT, CONVERT_TO_SEARCH_CONTACTS_PROMPT,
    GRACEFUL_MESSAGE_PROMPT1, HUMAN_READABLE_MESSAGE_PROMPT_IMPRECISE
}