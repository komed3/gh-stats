const { config } = require( '../lib/config.cjs' );
const { ghGraphql } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const publicRepos = [], privateRepos = [];
    let hasNextPage = true;
    let endCursor = null;

    while ( hasNextPage ) {
        const query = `
            query ( $first: Int!, $after: String, $login: String! ) {
                user( login: $login ) {
                    repositories( first: $first, after: $after, affiliations: OWNER ) {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            nameWithOwner
                            name
                            owner {
                                login
                            }
                            isPrivate
                            description
                            url
                            homepageUrl
                            pushedAt
                            createdAt
                            updatedAt
                            defaultBranchRef {
                                name
                            }
                            languages( first: 1 ) {
                                nodes {
                                    name
                                }
                            }
                            stargazers {
                                totalCount
                            }
                            forkCount
                            watchers {
                                totalCount
                            }
                            issues {
                                totalCount
                            }
                            pullRequests {
                                totalCount
                            }
                            diskUsage
                            visibility
                            licenseInfo {
                                name
                            }
                            repositoryTopics( first: 20 ) {
                                nodes {
                                    topic {
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const { user } = await ghGraphql( query, { first: 100, after: endCursor, login: config.username } );
        let { pageInfo, nodes } = user.repositories;

        // Sort by updated_at descending
        nodes = nodes.sort( ( a, b ) => new Date( b.updatedAt ) - new Date( a.updatedAt ) );

        for ( const repo of nodes ) {
            if ( ! config.privateRepos && repo.isPrivate ) continue;

            console.log( `... fetching repo: ${ repo.nameWithOwner } ...` );

            const data = {
                name: repo.name,
                full_name: repo.nameWithOwner,
                private: repo.isPrivate,
                owner: { login: repo.owner.login },
                description: repo.description,
                url: repo.url,
                homepage: repo.homepageUrl,
                pushed_at: repo.pushedAt,
                created_at: repo.createdAt,
                updated_at: repo.updatedAt,
                default_branch: repo.defaultBranchRef?.name || 'main',
                language: repo.languages.nodes[0]?.name || null,
                stargazers_count: repo.stargazers.totalCount,
                forks_count: repo.forkCount,
                watchers_count: repo.watchers.totalCount,
                open_issues_count: repo.issues.totalCount,
                size: repo.diskUsage,
                license: repo.licenseInfo?.name || null,
                topics: repo.repositoryTopics.nodes.map( t => t.topic.name )
            };

            if ( repo.isPrivate ) privateRepos.push( data );
            else publicRepos.push( data );
        }

        hasNextPage = pageInfo.hasNextPage;
        endCursor = pageInfo.endCursor;
    }

    publicRepos.length && await writeJSON( 'repos.json', publicRepos );
    privateRepos.length && await writeJSON( 'privateRepos.json', privateRepos );
} );
