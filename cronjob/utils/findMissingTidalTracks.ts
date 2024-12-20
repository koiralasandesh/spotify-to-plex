import getCachedTrackLinks from "@/helpers/getCachedTrackLink";
import getTidalCredentials from "@/helpers/tidal/getTidalCredentials";
import { Track } from "@/types/SpotifyAPI";
import { TidalMusicSearch } from "@jjdenhertog/tidal-music-search";

export async function findMissingTidalTracks(missingTracks: Track[]) {

    if (typeof process.env.TIDAL_API_CLIENT_ID != 'string' || typeof process.env.TIDAL_API_CLIENT_SECRET != 'string')
        return [];

    // Caching
    const { add, found: cachedTidalLinks } = getCachedTrackLinks(missingTracks, 'tidal');
    const result: { id: string; tidal_id: string; }[] = [];

    for (let i = 0; i < missingTracks.length; i++) {
        const searchItem = missingTracks[i];

        // Process if no cached link has been found
        const trackLink = cachedTidalLinks.find(item => item.spotify_id == searchItem.id);
        const tidalIds = trackLink?.tidal_id;
        if (!tidalIds || tidalIds.length == 0)
            continue;

        result.push({ id: searchItem.id, tidal_id: tidalIds[0] });
    }

    const toSearchTidalTracks = missingTracks.filter(item => !result.some(track => track.id == item.id));
    if (toSearchTidalTracks.length > 0) {

        console.log(`Search for ${toSearchTidalTracks.length} tracks on Tidal`);

        // Credentials
        const tidalUser = await getTidalCredentials();
        const tidalMusicSearch = new TidalMusicSearch({
            clientId: process.env.TIDAL_API_CLIENT_ID,
            clientSecret: process.env.TIDAL_API_CLIENT_SECRET
        });
        tidalMusicSearch.user = tidalUser;

        const tidalSearchResponse = await tidalMusicSearch.search(toSearchTidalTracks);

        for (let i = 0; i < toSearchTidalTracks.length; i++) {
            const track = toSearchTidalTracks[i];
            const tidalData = tidalSearchResponse.find(item => item.id == track.id);
            if (tidalData && tidalData.result.length > 0)
                result.push({ id: track.id, tidal_id: tidalData.result[0].id });
        }

        add(tidalSearchResponse, 'tidal');
    }

    return result;
}
