import { config } from './config.cjs';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';

export class Storage {

    root;

    constructor () {
        this.root = join( __dirname, '..', config.storage );
        if ( ! existsSync( this.root ) ) {
            mkdirSync( this.root, { recursive: true } );
        }
    }

}

const storage = new Storage();

module.exports = {
    Storage, storage
}
