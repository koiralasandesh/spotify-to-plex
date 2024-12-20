import Logo from "@/components/Logo";
import Logs from "@/components/Logs";
import ManagePlaylists from "@/components/ManagePlaylists";
import ManageUsers from "@/components/ManageUsers";
import MainLayout from "@/layouts/MainLayout";
import { ChevronLeft } from "@mui/icons-material";
import { Alert, Button, Container, Sheet, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { NextPage } from "next";
import Head from "next/head";

const Page: NextPage = () => {
    /***
     * 
     * TODO:
     * 
     * - Add categories (for dashboard)
     * - Automatic synchronization of recent played songs / playlists
     * 
     */

    return (<>
        <Head>
            <title>Spotify to Plex</title>
        </Head>
        <MainLayout maxWidth="700px">
            <Container>
                <Logo />
                <Sheet variant="soft" color="primary" sx={{ p: 2 }}>
                    <Button component="a" href="/" variant="outlined" color="neutral" size="sm" startDecorator={<ChevronLeft />}>Back</Button>
                    <Typography level="h1" mt={2} mb={.5}>Manage connections</Typography>
                    <Typography mb={1} level="body-md" maxWidth={500}>Here you can manage all connections with Spotify. You can also enable automatic synchronisation of playlists or of recent played songs, albums or playlist.</Typography>

                    <Tabs sx={{ mt: 2 }}>
                        <TabList>
                            <Tab variant="solid" color="primary">Playlists & Albums</Tab>
                            <Tab variant="solid" color="primary">Users</Tab>
                            <Tab variant="solid" color="primary" sx={{ marginLeft: "auto" }}>Logs</Tab>
                        </TabList>
                        <TabPanel value={0}>
                            <ManagePlaylists />
                        </TabPanel>
                        <TabPanel value={1}>
                            <ManageUsers />
                        </TabPanel>
                        <TabPanel value={2}>
                            <Logs />
                        </TabPanel>
                    </Tabs>

                    {/* <Alert variant="outlined" sx={{ mt: 1, mb: 2, fontWeight: 'normal' }}>Checkout the Github readme to find out more about automatic synchronisation.</Alert> */}
                    <Alert color="warning" variant="outlined" sx={{ mt: 1, mb: 2, fontWeight: 200 }}>Any settings for automatic synchroisation is not yet used.</Alert>
                </Sheet>
            </Container>
        </MainLayout >

    </>
    )
}

export default Page;
