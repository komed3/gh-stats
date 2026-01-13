const { config } = require( '../lib/config.cjs' );
const { ghGraphql } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const username = config.username;

    const response = await ghGraphql( `query( $username: String! ) {
        user( login: $username ) { contributionsCollection {
            commit: totalCommitContributions
            issue: totalIssueContributions
            pr: totalPullRequestContributions
            review: totalPullRequestReviewContributions
        } }
    }`, { username } );

    const radar = response.user.contributionsCollection;
    if ( ! radar ) throw new Error( 'No contributions data found for user.' );

    await writeJSON( 'radar.json', radar );
} );
