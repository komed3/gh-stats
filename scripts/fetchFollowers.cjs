const { ghGraphql } = require( '../lib/gh.cjs' );
const { config } = require( '../lib/config.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const followers = [];
    let hasNextPage = true;
    let endCursor = null;
    let totalFollowers = 0;

    while ( hasNextPage ) {
        const query = `
            query ( $first: Int!, $after: String, $login: String! ) {
                user( login: $login ) {
                    followers( first: $first, after: $after ) {
                        totalCount
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            login
                            name
                            avatarUrl
                            url
                            bio
                            company
                            location
                            email
                            followers {
                                totalCount
                            }
                            following {
                                totalCount
                            }
                            repositories {
                                totalCount
                            }
                        }
                    }
                }
            }
        `;

        const { user } = await ghGraphql( query, { first: 100, after: endCursor, login: config.username } );
        const { pageInfo, nodes } = user.followers;
        totalFollowers = user.followers.totalCount;

        for ( const follower of nodes ) {
            const data = {
                login: follower.login,
                id: follower.login,
                avatar_url: follower.avatarUrl,
                url: follower.url,
                name: follower.name,
                bio: follower.bio,
                company: follower.company,
                location: follower.location,
                email: follower.email,
                followers: follower.followers.totalCount,
                following: follower.following.totalCount,
                public_repos: follower.repositories.totalCount
            };

            followers.push( data );
        }

        hasNextPage = pageInfo.hasNextPage;
        endCursor = pageInfo.endCursor;
    }

    await writeJSON( 'follower.json', { followers, totalFollowers } );
} );
