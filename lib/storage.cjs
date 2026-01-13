const { config } = require( './config.cjs' );
const { existsSync, mkdirSync, readdirSync } = require( 'node:fs' );
const { readFile, writeFile } = require( 'node:fs' ).promises;
const { join } = require( 'node:path' );
const { parse, stringify } = require( 'csv-string' );

class Storage {

    constructor () {
        this.root = join( __dirname, '..', config.storage );
        mkdirSync( join( this.root, 'year' ), { recursive: true } );
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

    async readCSV ( filename ) {
        const filePath = join( this.root, filename );
        if ( ! existsSync( filePath ) ) return [];
        return parse( await readFile( filePath, 'utf-8' ) );
    }

    async writeCSV ( filename, data ) {
        const filePath = join( this.root, filename );
        await writeFile( filePath, stringify( data ), 'utf-8' );
    }

    async scanDir ( dirname, ending = '.csv' ) {
        const dirPath = join( this.root, dirname );
        if ( ! existsSync( dirPath ) ) return [];
        return readdirSync( dirPath ).filter( f => f.endsWith( '.csv' ) );
    }

}

const storage = new Storage();

module.exports = {
    Storage, storage,
    readJSON: storage.readJSON.bind( storage ),
    writeJSON: storage.writeJSON.bind( storage ),
    readCSV: storage.readCSV.bind( storage ),
    writeCSV: storage.writeCSV.bind( storage ),
    scanDir: storage.scanDir.bind( storage )
};
