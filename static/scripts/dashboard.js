document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'profile.json' ).then( profile => {
        let s = '.dashboard-profile--', v;

        $( s + 'link' ).href( profile.html_url );
        $( s + 'avatar' ).src( profile.avatar_url );
        $( s + 'name' ).text( profile.name || profile.login );
        $( s + 'login' ).text( '@' + profile.login );
        $( s + 'bio' ).text( profile.bio || '' );
        $( s + 'joined span' ).text( `Joined at ${ fDate( profile.created_at ) }` );

        if ( v = profile.location ) $( s + 'location span' ).text( v );
        else $( s + 'location' ).hide();

        if ( v = profile.blog ) $( s + 'blog a' ).link( v );
        else $( s + 'blog' ).hide();

        if ( v = profile.email ) $( s + 'email a' ).link( 'mailto:' + v, v );
        else $( s + 'email' ).hide();

        if ( v = profile.twitter_username ) $( s + 'twitter a' ).link( 'https://twitter.com/' + v, '@' + v );
        else $( s + 'twitter' ).hide();
    } ).catch( console.error );

    loadData( 'stats.json' ).then( stats => {
        let s = '.dashboard-stats--';

        $( s + 'contribs b' ).text( fNumber( stats.totalContribs, 1 ) );
        $( s + 'streak b' ).text( fNumber( stats.currentStreak?.days ) );
        $( s + 'level b' ).text( stats.ghLevel );
        $( s + 'reach b' ).text( fNumber( stats.socialReach ) );
        $( s + 'repos b' ).text( fNumber( stats.totalPublicRepos ) );
        $( s + 'stars b' ).text( fNumber( stats.totalStars ) );
        $( s + 'hours b' ).text( fNumber( stats.estimatedCodingHours, 1 ) );
    } ).catch( console.error );

    loadData( 'follower.json' ).then( follower => {
        const { el: container } = $( '.dashboard-followers--grid' );
        for ( const { login, html_url, avatar_url } of follower.slice( 0, 36 ) ) {
            const f = el( 'a', { className: 'item', href: html_url } );
            f.setAttribute( 'target', '_blank' );
            f.innerHTML += `<img src="${avatar_url}" alt="GitHub Profile Avatar" />`;
            f.innerHTML += `<span>${login}</span>`;
            container.append( f );
        }
    } ).catch( console.error );

    loadData( 'contribs.csv' ).then( contribs => {
        const { el } = $( '.dashboard-contribs--activity .chart' );
        el.appendChild( calendar( contribs ) );
    } ).catch( console.error );

    loadData( 'profile.json', 'radar.json' ).then( ( [ profile, radar ] ) => {
        contribRadar( $( '.dashboard-contribs--radar .chart' ).el, radar );

        $( '.dashboard-contribs--info' ).html(
            `GitHub user <b>@${profile.login}</b> made <b>${ fFullNum( radar.total ) }</b> ` +
            `contributions across <b>${ fFullNum( radar.repo ) }</b> public repositories, ` +
            `among others, last year. <br /> Contributions break down as follows: ` +
            `<b>${ fPct( radar.commit / radar.total ) }</b> commits, ` +
            `<b>${ fPct( radar.issue / radar.total ) }</b> issues, ` +
            `<b>${ fPct( radar.pr / radar.total ) }</b> pull requests, ` +
            `<b>${ fPct( radar.review / radar.total ) }</b> code reviews.`
        );
    } ).catch( console.error );
} );
