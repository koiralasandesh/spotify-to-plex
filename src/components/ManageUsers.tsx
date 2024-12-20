import { errorBoundary } from "@/helpers/errors/errorBoundary";
import { GetSpotifyUserResponse } from "@/pages/api/spotify/users";
import { Album, Close, QueueMusic, Settings } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, Sheet, Tooltip, Typography } from "@mui/joy";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import UserItems from "./UserItems";
import UserSyncSettings from "./UserSyncSettings";

export default function ManageUsers() {

    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<GetSpotifyUserResponse[]>([])

    useEffect(() => {
        errorBoundary(async () => {
            const result = await axios.get<GetSpotifyUserResponse[]>(`/api/spotify/users`)
            setUsers(result.data)
            setLoading(false)
        }, () => {
            setLoading(false)
        }, true)
    }, [])

    const onDeleteUserClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const { id } = e.currentTarget.dataset;
        if (id) {
            errorBoundary(async () => {
                const result = await axios.delete<GetSpotifyUserResponse[]>(`/api/spotify/users?id=${id}`)
                setUsers(result.data)
                enqueueSnackbar(`User removed`)
            })
        }

    }, [])

    /////////////////////////////
    // Set User
    /////////////////////////////
    const [editUser, setEditUser] = useState<GetSpotifyUserResponse | null>(null)
    const onSettingsUserClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const { id } = e.currentTarget.dataset;
        if (id) {
            const user = users.find(item => item.id == id)
            if (user)
                setEditUser(user)
        }
    }, [users])
    const onEditUserClose = useCallback((reload?: boolean) => {
        if (reload) {
            errorBoundary(async () => {
                const result = await axios.get<GetSpotifyUserResponse[]>(`/api/spotify/users`)
                setUsers(result.data)
            })
        }

        setEditUser(null)
    }, [])

    /////////////////////////////
    // Set User
    /////////////////////////////
    const [userItems, setUserItems] = useState<{ user: GetSpotifyUserResponse, type: "albums" | "playlists" } | null>(null)
    const onItemsUserClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const { id, type } = e.currentTarget.dataset;
        if (id && (type == "albums" || type == "playlists")) {
            const user = users.find(item => item.id == id)
            if (user)
                setUserItems({ user, type })
        }
    }, [users])

    const onUserItemsClose = useCallback(() => {
        setUserItems(null)
    }, [])

    return (<>
        {loading ?
            <Box sx={{ textAlign: 'center', p: 2 }}><CircularProgress /></Box>
            :
            <>
                <Typography mb={.5} level="body-md">When connecting users you can sync recent songs, saved playlists and albums.</Typography>

                {users.length > 0 ?
                    <>
                        <Typography level="h2" mt={2} mb={.5}>Connected Spotify users</Typography>
                        {users.map(item => {

                            return <Sheet variant="outlined" key={item.id} sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography level="body-md">{item.name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                                    <Tooltip title="Select albums to import" ><IconButton data-id={item.id} data-type="albums" onClick={onItemsUserClick} variant="outlined" size="sm" ><Album sx={{ fontSize: '1em' }} /></IconButton></Tooltip>
                                    <Tooltip title="Select playlists to import" ><IconButton data-id={item.id} data-type="playlists" onClick={onItemsUserClick} variant="outlined" size="sm" ><QueueMusic sx={{ fontSize: '1em' }} /></IconButton></Tooltip>
                                    <Tooltip title="Settings" ><IconButton data-id={item.id} onClick={onSettingsUserClick} variant="outlined" size="sm" ><Settings sx={{ fontSize: '1em' }} /></IconButton></Tooltip>
                                    <Tooltip title="Delete user"><IconButton data-id={item.id} onClick={onDeleteUserClick} variant="outlined" color="danger" size="sm" ><Close sx={{ fontSize: '1em' }} /></IconButton></Tooltip>
                                </Box>
                            </Sheet>
                        })}
                        <Box pt={1}>
                            <Typography level="body-sm" mb={1}>You can add more users if you want. But make sure to first log out of spotify.com or open this window in an incognito window. Otherwise it will simply reconnect the last user.</Typography>
                            <Button size="sm" variant="outlined" component="a" href="/api/spotify/login" sx={{ borderColor: "#1db954" }}>Add another user</Button>

                        </Box>
                    </>
                    :
                    <Button component="a" href="/api/spotify/login" size="sm" sx={{ background: "#1db954", mt: 1 }}>Connect Spotify Account</Button>

                }


            </>
        }
        {!!editUser && <UserSyncSettings user={editUser} onClose={onEditUserClose} />}
        {!!userItems && <UserItems user={userItems.user} type={userItems.type} onClose={onUserItemsClose} />}
    </>
    )
}