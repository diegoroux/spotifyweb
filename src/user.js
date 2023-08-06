
/*  Copyright (C) 2023 Diego Roux
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; 
 *  version 3 of the License.
 *  
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 * 
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301
 *  USA
*/

export class SpotifyUser {
    constructor(api) {
        this.api = api;
    }

    /**
     * Get a list of the albums saved in the current Spotify user's 'Your Music' library.
     * @async
     * @param {number} limit - The maximum number of items to return.
     * Default: 20. Maximum: 50. 
     * @param {number} offset - The index of the first item to return. Default: 0
     * @param {string} market - An ISO 3166-1 alpha-2 country code. Only content that is
     * available in that market will be returned, the country associated with the user account
     * will take priority over this parameter.
     * @returns {Promise} Returns object with albums saved by the user. 
     */
    async get_saved_albums(limit=20, offset=0, market='') {
        let params = new URLSearchParams({
            limit: limit,
            offset: offset
        });

        if (market !== '') {
            params.append('market', market);
        }

        return await this._auth_get('/me/albums?' + params);
    }

    /**
     * Save one or more albums to the current user's 'Your Music' library.
     * @async
     * @param {object} ids - An array of the albums Spotify IDs. Max: 20 albums.
     */
    async save_albums(ids) {
        await this.api._auth_put('/me/albums', { ids: ids });
    }

    /**
     * Remove one or more albums from the current user's 'Your Music' library.
     * @async
     * @param {object} ids - An array of the albums Spotify IDs. Max: 20 albums.
     */
    async remove_albums(ids) {
        let params = new URLSearchParams({
            ids: ids.join()
        });

        await this.api._auth_delete('/me/albums?' + params);
    }

    /**
     * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.
     * @async
     * @param {object} ids - An array of the albums Spotify IDs. Max: 20 albums.
     * @return {Promise} - Returns an array of booleans.
     */
    async check_if_albums_saved(ids) {
        let params = new URLSearchParams({
            ids: ids.join()
        });

        return await this.api._auth_get('/me/albums/contains?' + params);
    }

    /**
     * Get a list of the audiobooks saved in the current Spotify user's 'Your Music' library.
     * @async
     * @param {number} limit - The maximum number of items to return.
     * Default: 20. Maximum: 50.
     * @param {number} offset - The index of the first item to return.
     * Default: 0
     * @returns {Promise} Returns a list of the audiobooks saved by th user. 
     */
    async get_saved_audiobooks(limit=20, offset=0) {
        let params = new URLSearchParams({
            limit: limit,
            offset: offset
        });

        return await this.api._auth_get('/me/audiobooks?' + params);
    }

    /**
     * Save one or more audiobooks to the current Spotify user's library.
     * @async
     * @param {object} ids - An array of the audiobooks Spotify IDs. Max: 50 IDs.
     */
    async save_audiobooks(ids) {
        let params = new URLSearchParams({
            ids: ids.join()
        });

        await this.api._auth_put('/me/audiobooks?' + params, '');
    }

    /**
     * Remove one or more audiobooks from the Spotify user's library.
     * @async
     * @param {object} ids - An array of the audiobooks Spotify IDs. Max: 50 IDs.
     */
    async delete_audiobooks(ids) {
        let params = new URLSearchParams({
            ids: ids.join()
        });

        await this.api._auth_delete('/me/audiobooks?' + params);
    }

    /**
     * Check if one or more audiobooks are already saved in the current Spotify user's library.
     * @async
     * @param {object} ids - An array of the audiobooks Spotify IDs. Max: 50 IDs.
     * @returns {Promise} Returns an array of booleans.
     */
    async check_if_audiobooks_saved(ids) {
        let params = new URLSearchParams({
            ids: ids.join()
        });

        return await this.api._auth_get('/me/audiobooks/contains?' + params);
    }

    /**
     * Get a list of the episodes saved in the current Spotify user's library.
     * Warning: This enpoint is in beta.
     * @async
     * @param {string} market - An ISO 3166-1 alpha-2 country code. Only content that is
     * available in that market will be returned, the country associated with the user account
     * will take priority over this parameter.
     * @param {number} limit - The maximum number of items to return. Max: 50. Default: 20
     * @param {number} offset - The index of the first item to return. Default: 0
     * @returns {Promise} Object with episodes saved by the user.
     */
    async get_saved_episodes(market='', limit=20, offset=0) {
        let params = new URLSearchParams({
            limit: limit,
            offset: offset
        });

        if (market !== '') {
            params.append('market', market);
        }

        return await this.api._auth_get('/me/episodes?' + params);
    }

    /**
     * Save one or more episodes to the current user's library.
     * Warning: This enpoint is in beta.
     * @async
     * @param {object} ids - An array of the episodes Spotify IDs. Max: 50 IDs.
     */
    async saved_episodes(ids) {
        await this.api._auth_put('/me/episodes', { ids: ids });
    }

    /**
     * Remove one or more episodes from the current user's library.
     * Warning: This enpoint is in beta.
     * @async
     * @param {object} ids - An array of the episodes Spotify IDs. Max: 50 IDs.
     */
    async remove_episodes(ids) {
        await this.api._auth_delete('/me/episodes', { ids: ids });
    }

    /**
     * Get a list of the playlists owned or followed by the current Spotify user.
     * @async
     * @param {number} limit - The maximum number of items to return. Max: 50. Default: 20
     * @param {number} offset - The index of the first item to return. Default: 0
     * @returns {Promise} Returns object of playlists owned or followed by the user.
     */
    async get_playlists(limit=20, offset=0) {
        let params = new URLSearchParams({
            limit: limit,
            offset: offset
        });

        return await this.api._auth_get('/me/playlists?' + params);
    }

    /**
     * Get a list of the playlists owned or followed by a Spotify user.
     * @async
     * @param {string} user_id - Spotify user ID.
     * @param {number} limit - The maximum number of items to return. Max: 50. Default: 20
     * @param {number} offset - The index of the first item to return. Default: 0
     */
    async get_user_playlists(user_id, limit=20, offset=0) {
        let params = new URLSearchParams({
            limit: limit,
            offset: offset
        });

        return await this.api._auth_get('/users/' + user_id + '/playlists?' + params);
    }

    /**
     * Get a list of shows saved in the current Spotify user's library.
     * @async
     * @param {number} limit - The maximum number of items to return. Max: 50. Default: 20
     * @param {number} offset - The index of the first item to return. Default: 0
     * @returns {Promise} Returns object with shows saved by user.
     */
    async get_saved_shows(limit=20, offset=0) {
        let params = new URLSearchParams({
            limit: limit,
            offset: offset
        });

        return await this.api._auth_get('/me/shows?' + params);
    }

    /**
     * Save one or more shows to current Spotify user's library.
     * @async
     * @param {object} ids - An array of the shows Spotify IDs. Max: 50 IDs.
     */
    async save_shows(ids) {
        let params = new URLSearchParams({
            ids: ids.join()
        });

        await this.api._auth_put('/me/shows?' + params);
    }

    /**
     * Delete one or more shows from current Spotify user's library.
     * @async
     * @param {object} ids - An array of the shows Spotify IDs. Max: 50 IDs.
     * @param {string} market - An ISO 3166-1 alpha-2 country code. Only content that is available
     * in that market will be returned, the country associated with the user account will take
     * priority over this parameter.
     */
    async remove_shows(ids, market='') {
        let params = new URLSearchParams({
            ids: ids.join()
        });

        if (market !== '') {
            params.append('market', market);
        }

        await this.api._auth_delete('/me/shows?' + params);
    }

    /**
     * Check if one or more shows is already saved in the current Spotify user's library.
     * @async
     * @param {object} ids - An array of the shows Spotify IDs. Max: 50 IDs.
     * @returns {Promise} An array of booleans.
     */
    async check_if_shows_saved(ids) {
        let params = new URLSearchParams({
            ids: ids.join()
        });

        return await this.api._auth_get('/me/shows/contains?' + params);
    }

    /**
     * Get a list of the songs saved in the current Spotify user's 'Your Music' library.
     * @async
     * @param {string} market - An ISO 3166-1 alpha-2 country code. Only content that is available
     * in that market will be returned, the country associated with the user account will take
     * priority over this parameter.
     * @param {number} limit - The maximum number of items to return. Max: 50. Default: 20
     * @param {number} offset - The index of the first item to return. Default: 0
     * @returns {Promise} Returns object with saved tracks by user.
     */
    async get_saved_tracks(market='', limit=20, offset=0) {
        let params = new URLSearchParams({
            limit: limit,
            offset: offset
        });

        if (market !== '') {
            params.append('market', market);
        }

        return await this.api._auth_get('/me/tracks?' + params);
    }

    /**
     * Save one or more tracks to the current user's 'Your Music' library.
     * @async
     * @param {object} ids - An array of the tracks Spotify IDs. Max: 50 IDs.
     */
    async save_tracks(ids) {
        await this.api._auth_put('/me/tracks', { ids: ids });
    }

    /**
     * Remove one or more tracks from the current user's 'Your Music' library.
     * @async
     * @param {object} ids - An array of the tracks Spotify IDs. Max: 50 IDs.
     */
    async remove_tracks(ids) {
        let params = new URLSearchParams({
            ids: ids.join()
        });

        await this.api._auth_delete('/me/tracks?' + params);
    }

    /**
     * Check if one or more tracks is already saved in the current Spotify user's 'Your Music' library.
     * @async
     * @param {object} ids - An array of the tracks Spotify IDs. Max: 50 IDs.
     * @returns {Promise} Returns array of booleans.
     */
    async check_if_tracks_saved(ids) {
        let params = new URLSearchParams({
            ids: ids.join()
        });

        return await this.api._auth_delete('/me/tracks/contains?' + params);
    }

    /**
     * Get detailed profile information about the current user
     * (including the current user's username).
     * @async
     * @returns {Promise} Returns object containing profile information.
     */
     async get_current_profile() {
        return await this.api._auth_get('/me');
    }

    /**
     * Get the current user's top artists or tracks based on calculated affinity.
     * @async
     * @param {string} type - type of entity to return. Valid types: 'artists' or 'tracks'.
     * @param {string} time_range - Over what time frame the affinities are computed.
     * Valid types: 'long_term', 'medium_term', 'short_term'. Default: 'medium_term'.
     * @param {number} limit - The maximum number of items to return.
     * Max: 50. Default: 20
     * @param {number} offset - The index of the first item to return.
     * Default: 0.
     * @returns {Promise} Returns object with user's top artists or tracks. 
     */
    async get_top(type, time_range='medium_term', limit=20, offset=0) {
        let params = new URLSearchParams({
            time_range: time_range,
            limit: limit,
            offset: offset
        });

        return await this.api._auth_get('/me/top/' + type + '?' + params);
    }

    /**
     * Get public profile information about a Spotify user.
     * @async
     * @param {string} user_id - Spotify user ID.
     * @returns {Promise} Returns object with user profile information.
     */
    async get_user_profile(user_id) {
        return await this._auth_get('/users/' + user_id);
    }

    /**
     * Add the current user as a follower of a playlist.
     * @async
     * @param {string} playlist_id - Spotify ID of the playlist.
     * @param {boolean} playlist_public - Whether the playlist will be included in user's 
     * public playlists or will remain private. Default: true
     */
    async follow_playlist(playlist_id, playlist_public=true) {
        await this._auth_put('/playlists/' + playlist_id + '/followers', { public: playlist_public });
    }

    /**
     * Remove the current user as a follower of a playlist.
     * @async
     * @param {string} playlist_id - Spotify ID of the playlist.
     */
    async unfollow_playlist(playlist_id) {
        await this._auth_delete('/playlists/' + playlist_id + '/followers');
    }

    /**
     * Get the current user's followed artists.
     * @async
     * @param {string} after - The last artist ID retrieved from the previous request.
     * @param {number} limit - The maximum number of items to return.
     * Default: 20. Maximum: 50. 
     * @returns {Promise} Returns an object with followed artists by user.
     */
    async get_followed_artists(after='', limit=20) {
        let params = new URLSearchParams({
            type: 'artist',
            limit: limit
        });

        if (after !== '') {
            params.after = after;
        }

        return await this._auth_get('/me/following?' + params);
    }

    /**
     * Add the current user as a follower of one or more artists or other Spotify users.
     * @async
     * @param {string} type - 'artist' or 'user'.
     * @param {object} ids - An array of the artist or the user Spotify IDs.
     * A maximum of 50 IDs can be sent in one request. 
     */
    async follow(type, ids) {
        await this._auth_put('/me/following?type=' + type, { ids: ids });
    }

    /**
     * Remove the current user as a follower of one or more artists or other Spotify users.
     * @async
     * @param {string} type - 'artist' or 'user'.
     * @param {object} ids - An array of the artist or the user Spotify IDs.
     * A maximum of 50 IDs can be sent in one request.
     */
    async unfollow(type, ids) {
        let params = new URLSearchParams({
            type: type,
            ids: ids.join()
        });

        await this._auth_delete('/me/following?' + params);
    }

    /**
     * Check to see if the current user is following one or more artists or other Spotify users.
     * @async
     * @param {string} type - 'artist' or 'user'.
     * @param {object} ids - An array of the artist or the user Spotify IDs.
     * A maximum of 50 IDs can be sent in one request.
     * @returns {Promise} Returns an array of booleans. 
     */
    async check_if_follows(type, ids) {
        let params = new URLSearchParams({
            type: type,
            ids: ids.join()
        });

        return await this._auth_get('/me/following/contains?' + params); 
    }
}