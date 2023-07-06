
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

export class SpotifyPlaylists {
    constructor(api) {
        this.api = api;
    }

    /**
     * Check to see if one or more Spotify users are following a specified playlist.
     * @async
     * @param {string} playlist_id - Spotify ID of the playlist.
     * @param {object} ids - An array of the Sporify IDs of the users that you want to check to see
     * if they follow the playlist. A maximum of 5 IDs.
     */
    async check_if_followed_by(playlist_id, ids) {
        let params = new URLSearchParams({
            playlist_id: playlist_id,
            ids: ids.join()
        });

        return await this._auth_get('/playlists/' + playlist_id + '/followers/contains?' + params);
    }
}