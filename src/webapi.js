
/*  Copyright (C) 2023 Diego Roux
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or (at your option) any later version.
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

import { ReAuthNeeded, RateLimited, HTTPErr } from "./errors.js";

export class _WebApi {
    constructor(client_id, redirect_uri) {
        this._client_id = client_id;
        this._redirect_uri = redirect_uri;
        this._endpoint_uri = 'https://api.spotify.com/v1/';
    }

    async _handle_http_err(code) {
        if (code == 401) {
            throw new ReAuthNeeded();
        }

        if (code == 429) {
            throw new RateLimited();
        }

        throw new HTTPErr(code);
    }

    async _auth_get(url) {
        const response = await fetch(this._endpoint_uri + url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this._access_token
            }
        });

        if (!response.ok) {
            this._handle_http_err(response.status);
        }

        return await response.json();
    }

    async _auth_put(url, body) {
        const response = await fetch(this._endpoint_uri + url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + this._access_token,
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            this._handle_http_err(response.status);
        }
    }

    async _auth_delete(url) {
        const response = await fetch(this._endpoint_uri + url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this._access_token,
            }
        });

        if (!response.ok) {
            this._handle_http_err(response.status);
        }
    }

    /**
     * Get detailed profile information about the current user
     * (including the current user's username).
     * @async
     * @returns {Promise} Returns object containing profile information.
     */
    async get_current_profile() {
        return await this._auth_get('/me');
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
    async user_get_top(type, time_range='medium_term', limit=20, offset=0) {
        let params = new URLSearchParams({
            time_range: time_range,
            limit: limit,
            offset: offset
        });

        return await this._auth_get('/me/top/' + type + params);
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
     * @param {boolean} public - Wether the playlist will be included in user's public
     * playlists or will remain private. Default: true
     */
    async follow_playlist(playlist_id, public=true) {
        await this._auth_put('/playlists/' + playlist_id + '/followers', { public: public });
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

        return await this._auth_get('/me/following' + params);
    }

    /**
     * Add the current user as a follower of one or more artists or other Spotify users.
     * @async
     * @param {string} type - 'artist' or 'user'.
     * @param {object} ids - An array of the artist or the user Spotify IDs.
     * A maximum of 50 IDs can be sent in one request. 
     */
    async user_follow(type, ids) {
        await this._auth_put('/me/following?type=' + type, { ids: ids });
    }

    /**
     * Remove the current user as a follower of one or more artists or other Spotify users.
     * @async
     * @param {string} type - 'artist' or 'user'.
     * @param {object} ids - An array of the artist or the user Spotify IDs.
     * A maximum of 50 IDs can be sent in one request.
     */
    async user_unfollow(type, ids) {
        let params = new URLSearchParams({
            type: type,
            ids: ids.join()
        });

        await this._auth_delete('/me/following' + params);
    }

    /**
     * Check to see if the current user is following one or more artists or other Spotify users.
     * @async
     * @param {string} type - 'artist' or 'user'.
     * @param {object} ids - An array of the artist or the user Spotify IDs.
     * A maximum of 50 IDs can be sent in one request.
     * @returns {Promise} Returns an array of booleans. 
     */
    async check_if_user_follows(type, ids) {
        let params = new URLSearchParams({
            type: type,
            ids: ids.join()
        });

        return await this._auth_get('/me/following/contains' + params); 
    }

    /**
     * Check to see if one or more Spotify users are following a specified playlist.
     * @async
     * @param {string} playlist_id - Spotify ID of the playlist.
     * @param {object} ids - An array of the Sporify IDs of the users that you want to check to see
     * if they follow the playlist. A maximum of 5 IDs.
     */
    async check_if_playlist_followed_by(playlist_id, ids) {
        let params = new URLSearchParams({
            playlist_id: playlist_id,
            ids: ids.join()
        });

        return await this._auth_get('/playlists/' + playlist_id + '/followers/contains' + params);
    }

}