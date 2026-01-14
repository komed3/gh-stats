document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'profile.json' ).then( data => {
        let s = '.dashboard-profile--', v;

        $( s + 'link' ).href( data.html_url );
        $( s + 'avatar' ).src( data.avatar_url );
        $( s + 'name' ).text( data.name || data.login );
        $( s + 'login' ).text( '@' + data.login );
        $( s + 'bio' ).text( data.bio || '' );

        if ( v = data.location ) $( s + 'location span' ).text( v );
        else $( s + 'location' ).hide();

        if ( v = data.blog ) $( s + 'blog a' ).link( v );
        else $( s + 'blog' ).hide();

        if ( v = data.email ) $( s + 'email a' ).link( 'mailto:' + v, v );
        else $( s + 'email' ).hide();

        if ( v = data.twitter_username ) $( s + 'twitter a' ).link( 'https://twitter.com/' + v, '@' + v );
        else $( s + 'twitter' ).hide();
    } ).catch( console.error );

    loadData( 'stats.json' ).then( data => {
        let s = '.dashboard-stats--';

        $( s + 'contribs b' ).text( fNumber( data.totalContribs, 1 ) );
        $( s + 'streak b' ).text( fNumber( data.currentStreak?.days ) );
        $( s + 'level b' ).text( data.ghLevel );
        $( s + 'reach b' ).text( fNumber( data.socialReach ) );
        $( s + 'repos b' ).text( fNumber( data.totalPublicRepos ) );
        $( s + 'stars b' ).text( fNumber( data.totalStars ) );
        $( s + 'value b' ).text( fNumber( data.estimatedCodingValueUSD, 0, {
            style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
        } ) );
    } ).catch( console.error );

    loadData( 'follower.json' ).then( data => {
        const { el: container } = $( '.dashboard-followers--grid' );
        for ( const { login, html_url, avatar_url } of data.slice( 0, 36 ) ) {
            const el = document.createElement( 'a' );
            el.href = html_url;
            el.setAttribute( 'target', '_blank' );
            el.classList.add( 'item' );
            el.innerHTML += `<img src="${avatar_url}" alt="GitHub Profile Avatar" />`;
            el.innerHTML += `<span>${login}</span>`;
            container.append( el );
        }
    } ).catch( console.error );
} );
