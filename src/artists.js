
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

export class SpotifyArtists {
    constructor(api) {
        this.api = api;
    }

    /**
     * Get Spotify catalog information for a single artist identified by their unique Spotify ID. 
     * @param {string} id - The Spotify ID of the artist.
     * @returns {Promise} Returns artist object.
    */
    async get_artist(id) {
        return await this.api._auth_get('/artists/' + id);
    }

    /**
     * Get Spotify catalog information for several artists based on their Spotify IDs.
     * @param {object} ids - An array with the Spotify IDs of the artists. 
     * @returns {Promise} Returns object with artists info. 
    */
    async get_artists(ids) {
        let params = new URLSearchParams({
            ids: ids.join()
        });

        return await this.api._auth_get('/artists?' + params);
    }

    /**
     * Get Spotify catalog information about an artist's albums.
     * @param {string} id - The Spotify ID of the artist.
     * @param {object} include_groups - An array of keywords that will be used to filter the response.
     * @param {string} market - An ISO 3166-1 alpha-2 country code. Only content that is
     * available in that market will be returned, the country associated with the user account
     * will take priority over this parameter.
     * @param {number} limit - The maximum number of items to return. Default: 20.
     * Minimum: 1.Maximum: 50.
     * @param {number} offset - The index of the first item to return.
     * @returns {Promise} Returns artist's albums. 
    */
    async get_albums(id, include_groups=['album','single','appears_on','compilation'], market='', limit=20, offset=0) {
        let params = new URLSearchParams({
            include_groups: include_groups.join(),
            market: market,
            limit: limit,
            offset: offset
        });

        return await this.api._auth_get('/artists/' + id + '/albums?' + params);
    }

    /**
     * Get Spotify catalog information about an artist's top tracks by country.
     * @param {string} id - The Spotify ID of the artist.
     * @param {string} market - An ISO 3166-1 alpha-2 country code. Only content that is
     * available in that market will be returned, the country associated with the user account
     * will take priority over this parameter.
     * @returns {Promise} Returns artist's top tracks.
    */
    async get_top_tracks(id, market='') {
        let params = new URLSearchParams({
            market: market
        });

        return await this.api._auth_get('/artists/' + id + '/top-tracks?' + params);
    }

    /**
     * Get Spotify catalog information about artists similar to a given artist.
     * Similarity is based on analysis of the Spotify community's listening history.
     * @param {string} id - The Spotify ID of the artist.
     * @returns {Promise} Returns related artists.
    */
    async get_related_artists(id) {
        return await this.api._auth_get('/artists/' + id +'/related-artists');
    }
}