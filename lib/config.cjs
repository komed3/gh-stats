const { readFileSync } = require( 'node:fs' );
const { join } = require( 'node:path' );
const { parse } = require( 'yaml' );

function loadConfig () {
    const configPath = join( __dirname, '..', 'config.yml' );
    const fileContents = readFileSync( configPath, 'utf8' );
    const config = parse( fileContents );
    return config;
}

module.exports = { loadConfig, config: loadConfig() };
