import * as React from 'react';
import { useState, useRef, useEffect } from "react";

import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Image from "next/image";

import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';

import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';

import ArticleIcon from '@mui/icons-material/Article';
import CodeSharpIcon from '@mui/icons-material/CodeSharp';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import StorageIcon from '@mui/icons-material/Storage';

import { MuiMarkdown, getOverrides } from 'mui-markdown';

import List from '@mui/material/List';

import ReactEcharts from "echarts-for-react";
import LoadingDots from "../common/LoadingDots";
import CypherEditor from "./cypherEditor"
import SchemaModal from '../common/SchemaModal';
import QuestionsModal from '../common/QuestionsModal';
import { Select, FormControl, InputLabel } from '@mui/material';
import { logToFile } from '../../utils/logger';

const ExtraPadding = 10;

const Chat = (props) => {

    let {
        dbSchemaImageUrl,
        loading,
        messages,
        respondWithChart,
        googleSearch,
        crystalKnows,
        searchContacts,
        runCypher,
        sampleQuestions,
        scrollToBios,
        setContext,
        setLoading,
        setMessages,
        setRespondWithChart,
        setGoogleSearch,
        setCrystalKnows,
        setSearchContacts,
        setUserInput,
        setBioRef,
        styleProps,
        StreamResponse,
        userInput,
        isUserDefined,
        llmKey
    } = props;

    styleProps = styleProps || {};

    const bioRef = useRef<null | HTMLDivElement>(null);
    const howCanIHelpRef = useRef<null | HTMLDivElement>(null);

    const [openCypherBlock, setOpenCypherBlock] = useState(null);
    const [questionsModalVisible, setQuestionsModalVisible] = useState(false);
    const [schemaModalVisible, setSchemaModalVisible] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [feedbackMap, setFeedbackMap] = useState<{ [key: number]: 'good' | 'bad' | null }>({});
    const user = {
        name: 'abizer',
        email: 'abizer@example.com' // Adjust the email as needed
    };

    useEffect(() => {
        if (!initialized) {
            setBioRef(bioRef);
            setInitialized(true);
        }
    }, [initialized])

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const howCanIHelpYouHeight = () => {
        if (howCanIHelpRef.current) {
            return howCanIHelpRef.current.clientHeight;
        } else {
            return 50;
        }
    }

    const getChatHeight = () => styleProps.HeaderHeight + howCanIHelpYouHeight() + ExtraPadding

    const handleCypherBlockClick = (event: React.MouseEvent<HTMLButtonElement>, i: any) => {
        // setAnchorEl(event.currentTarget);

        if (openCypherBlock === i) {
            setOpenCypherBlock(-1);
        }
        else {
            setOpenCypherBlock(i);
        }

    };

    const handleCypherBlockClose = () => {
        setAnchorEl(null);
        setOpenCypherBlock(null);
    };

    const handleFeedback = async (messageIndex: number, feedbackType: 'good' | 'bad') => {
        const aiMessage = messages[messageIndex];
        if (aiMessage.author.name === 'ai' && messageIndex > 0) {
            // Get the previous user message (should be right before the AI message)
            const userMessage = messages[messageIndex - 1];
            
            if (userMessage && userMessage.author.name === 'User') {
                await logToFile({
                    userInput: userMessage.text,
                    cypher: aiMessage.cypher,
                    feedback: feedbackType
                });
                console.log(`Logged ${feedbackType} feedback for message ${messageIndex}`);
                            // Update feedback map to highlight the icon
                            setFeedbackMap(prev => ({
                                ...prev,
                                [messageIndex]: feedbackType
                            }));
            }
        }
    };

    return (
        <>
            <Box sx={{
                width: '100%',
<<<<<<< HEAD
                height: '100%',
                borderRadius: '12px',
                bgcolor: '#464646ff',
                border: '1px solid rgba(255,255,255,0.12)',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: '8px',
                paddingBottom: '20px'
=======
                height: `calc(100vh - ${getChatHeight()}px)`,
                // borderLeft: 1,
                // borderColor: 'grey.300',
                bgcolor: 'background.paper',
                
                // borderTop: '2px dotted lightgray',
                // borderBottom: '2px dotted lightgray',
                overflowY: 'auto',
                // marginTop: '19px',
>>>>>>> 79fd41d90b89aeea198dc5c23065a37325320ba4
            }}>
                <Box sx={{
                    width: '100%',
                    padding: '6px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700, fontSize: 18 }}>Chat</Typography>
                </Box>

                <List sx={{
                    width: '100%',
                    flex: 1,
                    bgcolor: 'transparent',
                    overflowY: 'auto',
                    padding: 0,
                    margin: 0,
                }}>
                {messages.map((m, i) => (
                    // <ChatMessage key={`message-${i}`} message={m} />
                    <div className="chat-message" key={i}>
                        <ListItem divider sx={{ width: "100%" }}>
                            <ListItemAvatar>
                                <Image width={40} height={40} alt="Neo4j" src={m.avatar} />
                            </ListItemAvatar>

                            {i === 0 && (
                                <span>
                                    <ListItemText style={{ whiteSpace: "pre-wrap" }}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline', color: "rgba(255, 255, 255, 0.95)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                                    component="span"
                                                    variant="caption"
                                                    color="text.primary"
                                                >
                                                    Frank - He retrieves the information you need!
                                                </Typography>
                                                {" "}
                                            </React.Fragment>
                                        }
                                    /></span>
                            )
                            }
                            {i != 0 && !m.isChart && (
                                <ListItemText disableTypography
                                    style={{ whiteSpace: "pre-wrap", color: "rgba(255, 255, 255, 0.95)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                    secondary={
                                        <React.Fragment>
                                            <MuiMarkdown
                                                codeWrapperStyles={{
                                                    borderRadius: '0.5rem',
                                                    padding: '0.5rem 0.75rem',
                                                    overflow: 'scroll'
                                                }}
                                                overrides={{
                                                    ...getOverrides(), // This will keep the other default overrides.

                                                    h5: {
                                                        component: 'p',
                                                        props: {
                                                            style: { color: "rgba(255, 255, 255, 0.95)", paddingLeft: "20px", marginLeft: -5, overflow: 'auto', fontWeight: 600, fontSize: 15, fontFamily: "sans-serif" },
                                                        } as React.HTMLProps<HTMLParagraphElement>,
                                                    },
                                                    p: {
                                                        component: 'p',
                                                        props: {
                                                            style: { color: "rgba(255, 255, 255, 0.95)", paddingLeft: "20px", marginLeft: -5, overflow: 'auto', fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" },
                                                        } as React.HTMLProps<HTMLParagraphElement>,
                                                    },
                                                    li: {
                                                        component: 'li',
                                                        props: {
                                                            style: { color: "rgba(110, 110, 110, 0.95)", paddingLeft: "20px", marginLeft: -5, overflow: 'auto', fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" },
                                                        } as React.HTMLProps<HTMLParagraphElement>,
                                                    }
                                                }}
                                            >{m.text}
                                            </MuiMarkdown>

                                            {openCypherBlock === i && m.author.name === "ai" && (
                                                <div>
                                                    <CypherEditor
                                                        cypherQuery={m.cypher}
                                                        messages={messages}
                                                        messageIndex={i}
                                                        runCypher={runCypher}
                                                        scrollToBios={scrollToBios}
                                                        setContext={setContext}
                                                        setLoading={setLoading}
                                                        setMessages={setMessages}
                                                        isUserDefined = {isUserDefined}
                                                        llmKey = {llmKey}
                                                    />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    }
                                />
                            )
                            }
                            {i != 0 && m.isChart && m.chartData.toString() != '' && (
                                <ReactEcharts option={m.chartData} style={{ height: '300px', width: '96%' }} />
                            )
                            }
                            {i != 0 && m.isChart && m.chartData.toString() === '' && (
                                    <ListItemText disableTypography
                                        style={{ whiteSpace: "pre-wrap", color: "rgba(110, 110, 110, 0.95)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                    // primary={m.text} 
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline', color: "rgba(110, 110, 110, 0.95)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                                                component="span"
                                                variant="caption"
                                                color="text.primary"
                                            >
                                                {m.text}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            )
                            }
                            {!loading && i === messages.length - 1 && (
                                <span ref={bioRef}></span>)
                            }
                            {loading && i === messages.length - 1 && (
                                <span>
                                    <LoadingDots color="white" style="large" marginLeft="-500px" />
                                </span>
                            )
                            }
                            {m.author.name === "ai" && i !== 0 && (
                                <Stack>
                                    {feedbackMap[i] === 'good' ? (
                                        <ThumbUpIcon style={{ cursor: 'pointer', color: '#1976d2' }} onClick={() => handleFeedback(i, 'good')} />
                                    ) : (
                                        <ThumbUpOffAltIcon style={{ cursor: 'pointer' }} onClick={() => handleFeedback(i, 'good')} />
                                    )}
                                    {feedbackMap[i] === 'bad' ? (
                                        <ThumbDownIcon style={{ cursor: 'pointer', color: '#d32f2f' }} onClick={() => handleFeedback(i, 'bad')} />
                                    ) : (
                                        <ThumbDownOutlinedIcon style={{ cursor: 'pointer' }} onClick={() => handleFeedback(i, 'bad')} />
                                    )}
                                    <CodeSharpIcon id={'csi' + i + m.date.toUTCString()} key={'csi' + m.date.toUTCString()} style={{ cursor: 'pointer' }} onClick={(e) => handleCypherBlockClick(e, i)} />
                                </Stack>
                            )
                            }
                        </ListItem>
                        {/* <ListItem>
                        <ReactEcharts  option={option} style={{height: '300px', width: '100%'}} />
                    </ListItem> */}
                    </div>
                ))}
<<<<<<< HEAD
                </List>
                <Box sx={{ paddingTop: '12px' }}>
                    <TextField 
                        ref={howCanIHelpRef} 
                        id="standard-basic" 
                        label="How can I help you today?" 
                        variant="outlined"
                        sx={{ 
                            fontWeight: 400, 
                            fontSize: 15,
                            // reduce width and give side margins so horizontal spacing = bottom spacing
                            width: 'calc(100% - 24px)',
                            margin: '0 12px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '50px'
                            },
                            // Match label and outline to left Menu item color (white-ish)
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255,255,255,0.95)'
                            },
                            '& .MuiOutlinedInput-root fieldset': {
                                borderColor: 'rgba(255,255,255,0.95)'
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(255,255,255,0.95)'
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'rgba(255,255,255,0.95)'
                            },
                            '& .MuiInputBase-input': {
                                color: 'rgba(255,255,255,0.95)'
                            }
                        }}
                        multiline
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                StreamResponse(e)
                            }
                        }}
                        onChange={(e) => {
                            if (e.target && 'value' in e.target) {
                                setUserInput((e.target as HTMLInputElement).value)
                            }
                        }}
                        value={userInput}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <FormControl variant="standard" sx={{ minWidth: 120, '& .MuiInputBase-root': { color: 'rgba(255,255,255,0.95)' }, '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.95)' }, '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.95)' }, '& .MuiInput-underline:after': { borderBottomColor: 'rgba(255,255,255,0.95)' } }}>
                                        {/* <InputLabel id="options-label">Options</InputLabel> */}
                                        <Select
                                            labelId="options-label"
                                            id="options-select"
                                            value={
                                                respondWithChart
                                                    ? 'chart'
                                                    : googleSearch
                                                    ? 'google'
                                                    : searchContacts
                                                    ? 'contacts'
                                                    : crystalKnows
                                                    ? 'crystal'
                                                    : 'database'
                                            }
                                            sx={{ color: 'rgba(255,255,255,0.95)', '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.95)' } }}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setRespondWithChart(value === 'chart');
                                                setGoogleSearch(value === 'google');
                                                setCrystalKnows(value === 'crystal');
                                                setSearchContacts(value === 'contacts');
                                                
                                                // If "database" is selected, set all to false
                                                if (value === 'database') {
                                                    setRespondWithChart(false);
                                                    setGoogleSearch(false);
                                                    setCrystalKnows(false);
                                                    setSearchContacts(false);
                                                }
                                            }}
                                        >
                                                <MenuItem sx={{ color: 'rgba(255,255,255,0.95)' }} value="chart">Respond with Chart</MenuItem>
                                                <MenuItem sx={{ color: 'rgba(255,255,255,0.95)' }} value="google">Google Search</MenuItem>
                                                <MenuItem sx={{ color: 'rgba(255,255,255,0.95)' }} value="crystal">Crystal Knows</MenuItem>
                                                <MenuItem sx={{ color: 'rgba(255,255,255,0.95)' }} value="database">Database Search</MenuItem>
                                                <MenuItem sx={{ color: 'rgba(255,255,255,0.95)' }} value="contacts">Contact Search</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Tooltip title="Send Message">
                                        <SendIcon
                                            sx={{ cursor: 'pointer', paddingLeft: '10px', paddingRight: '10px', color: 'white' }}
                                            onClick={(e) => {
                                                StreamResponse(e);
                                            }}
                                        />
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Box>
=======
            </List>
            <TextField
                ref={howCanIHelpRef}
                fullWidth
                id="chat-input"
                label="How can I help you today?"
                variant="outlined"
                sx={{
                    fontWeight: 400,
                    fontSize: 15,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '16px'
                    }
                }}
                multiline
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        StreamResponse(e);
                    }
                }}
                onChange={(e) => {
                    setUserInput(e.target.value);
                }}
                value={userInput}
    InputProps={{
        endAdornment: (
            <InputAdornment position="end">
    <FormControl variant="standard" sx={{ minWidth: 120 }}>
        {/* <InputLabel id="options-label">Options</InputLabel> */}
        <Select
            labelId="options-label"
            id="options-select"
            value={
                googleSearch
                    ? 'google'
                    : crystalKnows
                    ? 'crystal'
                    : 'database'
            }
            onChange={(e) => {
                const value = e.target.value;
                // chart and contacts options removed; ensure those flags are false
                setRespondWithChart(false);
                setSearchContacts(false);
                setGoogleSearch(value === 'google');
                setCrystalKnows(value === 'crystal');
            }}
        >
            {/* <MenuItem value="chart">Respond with Chart</MenuItem> */}
            <MenuItem value="database">Talent Acquisition</MenuItem>
            <MenuItem value="crystal">Talent Insights</MenuItem>
            <MenuItem value="google">Knowledge Center</MenuItem>
            {/* <MenuItem value="contacts">Contact Search</MenuItem> */}
        </Select>
    </FormControl>
    <Tooltip title="Send Message">
        <SendIcon
            sx={{ cursor: 'pointer', paddingLeft: '10px', paddingRight: '10px' }}
            onClick={(e) => {
                StreamResponse(e);
            }}
        />
    </Tooltip>
</InputAdornment>

        ),
    }}
/>
>>>>>>> 79fd41d90b89aeea198dc5c23065a37325320ba4

            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    handleClose();
                    setTimeout(() => {
                        setSchemaModalVisible(true);
                    }, 50)
                }}>
                    Graph Model
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    setTimeout(() => {
                        setQuestionsModalVisible(true);
                    }, 50)
                }}>
                    Sample Questions
                </MenuItem>
            </Menu>
            <SchemaModal
                visible={schemaModalVisible}
                setSchemaModalVisible={setSchemaModalVisible}
                schemaImageUrl={dbSchemaImageUrl}
            />

            <QuestionsModal
                visible={questionsModalVisible}
                questions={sampleQuestions}
                setQuestion={setUserInput}
                setQuestionsModalVisible={setQuestionsModalVisible}
            />
        </>
    )
}

export default Chat;
 