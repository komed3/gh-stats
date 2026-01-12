const { Octokit } = require( 'octokit' );

class GitHubAPI {

    constructor () {
        this.client = new Octokit( { auth: process.env.GH_TOKEN } );
    }

    async request ( endpoint, options = {}, type = 'GET' ) {
        return await this.client.request( `${type} ${endpoint}`, options );
    }

    async paginate ( endpoint, options = {} ) {
        return await this.client.paginate( endpoint, options );
    }

    async iterate ( endpoint, options = {} ) {
        for await ( const res of this.client.paginate.iterator( endpoint, options ) ) {
            yield res;
        }
    }

    async graphql ( query, variables = {} ) {
        return await this.client.graphql( query, variables );
    }

}

const ghInstance = new GitHubAPI();

module.exports = {
    ghClient: GitHubAPI, ghInstance,
    ghRequest: ghInstance.request.bind( ghInstance ),
    ghPaginate: ghInstance.paginate.bind( ghInstance ),
    ghIterate: ghInstance.iterate.bind( ghInstance ),
    ghGraphql: ghInstance.graphql.bind( ghInstance )
};
