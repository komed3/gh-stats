const { config } = require('../lib/config.cjs');
const { ghRequest } = require( '../lib/gh.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

async function fetchProfile () {
    const profile = await ghRequest( `/users/${config.username}` );
    writeJSON( 'profile.json', profile );
}

if ( require.main === module ) fetchProfile()
    .then( () => console.log( 'Profile fetched successfully.' ) )
    .catch( ( err ) => console.error( 'Error fetching profile:', err ) );

module.exports = fetchProfile;
