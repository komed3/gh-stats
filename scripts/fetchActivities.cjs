const { config } = require( '../lib/config.cjs' );
const { ghGraphql } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeCSV } = require( '../lib/storage.cjs' );

runner( async () => {
    const year = parseInt( process.argv[ 2 ], 10 );
    if ( isNaN( year ) || year < 2000 || year > new Date().getFullYear() ) throw new Error(
        'Please provide a valid year as argument.'
    );

    const from = new Date( year, 0, 1 ).toISOString();
    const to = new Date( year, 11, 31, 23, 59, 59 ).toISOString();
    const username = config.username;

    console.log( `Fetching detailed activities for ${username} in ${year}` );
    const response = await ghGraphql( `query( $username: String!, $from: DateTime!, $to: DateTime! ) {
        user( login: $username ) { contributionsCollection( from: $from, to: $to ) {
            contributionCalendar { weeks { contributionDays {
                color
                contributionCount
                contributionLevel
                date
                weekday
            } } }
        } }
    }`, { username, from, to } );

    const collection = response.user.contributionsCollection;
    if ( ! collection ) throw new Error( 'No contributions collection found for user.' );

    const days = [ [ 'date', 'weekday', 'count', 'color', 'level' ] ];
    for ( const week of collection.contributionCalendar.weeks ) {
        for ( const day of week.contributionDays ) {
            days.push( [
                day.date, day.weekday, day.contributionCount, day.color,
                Math.min( [ 'NONE', 'FIRST', 'SECOND', 'THIRD', 'FOURTH' ].indexOf(
                    day.contributionLevel.split( '_' ).shift()
                ) ?? 0, 0 )
            ] );
        }
    }

    console.log( `Fetched ${days.length} days of contributions.` );
    writeCSV( `activity_${year}.csv`, days );
} );
