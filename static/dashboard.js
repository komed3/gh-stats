document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'profile.json' ).then( data => {
        $( '.dashboard-profile--link' ).href( data.html_url );
        $( '.dashboard-profile--avatar' ).src( data.avatar_url );
        $( '.dashboard-profile--name' ).text( data.name || data.login );
        $( '.dashboard-profile--login' ).text( '@' + data.login );
        $( '.dashboard-profile--bio' ).text( data.bio || '' );

        let v;
        if ( v = data.location ) $( '.dashboard-profile--location span' ).text( v );
        else $( '.dashboard-profile--location' ).hide();

        if ( v = data.blog ) $( '.dashboard-profile--blog a' ).link( v );
        else $( '.dashboard-profile--blog' ).hide();

        if ( v = data.email ) $( '.dashboard-profile--email a' ).link( 'mailto:' + v, v );
        else $( '.dashboard-profile--email' ).hide();

        if ( v = data.twitter_username ) $( '.dashboard-profile--twitter a' ).link( 'https://twitter.com/' + v, '@' + v );
        else $( '.dashboard-profile--twitter' ).hide();
  } ).catch( console.error );
} );
