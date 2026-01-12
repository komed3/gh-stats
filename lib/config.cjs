const { readFile } = require( 'fs' ).promises;
const { join } = require( 'path' );
const { parse } = require( 'yaml' );

async function loadConfig () {
    const configPath = join( __dirname, '..', 'config.yaml' );
    const fileContents = await readFile( configPath, 'utf8' );
    const config = parse( fileContents );
    return config;
}

module.exports = loadConfig;
