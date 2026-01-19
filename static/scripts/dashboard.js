document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'profile.json' ).then( profile => {
        let s = '.profile-', v;

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
        $( s + 'repos b' ).text( fNumber( stats.totalPublicRepos + stats.totalPrivateRepos ) );
        $( s + 'stars b' ).text( fNumber( stats.totalStars ) );
        $( s + 'hours b' ).text( fNumber( stats.estimatedCodingHours, 1 ) );

        languages( $( '.dashboard-languages' ).el, stats.languageSkills );
    } ).catch( console.error );

    loadData( 'follower.json' ).then( data => {
        const { el: container } = $( '.dashboard-followers--grid' );
        const followerList = Array.isArray( data ) ? data : data.followers;
        const totalFollowers = Array.isArray( data ) ? null : data.totalFollowers;

        let displayedCount = 0;
        const displayLimit = 36;

        const renderFollowers = ( limit ) => {
            for ( let i = displayedCount; i < Math.min( followerList.length, limit ); i++ ) {
                const d = followerList[ i ];
                const f = el( 'a', { className: 'item', href: d.url, target: '_blank' } );
                f.innerHTML = `
                    <img src="${d.avatar_url}" alt="GitHub Profile Avatar" />
                    <div class="name">${ d.name || d.login }</div>
                    <div class="login">@${d.login}</div>
                    ${ d.location || d.company || d.followers ? `
                        <div class="info">
                            ${ d.followers ? `<span>${ fNumber( d.followers ) } followers</span>` : '' }
                            ${ d.location ? `<span><i class="fa fa-map-marker" aria-hidden="true"></i> ${d.location}</span>` : '' }
                            ${ d.company ? `<span><i class="fa fa-building" aria-hidden="true"></i> ${d.company}</span>` : '' }
                        </div>` : '' }
                    ${ d.bio ? `<div class="bio">${d.bio}</div>` : '' }
                `;
                container.append( f );
            }

            displayedCount = Math.min( followerList.length, limit );
        };

        renderFollowers( displayLimit );

        if ( totalFollowers && totalFollowers > displayLimit ) {
            const wrapper = el( 'div', { className: 'dashboard-followers--more' } );
            const btn = el( 'a', { className: 'btn', href: '#', textContent: `Load More` } );
            btn.addEventListener( 'click', ( e ) => e.preventDefault() && renderFollowers( followerList.length ) );
            wrapper.append( btn );
            container.parentElement.append( wrapper );
        }
    } ).catch( console.error );

    loadData( 'contribs.csv' ).then( contribs => {
        $( '.dashboard-contribs--calendar .chart' ).el.appendChild( calendar( contribs ) );
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

    loadData( 'activity.json' ).then( ( { weekdaysPct, periodsPct } ) => {
        weekdayDistribution( $( '.dashboard-activity--weekday .chart' ).el, weekdaysPct );
        periodDistribution( $( '.dashboard-activity--period .chart' ).el, periodsPct );
    } ).catch( console.error );
} );
