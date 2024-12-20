import Logo from "@/components/Logo";
import PlexPlaylist from "@/components/PlexPlaylist";
import { errorBoundary } from "@/helpers/errors/errorBoundary";
import MainLayout from "@/layouts/MainLayout";
import { GetSpotifyAlbum, GetSpotifyPlaylist, SavedItem } from "@/types/SpotifyAPI";
import { ChevronLeft } from "@mui/icons-material";
import { Box, Button, CircularProgress, Container, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const Page: NextPage = () => {
    const [loading, setLoading] = useState(true);
    const [playlist, setPlaylist] = useState<GetSpotifyAlbum | GetSpotifyPlaylist>()
    const [fast, setFast] = useState(false)
    const [showOptimizer, setShowOptimizer] = useState(false)
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return;

        errorBoundary(async () => {

            setLoading(true)
            if (typeof router.query.id != 'string')
                throw new Error(`ID expected.`)

            const result = await axios.get<GetSpotifyAlbum | GetSpotifyPlaylist>(`/api/spotify/items/${router.query.id}`)
            if (result.data.tracks.length > 100)
                setShowOptimizer(true)

            const savedItems = await axios.get<[SavedItem]>(`/api/saved-items?id=${router.query.id}`)
            // eslint-disable-next-line @typescript-eslint/prefer-destructuring
            const savedItem = savedItems.data[0]
            if (!savedItem)
                throw new Error(`Could not find saved item`)

            setPlaylist({
                ...result.data,
                user_title: savedItem.title
            })
            setLoading(false)
        })

    }, [router.isReady, router.query.id])

    const onUseNormalClick = useCallback(() => {
        setFast(false)
        setShowOptimizer(false)
    }, [])
    const onUseFastClick = useCallback(() => {
        setFast(true)
        setShowOptimizer(false)
    }, [])


    return (<>
        <Head>
            <title>Spotify to Plex</title>
        </Head>
        <MainLayout maxWidth="700px">
            <Container>
                <Logo />


                {!!loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, maxWidth: 300, border: '2px solid rgba(255,255,255,0.5)', borderRadius: '4px', p: 2, textAlign: 'center' }}>
                        <CircularProgress size="sm" />
                        <Typography level="body-md"> Loading Spotify data...</Typography>
                    </Box>
                </Box>}

                {!loading && !!playlist && !!showOptimizer &&
                    <Modal open>
                        <ModalDialog sx={{ maxWidth: '400px' }}>
                            <ModalClose />
                            <Typography level="h1">Large playlist detected</Typography>
                            <Typography level="body-sm">You are trying to match a large playlist with Plex. With the normal (more thourough) approach this will take a very long time. Using the fast approach it will do a more inaccurate search but it will be a lot faster.</Typography>
                            <Typography level="body-sm">Which option do you want to use?</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button onClick={onUseFastClick}>Fast</Button>
                                <Button onClick={onUseNormalClick}>Normal</Button>
                            </Box>
                        </ModalDialog>
                    </Modal>
                }

                {!loading && !!playlist && !showOptimizer &&
                    <>
                        <Button component="a" href="/spotify" variant="outlined" color="neutral" size="sm" startDecorator={<ChevronLeft />}>Back</Button>
                        <PlexPlaylist playlist={playlist} fast={fast} />
                    </>
                }
            </Container>
        </MainLayout >

    </>
    )
}

export default Page;
