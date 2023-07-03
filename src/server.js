
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

import { _WebApi } from "./webapi.js";
import { AuthError } from "./auth.js";
import { randomBytes } from 'crypto';

export class SpotifyApi extends _WebApi {
    constructor(client_id, client_secret, redirect_uri) {
        super(client_id, redirect_uri);
        this._client_secret = client_secret;
    }

    _random_string(size) {
        return randomBytes(size).toString('base64');
    }

    async auth_by_client_credentials() {
        let body = new URLSearchParams({
            grant_type: 'client_credentials'
        });

        let auth = new Buffer.from(this._client_id + ':' + this._client_secret).toString('base64');

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + auth,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            if (response.status < 500) {
                let data = await response.json();
                throw new AuthError(data.error_description);
            }
            throw new AuthError(response.statusText);
        }

        let data = await response.json();

        this._access_token = data.access_token;
        this._access_expires = Date.now() + data.expires_in;
        this._refresh_token = data.refresh_token;
    }

    auth_by_code(scope) {
        this._csrf_token = this._random_string(12);

        let args = new URLSearchParams({
            client_id: this._client_id,
            response_type: 'code',
            redirect_uri: this._redirect_uri,
            state: this._csrf_token,
            scope: scope
        });

        return 'https://accounts.spotify.com/authorize?' + args;
    }

    async finish_auth_flow(params) {
        let args = new URLSearchParams(params);
        let code = args.get('code');

        if ((this._csrf_token != args.get('state')) || (args.get('state') === null)) {
            throw new AuthError('Request not started by us.');
        }

        if (code === null) {
            throw new AuthError(args.get('error'));
        }

        let body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: this._redirect_uri
        });

        let auth = new Buffer.from(this._client_id + ':' + this._client_secret).toString('base64');

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + auth,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        });

        if (!response.ok) {
            if (response.status < 500) {
                let data = await response.json();
                throw new AuthError(data.error_description);
            }
            throw new AuthError(response.statusText);
        }

        let data = await response.json();

        this._access_token = data.access_token;
        this._access_expires = Date.now() + data.expires_in;
        this._refresh_token = data.refresh_token;
    }
}