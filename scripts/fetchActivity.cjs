const { config } = require( '../lib/config.cjs' );
const { ghGraphql } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const username = config.username;
    const date = new Date();
    date.setFullYear( date.getFullYear() - 1 );
    const from = date.toISOString();

    console.log( `Fetching contributions for ${username} based on hours` );
    const query = `query( $username: String!, $from: GitTimestamp!, $repoCursor: String! ) {
        user( login: $username ) { repositories(
            first: 50, after: $repoCursor, isFork: false,
            ownerAffiliations: [ OWNER, ORGANIZATION_MEMBER ],
            orderBy: { field: PUSHED_AT, direction: DESC }
        ) {
            pageInfo {
                hasNextPage
                endCursor
            }
            nodes { defaultBranchRef { target { ... on Commit {
                history( first: 100, since: $from ) { nodes { committedDate } }
            } } } }
        } }
    }`;

    let repoCursor = '';
    const repos = [];

    do {
        console.log( `... fetching repositories ...` );
        const res = await ghGraphql( query, { username, from, repoCursor } );
        const page = res.user.repositories;
        repos.push( ...page.nodes );
        repoCursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : '';
    } while ( repoCursor.length );

    if ( ! repos ) throw new Error( 'No repository collection found for user.' );

    const weekdays = new Array( 7 ).fill( 0 );
    const hours = new Array( 24 ).fill( 0 );
    const heatmap = new Array( 7 ).fill( new Array( 24 ).fill( 0 ) );
    const periods = { morning: 0, daytime: 0, evening: 0, night: 0 };

    for ( const repo of repos ) {
        const history = repo?.defaultBranchRef?.target?.history?.nodes;
        if ( ! history ) continue;

        for ( const commit of history ) {
            const date = new Date( commit.committedDate );
            const wd = date.getDay();
            const hour = date.getUTCHours();

            weekdays[ wd ]++;
            hours[ hour ]++;
            heatmap[ wd ][ hour ]++;

            if ( hour >= 6 && hour <= 11 ) periods.morning++;
            else if ( hour >= 12 && hour <= 17 ) periods.daytime++;
            else if ( hour >= 18 && hour <= 22 ) periods.evening++;
            else periods.night++;
        }
    }

    const total = weekdays.reduce( ( a, b ) => a + b, 0 );
    const weekdaysPct = weekdays.map( d => Number( ( d / total * 100 ).toFixed( 3 ) ) );
    const hoursPct = hours.map( h => Number( ( h / total * 100 ).toFixed( 3 ) ) );
    const periodsPct = Object.fromEntries( Object.entries( periods ).map(
        ( [ k, v ] ) => [ k, Number( ( v / total * 100 ).toFixed( 3 ) ) ]
    ) );

    const heatmapPct = heatmap.map( wd => {
        const wdTotal = wd.reduce( ( a, b ) => a + b, 0 );
        return wd.map( h => Number( ( h / wdTotal * 100 ).toFixed( 3 ) ) );
    } );

    writeJSON( 'activity.json', {
        weekdays, weekdaysPct, hours, hoursPct, heatmap, heatmapPct,
        periods, periodsPct
    } );
} );
