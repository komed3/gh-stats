const { ghRequest } = require( '../lib/gh.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

async function fetchProfile () {
    const { data } = await ghRequest( `/user` );
    await writeJSON( 'profile.json', data );
}

if ( require.main === module ) fetchProfile()
    .then( () => console.log( 'Profile fetched successfully.' ) )
    .catch( ( err ) => console.error( 'Error fetching profile:', err ) );

module.exports = fetchProfile;
