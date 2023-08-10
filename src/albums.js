
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

export class SpotifyAlbums {
    constructor(api) {
        this.api = api;
    }

    /**
     * Get Spotify catalog information for a single album.
     * @async
     * @param {string} id - The Spotify ID of the album.
     * @param {string} market - An ISO 3166-1 alpha-2 country code. Only content that is
     * available in that market will be returned, the country associated with the user account
     * will take priority over this parameter.
     * @returns {Promise} Returns object with album's info. 
    */
    async get_album(id, market='') {
        let url = '/albums/' + id;

        if (market !== '') {
            let params = new URLSearchParams({ market: market });
            url = url + '?' + params;
        }

        return await this.api._auth_get(url);
    }

    /**
     * Get Spotify catalog information for multiple albums identified by their Spotify IDs.
     * @async
     * @param {object} ids - An array of the Spotify IDs of the albums. 
     * @param {string} market - An ISO 3166-1 alpha-2 country code. Only content that is
     * available in that market will be returned, the country associated with the user account
     * will take priority over this parameter.
     * @returns {Promise} Returns array of album objects.
     */
    async get_albums(ids, market='') {
        let params = new URLSearchParams({
            ids: ids.join(),
            market: market
        });

        return await this.api._auth_get('/albums?' + params);
    }

    /**
     * Get Spotify catalog information about an album’s tracks.
     * @param {string} id - The Spotify ID of the album.
     * @param {string} market - An ISO 3166-1 alpha-2 country code. Only content that is
     * available in that market will be returned, the country associated with the user account
     * will take priority over this parameter.
     * @param {number} limit - The maximum number of items to return. Default: 20.
     * Minimum: 1.Maximum: 50.
     * @param {number} offset - The index of the first item to return.
     * @returns 
    */
    async get_tracks(id, market='', limit=20, offset=0) {
        let params = new URLSearchParams({
            market: market,
            limit: limit,
            offset: offset
        });

        return await this.api._auth_get('/albums/' + id + '/tracks?' + params);
    }

    /**
     * Get a list of new album releases featured in Spotify.
     * @param {string} country - An ISO 3166-1 alpha-2 country code. Provide this parameter
     * if you want the list of returned items to be relevant to a particular country. 
     * @param {number} limit - The maximum number of items to return. Default: 20.
     * Minimum: 1.Maximum: 50.
     * @param {number} offset - The index of the first item to return.
     * @returns {Promise}
    */
    async get_new_releases(country='', limit=20, offset=0) {
        let params = new URLSearchParams({
            limit: limit,
            offset: offset
        });

        if (country !== '') {
            params.append('country', country);
        }

        return await this.api._auth_get('/browse/new-releases?' + params);
    }
}