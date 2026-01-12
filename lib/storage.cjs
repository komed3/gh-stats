import { config } from './config.cjs';
import { join } from 'path';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';

export class Storage {

    root;

    constructor () {
        this.root = join( __dirname, '..', config.storage );
        mkdirSync( this.root, { recursive: true } );
    }

    readJSON ( filename ) {
        const filePath = join( this.root, filename );
        if ( ! existsSync( filePath ) ) return null;
        return JSON.parse( readFileSync( filePath, 'utf-8' ) );
    }

    writeJSON ( filename, data ) {
        const filePath = join( this.root, filename );
        const jsonData = JSON.stringify( data, null, config.compression ? undefined : 2 );
        writeFileSync( filePath, jsonData, 'utf-8' );
    }

}

const storage = new Storage();

module.exports = {
    Storage, storage
}
