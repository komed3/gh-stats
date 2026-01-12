const { Octokit } = require( 'octokit' );

class GitHubAPI {

    constructor () {
        this.client = new Octokit( { auth: process.env.GH_TOKEN } );
    }

    async request ( endpoint, options = {}, type = 'GET' ) {
        return await this.client.request( `${type} ${endpoint}`, options );
    }

    async paginate ( endpoint, options = {}, type = 'GET' ) {
        return await this.client.paginate( `${type} ${endpoint}`, options );
    }

    async iterate ( endpoint, options = {}, type = 'GET' ) {
        const res = [];
        for await ( const r of this.client.paginate.iterator(
            `${type} ${endpoint}`, options
        ) ) res.push( r );
        return res;
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
