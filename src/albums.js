
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

        return await this._get(url);
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

        return await this._get('/albums?' + params);
    }
}