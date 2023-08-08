
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

import { SpotifyAlbums } from "./albums.js";
import { ReAuthNeeded, RateLimited, HTTPErr, Forbidden } from "./errors.js";
import { SpotifyPlaylists } from "./playlists.js";
import { SpotifyUser } from "./user.js";

export class _WebApi {
    constructor(client_id, redirect_uri) {
        this._client_id = client_id;
        this._redirect_uri = redirect_uri;
        this._endpoint_uri = 'https://api.spotify.com/v1';

        this.user = new SpotifyUser(this);
        this.playlists = new SpotifyPlaylists(this);
        this.albums = new SpotifyAlbums(this);
    }

    async _handle_http_err(code) {
        if (code == 401) {
            throw new ReAuthNeeded();
        }

        if (code == 403) {
            throw new Forbidden('It\'s possible that you do not have the necessary client scope to perform this action.');
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

}