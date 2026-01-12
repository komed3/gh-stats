async function fetchProfile () {
    //
}

if ( require.main === module ) fetchProfile()
    .then( () => console.log( 'Profile fetched successfully.' ) )
    .catch( ( err ) => console.error( 'Error fetching profile:', err ) );

module.exports = fetchProfile;
