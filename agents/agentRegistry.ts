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
    schema: `Node\tAttributes
    "Applicant"\t["Industries", "Link", "Undergrad", "Biography", "PracticeAreaId", "LinkedInUrl", "UpdatedAt", "ProbabilityOfMove", "LastName", "MiddleName", "Email", "JdYear", "Phone", "FirstName", "International", "FirmId", "LocationId", "Rating", "NodeId", "SoftDeleted", "NodeSource", "SchoolId", "FirmOfficeLocationId", "TypeId", "StatusId"]
    "State"\t["UpsertDate", "LastUpdate", "Code", "CreationDate", "CountryId", "OriginalName", "NodeSource", "Longitude", "Name", "NodeId", "Latitude", "SoftDeleted"]
    "City"\t["UpsertDate", "LastUpdate", "CreationDate", "RegionId", "OriginalName", "NodeSource", "Longitude", "Name", "NodeId", "Latitude", "SoftDeleted"]
    "Type"\t["UpsertDate", "LastUpdate", "CreationDate", "IsSecondaryType", "OriginalName", "SoftDeleted", "IsJobType", "DisplayInLive", "NodeSource", "IsMainType", "NodeId", "ParentTypeId", "IsAttorneyType"]
    "LawFirmOfficeLocation"\t["Email", "FacePageUrl", "ZipCode", "IsDefaultLocation", "Address1", "Phone", "PhoneAreaCode", "Fax", "ClosedDate", "IsActive", "MainOffice", "LocationId", "NodeSource", "UpsertDate", "FirmId", "LastUpdate", "International", "CreationDate", "Url", "NodeId", "Name", "SoftDeleted"]
    "School"\t["NodeSource", "UpsertDate", "Rank", "LastUpdate", "SoftDeleted", "CreationDate", "NodeId", "OriginalName"]
    "LawFirm"\t["Url", "NodeSource", "UpsertDate", "LastUpdate", "CreationDate", "Rank", "Name", "OpenDate", "SoftDeleted", "FirmStatusId", "International", "F500", "NodeId"]
    "Specialty"\t["NodeSource", "UpsertDate", "SoftDeleted", "LastUpdate", "NodeId", "OriginalName", "CreationDate"]
    "PracticeArea"\t["NodeSource", "UpsertDate", "LastUpdate", "SoftDeleted", "CreationDate", "NodeId", "Name", "OriginalName"]
    "Job"\t["JobStatus", "TotalApps", "UnratedApps", "Visible", "Zipcode", "Tags", "Title", "PracticeArea", "Status", "SupportsPurchases", "PostedAt", "State", "Language", "OpenPositionsCount", "Position", "Specialty", "Joblink", "JdYears", "JobCode", "Keywords", "HiringEntityName", "Honors", "Country", "CreatedAt", "BarAdmission", "City", "CompanyId", "UpdatedAt", "Address", "Description", "LocationId", "Abstract", "Active", "NodeId", "SoftDeleted", "NodeSource"]
    "Review"\t["NodeSource", "ApplicationId", "ReviewerName", "SoftDeleted", "UpdatedAt", "ReviewText", "Id", "UserId", "Rating", "CreatedAt", "NodeId"]
    "Language"\t["NodeSource", "UpsertDate", "LastUpdate", "SoftDeleted", "CreationDate", "NodeId", "Name", "OriginalName"]
    "Scorecard"	["UserName", "NodeSource", "ApplicationId", "UpdatedAt", "Review", "SoftDeleted", "Priority", "Rating", "Title", "NodeId", "Id", "UserId"]
    "LawFirmStatus"\t["NodeSource", "UpsertDate", "LastUpdate", "SoftDeleted", "CreationDate", "NodeId", "Name", "OriginalName"]
    "ApplicantFile"\t["NodeSource", "CompanyId", "StorageKey", "FileType", "SiteId", "SoftDeleted", "DownloadUrl", "FileName", "CreatedAt", "NodeId"]
    "Country"\t["NodeSource", "UpsertDate", "LastUpdate", "CreationDate", "SoftDeleted", "Name", "OriginalName", "Latitude", "Longitude", "NumericCode", "Tld", "Continent", "IsDiverse", "NodeId", "PhonePrefix", "Code2", "Code3"]
    "Admission"\t["UpsertDate", "CountryId", "LastUpdate", "SoftDeleted", "CreationDate", "NodeId", "OriginalName", "NodeSource"]
    "Honor"\t["UpsertDate", "LastUpdate", "SoftDeleted", "CreationDate", "NodeId", "OriginalName", "NodeSource"]
    "Status"\t["UpsertDate", "LastUpdate", "SoftDeleted", "CreationDate", "NodeId", "OriginalName", "Name", "NodeSource"]
    "Note"\t["CompanyId", "ApplicantNote", "NodeSource", "ApplicationId", "SoftDeleted", "UpdatedAt", "NoteType", "UserId", "Id", "NodeId", "Protected", "CreatedAt"]
    
    Start Node\tRelationship\tEnd Node
    Applicant\tHAS_EXPERIENCE\tSpecialty, PractiseArea
    Applicant\tAPPLIED_TO\tJob
    Applicant\tHAS_REVIEWS\tReview
    Applicant\tSPEAKS\tLanguage
    Applicant\tHAS_SCORECARDS\tScorecard
    Applicant\tLIVES_IN\tCity
    Applicant\tCONTAINS\tApplicantFIle
    State\tIS_IN\tCountry
    City, LawFirmOfficeLocation, School\tLOCATED_AT\tState
    Type\tIS_CHILD_OF\tType
    Applicant\tSTUDIED_AT\tSchool
    Applicant\tADMITTED_BY\tAdmission
    LawFirmOfficeLocation\tBELONGS_TO\tLawFirm
    Applicant\tWORKS_AT\tLawFirmOfficeLocation, LawFirm
    LawFirmOfficeLocation\tLOCATED_AT\tCity
    Applicant\tHAS\tType, Honor
    Applicant, LawFirm\tIS\tStatus, LawFirmStatus
    Applicant\tHAS_NOTES\tNote`,
    fewshot: [{ question: 'What honor has Sarah Primrose achieved?', answer: "MATCH (a:Applicant) WHERE a.LastName = 'Primrose' AND a.FirstName = 'Sarah' MATCH (a)-[:HAS]-(h:Honor) RETURN h;" },
            { question: 'What honor has Michael Sutton achieved?', answer: "MATCH (a:Applicant) WHERE a.LastName = 'Sutton' AND a.FirstName = 'Michael' MATCH (a)-[:HAS]-(h:Honor) RETURN h;" },
            { question: 'What honor has Sean Withall achieved?', answer: "MATCH (a:Applicant) WHERE a.LastName = 'Withall' AND a.FirstName = 'Sean' MATCH (a)-[:HAS]-(h:Honor) RETURN h;" },
            { question: 'What state bar has Michael Sutton been admitted?', answer: "MATCH (a:Applicant) WHERE a.LastName = 'Sutton' AND a.FirstName = 'Michael' MATCH (a)-[:ADMITTED_BY]-(bar:Admission) RETURN bar.OriginalName;" },
            { question: 'What state bar has Sarah Primrose been admitted?', answer: "MATCH (a:Applicant) WHERE a.LastName = 'Primrose' AND a.FirstName = 'Sarah' MATCH (a)-[:ADMITTED_BY]-(bar:Admission) RETURN bar.OriginalName;" },
            { question: 'What state bar has Philip Wong been admitted?', answer: "MATCH (a:Applicant) WHERE a.LastName = 'Wong' AND a.FirstName = 'Philip' MATCH (a)-[:ADMITTED_BY]-(bar:Admission) RETURN bar.OriginalName;" },
            { question: 'What state bar has Samuel Lipson been admitted?', answer: "MATCH (a:Applicant) WHERE a.LastName = 'Lipson' AND a.FirstName = 'Samuel' MATCH (a)-[:ADMITTED_BY]-(bar:Admission) RETURN bar.OriginalName;" },
            { question: 'What law school did Joshua Spielman attend?', answer: "MATCH(a2:Applicant) where a2.LastName ='Spielman' and a2.FirstName ='Joshua' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2)-[:STUDIED_AT]-(s:School) Return s LIMIT 1" },
            { question: 'What law school did Matthew Wochok attend?', answer: "MATCH(a2:Applicant) where a2.LastName ='Wochok' and a2.FirstName ='Matthew' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2)-[:STUDIED_AT]-(s:School) Return s LIMIT 1" },
            { question: 'Who studied at Harvard?', answer: "MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Harvard' return a2 LIMIT 25" },
            { question: 'What law firm does Matthew Wochok work?', answer: "MATCH(a2:Applicant) where a2.LastName ='Wochok' and a2.FirstName ='Matthew' MATCH (a2)-[:WORKS_AT]-(lf:LawFirm) Return lf LIMIT 1" },
            { question: 'Who works at Gibbons law firm?', answer: "MATCH (lf:LawFirm)-[:WORKS_AT]-(a2:Applicant) WHERE lf.Name ='Gibbons' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] return a2 LIMIT 25" },
            { question: 'Where did Matthew Wochok earn his undergraduate degree?', answer: "MATCH(a2:Applicant) where a2.LastName ='Wochok' and a2.FirstName ='Matthew' Return a2.Undergrad LIMIT 1" },
            { question: 'When did Matthew Wochok graduate from Georgetown University?', answer: "MATCH(a2:Applicant) where a2.LastName ='Wochok' and a2.FirstName ='Matthew' Return a2.JdYear LIMIT 1" },
            { question: 'What candidate graduated from Georgetown University in 2010?', answer: "MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Georgetown University' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2: Applicant) where a2.JdYear=2010 return a2, s, a2.JdYear LIMIT 25" },
            { question: 'Who at Morris Manning & Martin LLP law firm studied at Harvard University?', answer: "MATCH (lf:LawFirm)-[:WORKS_AT]-(a2:Applicant) WHERE lf.Name ='Morris Manning & Martin LLP' MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Harvard' return a2 LIMIT 25" },
            { question: 'Who at Gibbons law firm studied at Georgetown University?', answer: "MATCH (lf:LawFirm)-[:WORKS_AT]-(a2:Applicant) WHERE lf.Name ='Gibbons' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Georgetown University' return a2 LIMIT 25" },
            { question: 'What candidate earned their undergraduate degree from U OF VIRGINIA and graduated from Georgetown University in 2010?', answer: "MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Georgetown University' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2: Applicant) where a2.JdYear=2010 MATCH (a2: Applicant) where a2.Undergrad='U OF VIRGINIA' return a2, s LIMIT 25" },
            { question: 'What candidate earned their undergraduate degree from U OF GEORGIA and graduated from Duke in 2015?', answer: "MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Duke' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2: Applicant) where a2.JdYear=2015 MATCH (a2: Applicant) where a2.Undergrad='U OF GEORGIA' return a2, s LIMIT 25" },
            { question: 'What candidate earned their undergraduate degree from U OF SOUTHERN CALIFORNIA and graduated from Duke in 2015?', answer: "MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Duke' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2: Applicant) where a2.JdYear=2021 MATCH (a2: Applicant) where a2.Undergrad='U OF SOUTHERN CALIFORNIA' return a2, s LIMIT 25" },
            { question: 'What candidate earned their undergraduate degree from AUSTRALIA and graduated from Australian National University in 2019?', answer: "MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Australian National University' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2: Applicant) where a2.JdYear=2019 MATCH (a2: Applicant) where a2.Undergrad='AUSTRALIA' return a2, s LIMIT 25" },
            { question: 'What candidate earned their undergraduate degree from U OF DELAWARE at Gibbons law firm?', answer: "MATCH (lf:LawFirm)-[:WORKS_AT]-(a2:Applicant) WHERE lf.Name ='Gibbons' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2: Applicant) where a2.Undergrad='U OF DELAWARE' Return a2 LIMIT 25" },
            { question: 'What candidate earned their undergraduate degree from U OF GEORGIA at Morris Manning & Martin LLP law firm?', answer: "MATCH (lf:LawFirm)-[:WORKS_AT]-(a2:Applicant) WHERE lf.Name ='Morris Manning & Martin LLP' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2:Applicant) where a2.Undergrad='U OF GEORGIA' Return a2 LIMIT 25" },
            { question: 'Who at Morris Manning & Martin LLP law firm graduated law school at Emory in 1996?', answer: "MATCH (lf:LawFirm)-[:WORKS_AT]-(a2:Applicant) WHERE lf.Name ='Morris Manning & Martin LLP' MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Emory' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2: Applicant) where a2.JdYear=1996 return a2, s LIMIT 25" },
            { question: 'Who at Gibbons law firm graduated law school at Seton Hall in 2012?', answer: "MATCH (lf:LawFirm)-[:WORKS_AT]-(a2:Applicant) WHERE lf.Name ='Gibbons' MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Seton Hall' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2: Applicant) where a2.JdYear=2012 return a2, s LIMIT 25" },
{ question: 'Who at Morris Manning & Martin LLP law firm attended AUBURN U for undergrad and law school at Cumberland?', answer: "MATCH (lf:LawFirm)-[:WORKS_AT]-(a2:Applicant) WHERE lf.Name ='Morris Manning & Martin LLP' MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Cumberland' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2: Applicant) where a2.Undergrad='AUBURN U' return a2, s LIMIT 25" },
            { question: 'Who at Gibbons law firm attended SETON HALL U for undergrad and law school at Rutgers?', answer: "MATCH (lf:LawFirm)-[:WORKS_AT]-(a2:Applicant) WHERE lf.Name ='Gibbons' MATCH (s:School)-[:STUDIED_AT]-(a2:Applicant) WHERE s.OriginalName ='Rutgers' MATCH (a2)-[:IS]-(status:Status) where status.OriginalName IN ['Newly added to the database','Recently changed','Not Changed','Lateral move','Lateral Move*','Newly Hired Graduates','Moved due to merger' ,'SECONDMENT'] MATCH (a2: Applicant) where a2.Undergrad='SETON HALL U' return a2, s LIMIT 20" },
            { question: "What is Joshua Spielman's personal email address?", answer: "MATCH(a:Applicant) where a.LastName ='Spielman' and a.FirstName ='Joshua' MATCH (a)-[:IS]-(status:Status) WHERE status.OriginalName IN ['Newly added to the database', 'Recently changed', 'Not Changed', 'Lateral move', 'Lateral Move*', 'Newly Hired Graduates', 'Moved due to merger', 'SECONDMENT'] Return a.Email LIMIT 1" },
            { question: "What is Samuel Lipson's personal email address?", answer: "MATCH(a:Applicant) where a.LastName ='Lipson' and a.FirstName ='Samuel' MATCH (a)-[:IS]-(status:Status) WHERE status.OriginalName IN ['Newly added to the database', 'Recently changed', 'Not Changed', 'Lateral move', 'Lateral Move*', 'Newly Hired Graduates', 'Moved due to merger', 'SECONDMENT'] Return a.Email LIMIT 1" },
            { question: "What is Joshua Spielman's cell phone number?", answer: "MATCH(a:Applicant) where a.LastName ='Spielman' and a.FirstName ='Joshua' MATCH (a)-[:IS]-(status:Status) WHERE status.OriginalName IN ['Newly added to the database', 'Recently changed', 'Not Changed', 'Lateral move', 'Lateral Move*', 'Newly Hired Graduates', 'Moved due to merger', 'SECONDMENT'] Return a.Phone LIMIT 1" },
            { question: "What is Samuel Lipson's cell phone number?", answer: "MATCH(a:Applicant) where a.LastName ='Lipson' and a.FirstName ='Samuel' MATCH (a)-[:IS]-(status:Status) WHERE status.OriginalName IN ['Newly added to the database', 'Recently changed', 'Not Changed', 'Lateral move', 'Lateral Move*', 'Newly Hired Graduates', 'Moved due to merger', 'SECONDMENT'] Return a.Phone LIMIT 1" },
            { question: 'What candidates working at Gibbons law firm speak 2 or more languages?', answer: "MATCH (lf:LawFirm {Name: 'Gibbons'})<-[:WORKS_AT]-(a:Applicant) MATCH (a)-[:SPEAKS]->(l:Language) WITH a, lf, COLLECT(l) AS languages WHERE SIZE(languages) >= 2 RETURN a.FirstName, a.LastName LIMIT 10;" },
            { question: 'What candidates working at Morris Manning & Martin LLP law firm speak 2 or more languages?', answer: "MATCH (lf:LawFirm {Name: 'Morris Manning & Martin LLP'})<-[:WORKS_AT]-(a:Applicant) MATCH (a)-[:SPEAKS]->(l:Language) WITH a, lf, COLLECT(l) AS languages WHERE SIZE(languages) >= 2 RETURN a.FirstName, a.LastName LIMIT 10;" }
        ],
    connection: {
        port: '',
        database: '',
        host: '80a5f8b8.databases.neo4j.io',
        password: 'N9Jhybir-NaFEsvGXS53X7SthV5wheHDEg7ua7yY-3E',
        protocol: 'neo4j+s',
        username: 'neo4j'
    },
    icon: '/bi.png',
    userDefined: false,
    schemaDiagram: "",
    promptParts: {
        dataModel: '',
        fewshot: []
    },
    openAIModel: 'gpt-4',
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
    // remoteAgents = await getRemoteAgents();
    localAgents = loadLocalAgents().concat(localAgents);;
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