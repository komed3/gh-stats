const { ghRequest } = require( '../lib/gh.cjs' );

async function fetchProfile () {
    const profile = await ghRequest( '/user' );
    console.log( profile.data );
}

if ( require.main === module ) fetchProfile()
    .then( () => console.log( 'Profile fetched successfully.' ) )
    .catch( ( err ) => console.error( 'Error fetching profile:', err ) );

module.exports = fetchProfile;
