import { generateError } from '@/helpers/errors/generateError';
import getCachedTrackLinks from '@/helpers/getCachedTrackLink';
import getTidalCredentials from '@/helpers/tidal/getTidalCredentials';
import { Album, Track } from '@/types/SpotifyAPI';
import { SearchResponse, TidalMusicSearch } from '@jjdenhertog/tidal-music-search';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export type GetTidalTracksResponse = {
    id: string,
    title: string
    artist: string
    album: string
    tidal_ids?: string[]
}

const router = createRouter<NextApiRequest, NextApiResponse>()
    .post(
        async (req, res) => {

            const searchItems: Track[] = req.body.items
            const album: Album = req.body.album
            const { type = 'spotify-playlist' } = req.body;

            if (!Array.isArray(searchItems))
                throw new Error(`Array of items expected, none found`)

            if (typeof process.env.TIDAL_API_CLIENT_ID != 'string')
                throw new Error(`Environment variable TIDAL_API_CLIENT_ID is missing`)

            if (typeof process.env.TIDAL_API_CLIENT_SECRET != 'string')
                throw new Error(`Environment variable TIDAL_API_CLIENT_SECRET is missing`)

            ///////////////////////////////////////
            // Tidal authentication
            ///////////////////////////////////////
            const tidalUser = await getTidalCredentials()
            const tidalMusicSearch = new TidalMusicSearch({
                clientId: process.env.TIDAL_API_CLIENT_ID,
                clientSecret: process.env.TIDAL_API_CLIENT_SECRET
            })
            tidalMusicSearch.user = tidalUser;

            //////////////////////////////////////
            // Handeling cached links
            //////////////////////////////////////
            let searchResult: SearchResponse[] = []
            switch (type) {
                case "spotify-album":
                    searchResult = await tidalMusicSearch.searchAlbum(searchItems)
                    break;

                default:
                    searchResult = await tidalMusicSearch.search(searchItems)
                    break;
            }

            ///////////////////////////
            // Store caching
            ///////////////////////////
            const { add } = getCachedTrackLinks(searchItems, 'tidal')
            add(searchResult, 'tidal', album)

            return res.status(200).json(searchResult.map(item => ({ ...item, tidal_ids: item.result.map(item => item.id) })))
        })

export default router.handler({
    onError: (err: any, req, res) => {
        generateError(req, res, "Tidal Tracks", err);
    },
});


