import * as React from 'react';
// import { UserProvider } from '@auth0/nextjs-auth0/client';
// import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0/client';

import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import ApplicationContent from './applicationContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Divider, Typography } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link';
// import { securePage, getUser, AuthMethod, getAuthMethod } from './api/authHelper';

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const LogoutLink = () => {
  // Replace this with your actual authentication method check logic
  const authMethod = 'Auth0'; // Example: Replace with your actual authentication method


}

const Home: NextPage = () => {

  // const { user, error, isLoading } = getUser();

  // console.log("userInfo ", user);
  const Capabilities = {
    TalkToMyData: "TalkToMyData",
    CypherGenie: "CypherGenie"
  }
  const [capability, setCapability] = useState(Capabilities.TalkToMyData);
  const [showOptions, setShowOptions] = useState(false);
  const handleCapabilityChange = async (event: any) => {
    setCapability(event.target.value);
    console.log('selected capability', event.target.value);
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: '#606060',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Head>
        <title>Talent Engines Bot</title>
        {/*<link rel="icon" href="/logo-section-5.svg" /> */}
        {/* adding ?v=2 because Chrome won't update it*/}
        {/*https://stackoverflow.com/questions/2208933/how-do-i-force-a-favicon-refresh*/}
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
      </Head>
      {/* <Header /> */}
      <main style={{ overflowY: "scroll", height: "100vh", background: '#ffffff', color: '#000000' }}>
        <Grid container spacing={12}
<<<<<<< HEAD
          sx={{ paddingTop: '8px', background: '#606060' }}
=======
          sx={{ paddingTop: '8px', background: 'transparent' }}
>>>>>>> 79fd41d90b89aeea198dc5c23065a37325320ba4
        >
          <Grid item xs={2}
            style={{ verticalAlign: "center", }}
            sx={{
              width: '100%',
<<<<<<< HEAD
              height: '100%',
              // removed decorative background image
              backgroundImage: 'none',
              backgroundSize: 'auto',
              backgroundPosition: 'initial',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: 12, gap: '18px' }}>
              <img
                src="/talent_engines_logo.jpg"
                alt="Talent Engines"
                style={{ height: '100px', width: 'auto' }}
              />
              <img
                src="/frank_transparent.png"
                alt="Frank"
                style={{ height: '60px', width: 'auto' }}
=======
              height: '100%,',
              // backgroundImage: 'url(/shape3_top.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center', // Center the background image
              backgroundRepeat: 'no-repeat', // Prevent the image from repeating
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 12, paddingTop: 8 }}>
              <img
                src="/talent_engines_logo.jpg"
                alt="Talent Engines"
                height={80}
                style={{ width: 'auto', display: 'block' }}
              />
              <img
                src="/frank.png"
                alt="Frank"
                height={48}
                style={{ width: 'auto', display: 'block' }}
>>>>>>> 79fd41d90b89aeea198dc5c23065a37325320ba4
              />
            </div>
          </Grid>
          <Grid item xs={9}
          >
<<<<<<< HEAD
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            </div>
=======
            <Stack direction="row" justifyContent={"center"} spacing={0} style={{ paddingLeft: 10 }}
            >
              
              <Typography style={{ letterSpacing: "0.1em", color: "rgba(42, 96, 140, 1)", whiteSpace: "pre-wrap", textAlign: 'left', fontSize: "40px", fontWeight: 600 }}
              >
              </Typography>
              {/* Switching to FontAwesome so I can make a favicon */}
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                marginLeft: '10px',
                fontStyle: 'italic',
                height: '2.5em'
              }}>
                <Typography variant="caption" display="block" gutterBottom
                  style={{ textAlign: 'left', color: "rgba(42, 96, 140, 1)" }}
                >
                </Typography>
              </div>
            </Stack>
>>>>>>> 79fd41d90b89aeea198dc5c23065a37325320ba4
          </Grid>
        
          <Grid item xs={1}
            style={{ verticalAlign: "center", }}
            sx={{
              width: '100%',
              height: '100%,',

              backgroundSize: 'contain',
              backgroundPosition: 'top', // Center the background image
              backgroundRepeat: 'repeat', // Prevent the image from repeating
            }}
          >
            <Item>
              <Stack direction="row" spacing={0} alignItems="center" style={{ paddingLeft: 10, justifyContent: "flex-end" }}
              >
                {showOptions && <FormControl size="small"
                  style={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif", paddingLeft: 10 }}
                >
                  <Select
                    id="demo-simple-select-helper"
                    value={capability}
                    style={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}
                    onChange={handleCapabilityChange}
                  >
                    <MenuItem value={Capabilities.TalkToMyData} style={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}>Azure OpenAI</MenuItem>
                    <MenuItem value={Capabilities.CypherGenie} style={{ color: "rgba(0, 0, 0, 0.6)", fontWeight: 400, fontSize: 15, fontFamily: "sans-serif" }}>Google Vertex AI</MenuItem>
                  </Select>
                </FormControl>
                }
<<<<<<< HEAD
                <LogoutLink />
=======
>>>>>>> 79fd41d90b89aeea198dc5c23065a37325320ba4
              </Stack>
            </Item>
          </Grid>
        </Grid>
        {/* <Divider light /> */}
        {/* className="overflow-auto hover:overflow-scroll justify-end" */}
        <ApplicationContent></ApplicationContent>
        {/*}
      {capability === Capabilities.TalkToMyData && (
         <OpenAI></OpenAI>
      )}
      {capability === Capabilities.CypherGenie && (
          <VertexAI></VertexAI>
          // <div style={{ backgroundImage: comingsoon }}>Overlay text</div>
          // <img src="./comingsoon.jpeg" alt="React Image" style={{ objectFit:'cover', height:"100%", width:"100%"}} />
      )}
      */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
//export default withPageAuthRequired(Home);


