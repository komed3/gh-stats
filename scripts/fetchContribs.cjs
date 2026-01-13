const { config } = require( '../lib/config.cjs' );
const { ghGraphql } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON, writeCSV } = require( '../lib/storage.cjs' );

runner( async () => {
    const username = config.username;
    const date = new Date();
    const to = date.toISOString();
    date.setFullYear( date.getFullYear() - 1 );
    const from = date.toISOString();

    console.log( `Fetching contributions for ${username} past last year` );
    const response = await ghGraphql( `query( $username: String!, $from: DateTime!, $to: DateTime! ) {
        user( login: $username ) { contributionsCollection( from: $from, to: $to ) {
            commit: totalCommitContributions
            issue: totalIssueContributions
            pr: totalPullRequestContributions
            rewiew: totalPullRequestReviewContributions
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
    }`, { username, from, to } );

    const collection = response.user.contributionsCollection;
    if ( ! collection ) throw new Error( 'No contributions collection found for user.' );

    const days = [ [ 'date', 'weekday', 'count', 'color', 'level' ] ];
    for ( const week of collection.contributionCalendar.weeks ) {
        for ( const day of week.contributionDays ) {
            days.push( [
                day.date, day.weekday, day.contributionCount, day.color,
                Math.max( [ 'NONE', 'FIRST', 'SECOND', 'THIRD', 'FOURTH' ].indexOf(
                    day.contributionLevel.split( '_' ).shift()
                ) ?? 0, 0 )
            ] );
        }
    }

    delete collection.contributionCalendar;
    writeCSV( 'contribs.csv', days );
    writeJSON( 'radar.json', collection );
} );
