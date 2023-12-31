
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

export class AuthError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'AuthError';
    }
}

export class CSRFInvalid extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'CSRFInvalid';
    }
}

export class RateLimited extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'RateLimited';
    }
}

export class ReAuthNeeded extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'ReAuthNeeded';
    }
}

export class Forbidden extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'Forbidden';
    }
}

export class HTTPErr extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'HTTPErr';
    }
}