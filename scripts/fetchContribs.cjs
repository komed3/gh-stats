const { config } = require( '../lib/config.cjs' );
const { ghGraphql } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON, writeCSV } = require( '../lib/storage.cjs' );

runner( async () => {
    const username = config.username;
    const date = new Date();
    date.setFullYear( date.getFullYear() - 1 );
    const from = date.toISOString();

    console.log( `Fetching contributions for ${username} past last year` );
    const res1 = await ghGraphql( `query( $username: String!, $from: DateTime! ) {
        user( login: $username ) { contributionsCollection( from: $from ) {
            commit: totalCommitContributions
            issue: totalIssueContributions
            pr: totalPullRequestContributions
            review: totalPullRequestReviewContributions
            repo: totalRepositoryContributions
            contributionCalendar {
                weeks { contributionDays {
                    color
                    contributionCount
                    contributionLevel
                    date
                    weekday
                } }
            }
        } }
    }`, { username, from } );

    const col = res1.user.contributionsCollection;
    if ( ! col ) throw new Error( 'No contributions collection found for user.' );

    const days = [ [ 'date', 'weekday', 'count', 'color', 'level' ] ];
    col.wd = new Array( 7 ).fill( 0 );

    for ( const week of col.contributionCalendar.weeks ) {
        for ( const day of week.contributionDays ) {
            col.wd[ day.weekday ] += day.contributionCount;
            days.push( [
                day.date, day.weekday, day.contributionCount, day.color,
                Math.max( [ 'NONE', 'FIRST', 'SECOND', 'THIRD', 'FOURTH' ].indexOf(
                    day.contributionLevel.split( '_' ).shift()
                ) ?? 0, 0 )
            ] );
        }
    }

    delete col.contributionCalendar;
    col.total = col.commit + col.issue + col.pr + col.review;
    col.wdPct = col.wd.map( d => Number( ( d / col.total * 100 ).toFixed( 3 ) ) );

    writeCSV( 'contribs.csv', days );
    writeJSON( 'radar.json', col );
} );
