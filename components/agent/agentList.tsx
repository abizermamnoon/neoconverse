import * as React from 'react';
import { useState, useEffect } from "react";

import Image from "next/image";
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Polyline, AddCircleRounded } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { pink, red } from '@mui/material/colors';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AgentDialog from './agentDialog';
import { Props } from 'next/script';
import { Stack } from '@mui/system';
import { getAgents, saveLocalAgent, removeLocalAgent } from '../../agents/agentRegistry';

const AgentList = (props) => {
    const [showModel, setShowModel] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

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

    const [agentData, setAgentData] = useState();
    // const [agents, setAgents] = useState([initialAgentData]);

    const {
        agents,
        setAgents,
        agentsAreLoading,
        handleListItemClick,
        selectedAgentKey
    } = props;

    let { styleProps } = props;
    styleProps = styleProps || {};

    const handleShowModelClose = () => {
        setAnchorElShowModel(null);
        setShowModel(false);
    };

    const exportFromLocalStorage = () => {
        const data = localStorage.getItem('myData');
        if (data) {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'exportedData.json';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            alert('Data exported from localStorage to file');
        } else {
            alert('No data in localStorage to export');
        }
    };
    
    const handleOpenDialog = () => {
        setAgentData({
            title: '',
            key: '',
            description: '',
            schema: '',
            fewshot: [],
            connection: { port: '', database: '', host: '', password: '', protocol: '', username: '' },
            icon: '',
            userDefined: true,
            schemaDiagram: "",
            promptParts: {
                dataModel: '',
                fewshot: []
            },
            openAIModel: '',
            googleModel: '',
            awsModel: '',
            openAIKey: ''
        });

        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSaveAgentData = (dialogData) => {
        saveLocalAgent(dialogData);
        setAgents(getAgents());
        handleCloseDialog();
    };

    const editAgent = (title) => {
        let agentObj = agents.filter(data => data.title === title);
        setAgentData(agentObj[0]);
        setDialogOpen(true);
    };

    const handleDeleteClick = (key) => {
        removeLocalAgent(key);
        setAgents(getAgents());
    };

    const handleEditClick = (key) => {
        editAgent(key);
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        console.log('Agents:', agentData);
    }, [agentData]);

    useEffect(() => {
        console.log('agent:', agents);
    }, [agents]);

    return (
        <>
            <Stack direction="row"   
                justifyContent="space-between" 
                sx={{
                    paddingTop: "6px",
                    backgroundImage: 'url(/shape3_bottom_copy.png)',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'repeat',
                }} 
            >
                <Typography
                    sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", paddingLeft: "20px", fontWeight: 600, fontSize: 18, fontFamily: "sans-serif" }}
                    component="span"
                    variant="caption"
                    color="text.primary"
                >
                    Talent Engines Agents
                </Typography>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button sx={{color:"#606060"}} variant="text" startIcon={<AddCircleRounded color="#606060" />} onClick={handleOpenDialog}>
                        Add Agent
                    </Button>
                </div>
            </Stack>
            <AgentDialog open={isDialogOpen} agentData={agentData} onSave={handleSaveAgentData} onClose={handleCloseDialog}></AgentDialog>
            <Accordion sx={{ marginTop: '4px', '&.Mui-expanded': { marginTop: '4px' }}} >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                        sx={{
                        display: 'inline',
                        color: "rgba(0, 0, 0, 0.6)",
                        fontWeight: 600,
                        fontSize: 18,
                        fontFamily: "sans-serif",
                        paddingLeft: '10px'
                    }}
                    >Explore Predefined Agents</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List sx={{
                        width: '100%',
                        // height: `calc(100vh - ${styleProps.HeaderHeight}px)`,
                        overflow: "auto",
                        border: 0,
                        borderTop: '2px dotted lightgray',
                        // marginTop: '3px',
                        borderColor: 'grey.300',
                        bgcolor: 'background.paper',
                        "&& .Mui-selected": {
                            backgroundColor: "#bdbdbd", paddingLeft: "20px"
                        }
                    }}
                    >
                        {(agents && agents.length === 0) ?
                            <Typography
                                sx={{
                                    display: 'inline',
                                    color: "rgba(0, 0, 0, 0.6)",
                                    fontWeight: 400,
                                    fontSize: 15,
                                    fontFamily: "sans-serif",
                                    paddingLeft: '10px'
                                }}
                            >{agentsAreLoading ? 'Loading...' : 'No agents configured'}
                            </Typography>
                            :
                            agents.filter(agentInfo => !agentInfo.userDefined)?.map(agentInfo => {
                                return (
                                    <ListItem button
                                        key={agentInfo?.key}
                                        onClick={(event) => handleListItemClick(event, agentInfo?.key)} selected={selectedAgentKey === agentInfo?.key}
                                        secondaryAction={
                                                <Stack direction="row" spacing={2} sx={{paddingLeft:80}} >
                                                            {
                                                            (agentInfo?.userDefined === true) ?
                                                                <div>
                                                                    <Tooltip title="Edit Agent">
                                                                        <EditIcon sx={{color: "#606060"}}
                                                                            onClick={async (e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                await handleEditClick(agentInfo?.key);
                                                                                }}
                                                                            >
                                                                            <Polyline />
                                                                        </EditIcon>
                                                                    </Tooltip>
                                                                    <Tooltip title="Delete Agent">
                                                                        <DeleteIcon sx={{ color: '#979797' }}
                                                                            onClick={async (e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                await handleDeleteClick(agentInfo?.key);
                                                                                }}
                                                                            >
                                                                            <Polyline />
                                                                        </DeleteIcon>
                                                                    </Tooltip>
                                                                    {
                                                                        (agentInfo?.schema === "") ?
                                                                            <Tooltip  
                                                                            title={
                                                                                <div style={{ whiteSpace: 'pre-line' }}>{`One of the following critical information is missing for this agent \n
                                                                                    1. Schema \n
                                                                                    2. Database connection information \n
                                                                                    3. Gen AI API configuration\n\
                                                                                    
                                                                                    Please provide these information for the agent to work as expected`}</div>
                                                                            }
                                                                            >
                                                                                
                                                                            </Tooltip>:<div/>
                                                                        }
                                                                </div>
                                                                :<div/>
                                                            }
                                                </Stack>
                                            }
                                        >
                                        <ListItemIcon>
                                            <Image width={40} height={40} alt={`${agentInfo?.title} icon`} src={agentInfo?.icon} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <>
                                                    <span style={{paddingRight: '8px' }}>{agentInfo?.title}</span>
                                                    {/* <div> */}
                                                    {agentInfo?.userDefined === true
                                                            ? <Chip label="Local" color="success" variant="outlined" size="small" />
                                                            : <Chip label="Remote" color="primary" variant="outlined" size="small" />
                                                        }
                                                    {/* </div> */}
                                                </>}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                                        component="span"
                                                        variant="caption"
                                                        color="text.primary"
                                                    >
                                                        {agentInfo?.description}
                                                    </Typography>
                                                    {" "}
                                                </React.Fragment>
                                            }
                                        >
                                        </ListItemText>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={true}  sx={{ marginTop: '4px', '&.Mui-expanded': { marginTop: '4px' }}} >
                <AccordionSummary  expandIcon={<ExpandMoreIcon />}>
                    <Typography
                     sx={{
                        display: 'inline',
                        color: "rgba(0, 0, 0, 0.6)",
                        fontWeight: 600,
                        fontSize: 18,
                        fontFamily: "sans-serif",
                        paddingLeft: '10px'
                    }}
                    >Agents Created By You</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List sx={{
                        width: '100%',
                        // height: `calc(100vh - ${styleProps.HeaderHeight}px)`,
                        overflow: "auto",
                        border: 0,
                        borderTop: '2px dotted lightgray',
                        marginTop: '3px',
                        borderColor: 'grey.300',
                        bgcolor: 'background.paper',
                        "&& .Mui-selected": {
                            backgroundColor: "#bdbdbd", paddingLeft: "20px"
                        }
                    }}
                    >
                        {(agents.filter(agentInfo => agentInfo.userDefined) && agents.filter(agentInfo => agentInfo.userDefined).length === 0) ?
                            <Typography
                                sx={{
                                    display: 'inline',
                                    color: "rgba(0, 0, 0, 0.6)",
                                    fontWeight: 400,
                                    fontSize: 15,
                                    fontFamily: "sans-serif",
                                    paddingLeft: '10px'
                                }}
                            >{agentsAreLoading ? 'Loading...' : "You haven't configured any agents"}
                            </Typography>
                            :
                            agents.filter(agentInfo => agentInfo.userDefined)?.map(agentInfo => {
                                return (
                                    <ListItem button
                                        key={agentInfo?.key}
                                        onClick={(event) => handleListItemClick(event, agentInfo?.key)} selected={selectedAgentKey === agentInfo?.key}
                                        secondaryAction={
                                                <Stack direction="row" spacing={2} sx={{paddingLeft:80}} >
                                                            {
                                                            (agentInfo?.userDefined === true) ?
                                                                <div>
                                                                    <Tooltip title="Edit Agent">
                                                                        <EditIcon sx={{color: "#606060"}}
                                                                            onClick={async (e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                await handleEditClick(agentInfo?.key);
                                                                                }}
                                                                            >
                                                                            <Polyline />
                                                                        </EditIcon>
                                                                    </Tooltip>
                                                                    <Tooltip title="Delete Agent">
                                                                        <DeleteIcon sx={{ color: '#979797' }}
                                                                            onClick={async (e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                await handleDeleteClick(agentInfo?.key);
                                                                                }}
                                                                            >
                                                                            <Polyline />
                                                                        </DeleteIcon>
                                                                    </Tooltip>
                                                                    {
                                                                        (agentInfo?.schema === "") ?
                                                                            <Tooltip  
                                                                            title={
                                                                                <div style={{ whiteSpace: 'pre-line' }}>{`One of the following critical information is missing for this agent \n
                                                                                    1. Schema \n
                                                                                    2. Database connection information \n
                                                                                    3. Gen AI API configuration\n\
                                                                                    
                                                                                    Please provide these information for the agent to work as expected`}</div>
                                                                            }
                                                                            >
                                                                               
                                                                            </Tooltip>:<div/>
                                                                        }
                                                                </div>
                                                                :<div/>
                                                            }
                                                </Stack>
                                            }
                                        >
                                        <ListItemIcon>
                                            <Image width={40} height={40} alt={`${agentInfo?.title} icon`} src={agentInfo?.icon} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <>
                                                    <span style={{paddingRight: '8px' }}>{agentInfo?.title}</span>
                                                    {/* <div> */}
                                                    {agentInfo?.userDefined === true
                                                            ? <Chip label="Local" color="success" variant="outlined" size="small" />
                                                            : <Chip label="Remote" color="primary" variant="outlined" size="small" />
                                                        }
                                                    {/* </div> */}
                                                </>}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline', color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                                        component="span"
                                                        variant="caption"
                                                        color="text.primary"
                                                    >
                                                        {agentInfo?.description}
                                                    </Typography>
                                                    {" "}
                                                </React.Fragment>
                                            }
                                        >
                                        </ListItemText>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default AgentList;