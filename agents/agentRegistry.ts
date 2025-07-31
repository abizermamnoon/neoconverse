import { NeoDatabaseConstants } from '../components/database/constants';
import { runNeoApi } from '../components/database/runNeoApi';
import RealEstatePromptProvider from './neo4j/realestate';
import { loadLocalAgents, addAgent, removeAgent } from './localAgents';

// export const FrontEndAgentQuery = `
// MATCH (dbConnection:DBConnection)-[:DB_HAS_AGENT]->(agent:NeoAgent)
// WHERE agent.isActive = true
// RETURN { 
//     key: agent.agent_name,
//     title: agent.title,
//     description: agent.description,
//     icon: agent.icon,
//     dataModelPath: agent.dataModelPath,
//     order: agent.order,
//     promptParts: {
//         dataModel: head([(agent)-[:MODEL_PROMPT]->(model) | model.prompt ]), 
//         fewshot: head([(agent)-[:FEWSHOT_PROMPT]->(fewshot) | fewshot.prompt ])
//     }
// } as agentInfo
// ORDER BY agent.order
// `;

// export const BackEndAgentQuery = `
// MATCH (dbConnection:DBConnection)-[:DB_HAS_AGENT]->(agent:NeoAgent)
// WHERE agent.isActive = true
// RETURN { 
//     key: agent.agent_name,
//     databaseInfo: dbConnection {.*}
// } as agentInfo
// `;

const PredefinedPromptProviders = {
    RealEstate: new RealEstatePromptProvider()
}

const initialAgentData = {
    aiService: 'Open AI',
    title: 'Talent Engines Bot',
    key: 'tbot',
    description: '',
    schema: `{
    "attorneys": ["attorney_id", "email", "firstName", "lastName", "lawSchool", "schoolID", "location", "phone", "country", "firmId", "services", "url", "biography", "FirmName", "lawSchoolYear", "position", "services_list", "state", "position.1", "biography.1", "barAdmission_1", "middleInitial", "middleInitial.1", "undergradschool", "undergradyear", "practice_area_1", "lawschoolHonors", "UndergradHonors", "linkedin", "languages", "undergradDegree", "lawSchoolDegree", "memberships", "courtAdmissions", "practice_group", "Photo URL", "Industry Focus", "specialties", "Office(s)"]
    "States": ["state", "name", "creation_date", "latitude", "longitude", "countryid"]
    "Cities": ["country", "state", "latitude", "longitude", "countryid", "city_id", "city"]
    "Position": ["positionID", "Name"]
    "LawSchools": ["schoolID", "name", "Rank", "City", "State", "enrollment_full_time", "median_lsat", "Academic", "Employer", "Citations", "H", "Score", "tuition"]
    "LawFirm": ["firmId", "firm_name", "Location", "Global_200", "Am_Law_200", "NLJ_500", "Associates", "Equity_Partners", "Global_Rank", "Non_Equity_Partners", "Profit_Per_Equity_Partner", "Revenue_Per_Lawyer", "Total_Headcount", "Total_Offices", "Total_Revenue"]
    "Specialties": ["name", "creation_date", "specialtyID", "practice_area", "practiceID"]
    "PracticeAreas": ["name", "practise_area_id", "creation_date"]
    "StateBars": ["name", "barID"]
    "Honors": ["honor_id", "name"]
    }
    | Start Node              | Relationship       | End Node                     |
|-------------------------|--------------------|------------------------------|
| attorneys               | HAS_EXPERIENCE     | PracticeAreas, Specialties      |
| attorneys               | LIVES_IN           | States, Cities                         |
| Cities | located_at | States                |
| attorneys               | STUDIED_AT         | LawSchools                       |
| attorneys               | ADMITTED_BY        | StateBars                    |
| attorneys               | WORKS_AT           | LawFirm|
| attorneys               | HAS                | Position, Honors                  |
    `,
    fewshot: [{ question: 'What honor has Keith Blackman achieved?', answer: "MATCH (a:attorneys) WHERE a.lastName = 'Blackman' AND a.firstName = 'Keith' MATCH (a)-[:HAS]-(h:Honors)  RETURN h;" },
            { question: 'What honor has Mark Shutt achieved?', answer: "MATCH (a:attorneys) WHERE a.lastName = 'Shutt' AND a.firstName = 'Mark' OPTIONAL MATCH (a)-[:HAS]-(h:Honors)  RETURN h;" },
            { question: 'What state bar has Keith Blackman been admitted?', answer: "MATCH (a:attorneys) WHERE a.lastName = 'Blackman' AND a.firstName = 'Keith' MATCH (a)-[:ADMITTED_BY]-(bar:StateBars)  RETURN bar;" },
            { question: 'What state bar has Sarah Primrose been admitted?', answer: "MATCH (a:attorneys) WHERE a.lastName = 'Primrose' AND a.firstName = 'Sarah' MATCH (a)-[:ADMITTED_BY]-(bar:StateBars)  RETURN bar;" },
            { question: 'What state bar has Philip Wong been admitted?', answer: "MATCH (a:attorneys) WHERE a.lastName = 'Wong' AND a.firstName = 'Philip' MATCH (a)-[:ADMITTED_BY]-(bar:StateBars)  RETURN bar;" },
            { question: 'What law school did Joshua Spielman attend?', answer: "MATCH(a:attorneys) where a.lastName ='Spielman' and a.firstName ='Joshua' MATCH (a)-[:STUDIED_AT]-(s:LawSchools)  Return s LIMIT 1" },
            { question: 'What law school did Matthew Wochok attend?', answer: "MATCH(a:attorneys) where a.lastName ='Wochok' and a.firstName ='Matthew' MATCH (a)-[:STUDIED_AT]-(s:LawSchools)  Return s LIMIT 1" },
            { question: 'Who studied at harvard university?', answer: "MATCH (s:LawSchools)-[:STUDIED_AT]-(a:attorneys) WHERE s.name ='harvard university' return a LIMIT 25" },
            { question: 'What law firm does Jeffrey Mayer work?', answer: "MATCH(a:attorneys) where a.lastName ='Mayer' and a.firstName ='Jeffrey' MATCH (a)-[:WORKS_AT]-(lf:LawFirm) Return lf LIMIT 1" },
            { question: 'Who went to the same law school as Joshua Spielman?', answer: "MATCH (a:attorneys {firstName: 'Joshua', lastName: 'Spielman'})-[:WORKS_AT]->(f:LawFirm) WITH a, f, a.lawSchool AS targetLawSchool, a.attorney_id AS selfID MATCH (colleague:attorneys)-[:WORKS_AT]->(f) WHERE colleague.lawSchool = targetLawSchool AND colleague.attorney_id <> selfID RETURN colleague.firstName + ' ' + colleague.lastName AS ColleagueName, colleague.lawSchool AS LawSchool, f.firm_name AS LawFirm" },
            { question: 'Who went to the same undergraduate school as Jared Allen?', answer: "MATCH (a:attorneys {firstName: 'Jared', lastName: 'Allen'})-[:WORKS_AT]->(f:LawFirm) WITH a, f, a.undergradschool AS targetUndergrad, a.attorney_id AS selfID MATCH (colleague:attorneys)-[:WORKS_AT]->(f) WHERE colleague.undergradschool = targetUndergrad AND colleague.attorney_id <> selfID RETURN colleague.firstName + ' ' + colleague.lastName AS ColleagueName, colleague.undergradschool AS UndergradSchool, f.firm_name AS LawFirm" },
            { question: 'Who went to the same law school and graduated in the same year as Jared Allen?', answer: "MATCH (a:attorneys {firstName: 'Jared', lastName: 'Allen'}) WITH a.lawSchool AS targetSchool, a.lawSchoolYear AS targetYear, a.attorney_id AS selfID MATCH (peer:attorneys) WHERE peer.lawSchool = targetSchool AND peer.lawSchoolYear = targetYear AND peer.attorney_id <> selfID RETURN peer.firstName + ' ' + peer.lastName AS PeerName, peer.lawSchool AS LawSchool, peer.lawSchoolYear AS GraduationYear" },
            { question: 'Who went to the same law school and undergraduate school as Alan Pryor?', answer: "MATCH (a:attorneys {firstName: 'Alan', lastName: 'Pryor'})-[:WORKS_AT]->(f:LawFirm) WITH a, f, a.lawSchool AS targetLawSchool, a.undergradschool AS targetUndergrad MATCH (colleague:attorneys)-[:WORKS_AT]->(f) WHERE colleague.attorney_id <> a.attorney_id RETURN a.firstName + ' ' + a.lastName AS Attorney, f.firm_name AS LawFirm, count(CASE WHEN colleague.lawSchool = targetLawSchool THEN 1 END) AS sameLawSchoolCount, count(CASE WHEN colleague.undergradschool = targetUndergrad THEN 1 END) AS sameUndergradSchoolCount" },
            { question: 'What are the top 3 feeder law schools at Simpson Thacher?', answer: "MATCH (a:attorneys)-[:WORKS_AT]->(f:LawFirm {firm_name: 'Simpson Thacher'}) MATCH (a)-[:STUDIED_AT]->(sch:LawSchools) RETURN sch.name AS LawSchool, count(*) AS Count ORDER BY Count DESC LIMIT 3" },
            { question: 'What are the top 3 feeder undergraduate schools at Simpson Thacher?', answer: "MATCH (a:attorneys)-[:WORKS_AT]->(f:LawFirm {firm_name: 'Simpson Thacher'}) WHERE a.undergradschool IS NOT NULL RETURN a.undergradschool AS UndergradSchool, count(*) AS Count ORDER BY Count DESC LIMIT 3" },
            { question: 'What are the top 3 feeder law schools and undergraduate schools at Simpson Thacher?', answer: "MATCH (a1:attorneys)-[:WORKS_AT]->(:LawFirm {firm_name: 'Simpson Thacher'}), (a1)-[:STUDIED_AT]->(sch1:LawSchools) RETURN 'Law School' AS Type, sch1.name AS School, count(*) AS Count ORDER BY Count DESC LIMIT 3 UNION ALL MATCH (a2:attorneys)-[:WORKS_AT]->(:LawFirm {firm_name: 'Simpson Thacher'}) WHERE a2.undergradschool IS NOT NULL RETURN 'Undergrad School' AS Type, a2.undergradschool AS School, count(*) AS Count ORDER BY Count DESC LIMIT 3" },
            { question: 'What is the headcount of partners and associates in each practice area at Akerman?', answer: "MATCH (a:attorneys)-[:WORKS_AT]->(lf:LawFirm {firm_name: 'Akerman'}), (a)-[:HAS_EXPERIENCE]->(p:PracticeAreas) WHERE toLower(p.name) = 'real estate' RETURN p.name AS Practice_Area, count(DISTINCT CASE WHEN toLower(a.position) CONTAINS 'partner' THEN a END) AS Partners, count(DISTINCT CASE WHEN toLower(a.position) CONTAINS 'associate' THEN a END) AS Associates" },
            { question: 'What is the proportion of attorneys that went to the same law school as Jeffery Belkin?', answer: "MATCH (a:attorneys {firstName: 'Jeffrey', lastName: 'Belkin'})-[:STUDIED_AT]->(ls:LawSchools), (a)-[:WORKS_AT]->(lf:LawFirm) WITH ls.name AS lawSchool, lf.firm_name AS lawFirm MATCH (x:attorneys)-[:STUDIED_AT]->(:LawSchools {name: lawSchool}), (x)-[:WORKS_AT]->(:LawFirm {firm_name: lawFirm}) WITH lawSchool, lawFirm, count(DISTINCT x) AS sameSchoolAtFirm MATCH (y:attorneys)-[:WORKS_AT]->(:LawFirm {firm_name: lawFirm}) WITH lawSchool, lawFirm, sameSchoolAtFirm, count(DISTINCT y) AS totalAtFirm RETURN lawSchool AS Law_School, lawFirm AS Law_Firm, sameSchoolAtFirm AS Attorneys_From_Same_School, totalAtFirm AS Total_At_Firm, round(toFloat(sameSchoolAtFirm) / totalAtFirm, 4) AS Proportion_School_At_Firm" },
            { question: 'How many alumni from George Washington University work at DLA Piper?', answer: "MATCH (a:attorneys)-[:STUDIED_AT]->(ls:LawSchools {name: 'george washington university'}), (a)-[:WORKS_AT]->(lf:LawFirm {firm_name: 'DLA Piper'}) WITH count(DISTINCT a) AS schoolAttorneysAtFirm MATCH (a2:attorneys)-[:WORKS_AT]->(:LawFirm {firm_name: 'DLA Piper'}) WITH schoolAttorneysAtFirm, count(DISTINCT a2) AS totalAtFirm RETURN schoolAttorneysAtFirm AS School_Attorneys_At_Firm, totalAtFirm AS Total_Attorneys_At_Firm, round(toFloat(schoolAttorneysAtFirm) / totalAtFirm, 4) AS Proportion" },
            { question: 'Provide a list of attorneys from Akermen in order of law school graduation year?', answer: "MATCH (a:attorneys)-[:WORKS_AT]->(lf:LawFirm {firm_name: 'Akerman'}), (a)-[:STUDIED_AT]->(sch:LawSchools) WHERE a.lawSchoolYear = 2015 RETURN a.firstName + ' ' + a.lastName AS AttorneyName, sch.name AS LawSchool, a.lawSchoolYear AS GraduationYear, lf.firm_name AS LawFirm ORDER BY AttorneyName" },
            { question: 'What is the proportion of Attorneys with “Partner” titles at Akerman compared to the Am Law 200 average?', answer: "CALL { MATCH (a:attorneys)-[:WORKS_AT]->(f:LawFirm) WHERE f.firm_name = 'Akerman' RETURN f.firm_name AS Firm, count(a) AS TotalAttorneys, count(CASE WHEN toLower(trim(a.position)) CONTAINS 'partner' THEN 1 END) AS Partners } CALL { MATCH (a2:attorneys)-[:WORKS_AT]->(f2:LawFirm) WHERE f2.Am_Law_200 IS NOT NULL WITH f2.firm_name AS FirmName, count(a2) AS Total, count(CASE WHEN toLower(trim(a2.position)) CONTAINS 'partner' THEN 1 END) AS FirmPartners RETURN avg(100.0 * FirmPartners * 1.0 / Total) AS AvgPartnerPct } RETURN Firm, TotalAttorneys, Partners, round(100.0 * Partners * 1.0 / TotalAttorneys, 1) AS PartnerPct, round(AvgPartnerPct, 1) AS AvgPartnerPct_AmLaw200" },
            { question: 'What is the proportion of Attorneys with Associate titles at Akerman compared to the Am Law 200 average?', answer: "CALL {MATCH (a:attorneys)-[:WORKS_AT]->(f:LawFirm) WHERE f.firm_name = 'Akerman' RETURN f.firm_name AS Firm, count(a) AS TotalAttorneys, count(CASE WHEN toLower(trim(a.position)) CONTAINS 'associate' THEN 1 END) AS Associates} CALL {MATCH (a2:attorneys)-[:WORKS_AT]->(f2:LawFirm) WHERE f2.Am_Law_200 IS NOT NULL WITH f2.firm_name AS FirmName, count(a2) AS Total, count(CASE WHEN toLower(trim(a2.position)) CONTAINS 'associate' THEN 1 END) AS FirmAssociates RETURN avg(100.0 * FirmAssociates * 1.0 / Total) AS AvgAssociatePct} RETURN Firm, TotalAttorneys, Associates, round(100.0 * Associates * 1.0 / TotalAttorneys, 1) AS AssociatePct, round(AvgAssociatePct, 1) AS AvgAssociatePct_AmLaw200" },
            { question: 'What is the partner to associate ratio for Fox Rothschild?', answer: "MATCH (a:attorneys)-[:WORKS_AT]->(lf:LawFirm), (a)-[:HAS]->(pos:Position)  WHERE lf.firm_name = 'Fox Rothschild' AND pos.Name IS NOT NULL  WITH count(CASE WHEN toLower(pos.Name) CONTAINS 'partner' THEN a END) AS Partners, count(CASE WHEN toLower(pos.Name) CONTAINS 'associate' THEN a END) AS Associates RETURN 'Fox Rothschild' AS Law_Firm, Partners, Associates, round(toFloat(Partners) / CASE WHEN Associates = 0 THEN 1 ELSE Associates END, 2) AS Partner_to_Associate_Ratio" },
            { question: 'What is the attorney distribution for Alston & Bird by regions?', answer: "MATCH (a:attorneys)-[:WORKS_AT]->(lf:LawFirm), (a)-[:LIVES_IN]->(c:Cities) WHERE lf.firm_name = 'Alston & Bird' WITH c.state AS stateCode RETURN CASE WHEN stateCode IN ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA'] THEN 'Northeast' WHEN stateCode IN ['DE', 'MD', 'DC', 'VA', 'WV', 'KY', 'TN', 'NC', 'SC', 'GA', 'FL', 'AL', 'MS'] THEN 'Southeast' WHEN stateCode IN ['OH', 'MI', 'IN', 'IL', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'] THEN 'Midwest' WHEN stateCode IN ['TX', 'OK', 'NM', 'AZ'] THEN 'Southwest' WHEN stateCode IN ['CO', 'WY', 'MT', 'ID', 'UT', 'NV', 'WA', 'OR', 'CA', 'AK', 'HI'] THEN 'West' ELSE 'Other' END AS Region, count(*) AS Attorney_Count ORDER BY Attorney_Count DESC" },
            { question: 'What is the state by state bar admission coverage for Hunton Andrews Kurth?', answer: "MATCH (a:attorneys)-[:WORKS_AT]->(lf:LawFirm), (a)-[:ADMITTED_BY]->(sb:StateBars) WHERE lf.firm_name = 'Hunton Andrews Kurth' RETURN sb.name AS State_Bar, count(DISTINCT a) AS Attorneys_Admitted ORDER BY Attorneys_Admitted DESC" },
            {question: 'What percent of attorneys at Kirkland & Ellis have Honors?', answer: "MATCH (a:attorneys)-[:WORKS_AT]->(:LawFirm {firm_name: 'Kirkland & Ellis'}) OPTIONAL MATCH (a)-[:HAS]->(h:Honors) WITH count(DISTINCT a) AS Total, count(DISTINCT CASE WHEN h IS NOT NULL THEN a END) AS With_Honors RETURN Total, With_Honors, round(toFloat(With_Honors) / Total, 4) AS Percent_With_Honors" }

        ],
    connection: {
        port: '',
        database: '',
        host: '52408c0e.databases.neo4j.io',
        password: 'OtxEq39cKoFd7cfhdW5SZJotc8gLXY0Fbiv7JuCnz9o',
        protocol: 'neo4j+s',
        username: 'neo4j'
    },
    icon: '/frank.png',
    userDefined: false,
    schemaDiagram: "",
    promptParts: {
        dataModel: '',
        fewshot: []
    },
    openAIModel: 'gpt-4o',
    googleModel: '',
    awsModel: '',
    openAIKey: process.env.OPENAI_API_KEY
    
};

// let remoteAgents = [];
let localAgents = [initialAgentData];

// export const getAgents = () => (remoteAgents || []).concat(localAgents || []);
export const getAgents = () => localAgents.slice();
// export const getAgentByKey = (key: string) => getAgents().find(agent => agent.key === key);
// export const getAgentByName = (title: string) => getAgents().find(agent => agent.title === title);
export const getAgentByKey = (key: string) => localAgents.find(agent => agent.key === key);
export const getAgentByName = (title: string) => localAgents.find(agent => agent.title === title);

export const initAgents = async () => {
    // Assuming loadLocalAgents returns a list of agents
    let newLocalAgents = loadLocalAgents();
    console.log("New Local Agents: ", newLocalAgents);

    // Assuming localAgents is already defined somewhere in your code
    console.log("Existing Local Agents: ", localAgents);

    localAgents = localAgents;

    console.log("Concatenated Local Agents: ", localAgents);
}

// export const getRemoteAgents = async () => {
//     let result = await runNeoApi(NeoDatabaseConstants.BackendDatabaseKey, FrontEndAgentQuery);
//     try {
//         let agents = await Promise.all(result?.result?.map(async (row) =>  {
//             let agentInfo = row?.agentInfo;
//             let promptProvider = PredefinedPromptProviders[agentInfo.key];
//             console.log('agentInfo.key: ', agentInfo.key);
//             if (promptProvider) {
//                 console.log('using prompt provider');
//                 agentInfo.promptParts.dataModel = await promptProvider.getDataModel();
//                 agentInfo.promptParts.fewshot = await promptProvider.getFewshot();
//             }
//             return agentInfo;
//         }));
//         return agents
//     }
//     catch(e)
//     {
//         return [];
//     }
//     // return agents;
// }

// export const getLocalAgents = () => localAgents;
export const getLocalAgents = () => localAgents.slice(); 

export const saveLocalAgent = (newAgent: any) => {
    const existingIndex = localAgents?.findIndex(data => data.title === newAgent.title)

    if (existingIndex !=null && existingIndex !== -1) {
        localAgents[existingIndex] = newAgent;
    } else {
        if (localAgents == null) {
            localAgents = [];
        }
        localAgents.push(newAgent);
    }

    addAgent(newAgent);
}

export const removeLocalAgent = (title: string) => {
    removeAgent(title);
    localAgents = localAgents.filter(data => data.title !== title);
}