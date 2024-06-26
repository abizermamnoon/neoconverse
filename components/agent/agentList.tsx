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
        fewshot: [],
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

    const [agentData, setAgentData] = useState(initialAgentData);
    const [agents, setAgents] = useState([initialAgentData]);

    const {
        // agents = [initialAgentData],
        // setAgents,
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