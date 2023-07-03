
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

export class SpotifyApi extends _WebApi {
    constructor(client_id, redirect_uri) {
        super(client_id, redirect_uri);
    }

    _b64urlencode(data) {
        return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    async _gen_code_challenge(code_verifier) {
        const encoder = new TextEncoder();

        let bytes = encoder.encode(code_verifier);
        let digest = await window.crypto.subtle.digest('SHA-256', bytes);
        digest = new Uint8Array(digest);

        return this._b64urlencode(String.fromCharCode.apply(null, digest));
    }

    _random_string(size) {
        let bytes = new Uint8Array(size);
        window.crypto.getRandomValues(bytes);
        return this._b64urlencode(String.fromCharCode.apply(null, bytes));
    }

    auth_by_pcke_flow(scope) {
        let code_verifier = this._random_string(95);
        let csrf_token = this._random_string(12);

        localStorage.setItem('code_verifier', code_verifier);
        localStorage.setItem('csrf_token', csrf_token);

        this._gen_code_challenge(code_verifier).then(code_challenge => {
            let args = new URLSearchParams({
                response_type: 'code',
                client_id: this._client_id,
                scope: scope,
                redirect_uri: this._redirect_uri,
                state: csrf_token,
                code_challenge_method: 'S256',
                code_challenge: code_challenge
            });

            window.location = 'https://accounts.spotify.com/authorize?' + args;
        });
    }

    async finish_pcke_flow() {
        const url_params = new URLSearchParams(window.location.search);
        let code = url_params.get('code');

        let code_verifier = localStorage.getItem('code_verifier');
        let csrf_token = localStorage.getItem('csrf_token');

        if ((csrf_token != url_params.get('state')) || (url_params.get('state') === null)) {
            throw new AuthError('Request not started by us.');
        }

        if (code === null) {
            throw new AuthError(url_params.get('error'));
        }

        let body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: this._redirect_uri,
            client_id: this._client_id,
            code_verifier: code_verifier
        });

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
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

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('access_expires', this._access_expires);
        localStorage.setItem('refresh_token', data.refresh_token);
    }
}