const { readFileSync } = require( 'fs' );
const { join } = require( 'path' );
const { parse } = require( 'yaml' );

function loadConfig () {
    const configPath = join( __dirname, '..', 'config.yml' );
    const fileContents = readFileSync( configPath, 'utf8' );
    const config = parse( fileContents );
    return config;
}

module.exports = { loadConfig, config: loadConfig() };
