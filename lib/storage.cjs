const { config } = require( './config.cjs' );
const { existsSync, mkdirSync } = require( 'node:fs' );
const { readFile, writeFile } = require( 'node:fs' ).promises;
const { join } = require( 'node:path' );

class Storage {

    constructor () {
        this.root = join( __dirname, '..', config.storage );
        mkdirSync( this.root, { recursive: true } );
    }

    async readJSON ( filename ) {
        const filePath = join( this.root, filename );
        if ( ! existsSync( filePath ) ) return null;
        return JSON.parse( await readFile( filePath, 'utf-8' ) );
    }

    async writeJSON ( filename, data ) {
        const filePath = join( this.root, filename );
        const jsonData = JSON.stringify( data, null, config.compression ? undefined : 2 );
        await writeFile( filePath, jsonData, 'utf-8' );
    }

}

const storage = new Storage();

module.exports = {
    Storage, storage,
    readJSON: storage.readJSON.bind( storage ),
    writeJSON: storage.writeJSON.bind( storage )
};
