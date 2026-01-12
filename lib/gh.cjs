const { Octokit } = require( 'octokit' );

class GitHubAPI {

    constructor () {
        this.client = new Octokit( { auth: process.env.GH_TOKEN } );
    }

    async request ( endpoint, options = {}, type = 'GET' ) {
        return await this.client.request( `${type} ${endpoint}`, options );
    }

    async graphql ( query, variables = {} ) {
        return await this.client.graphql( query, variables );
    }

}

const ghInstance = new GitHubAPI();

module.exports = {
    ghClient: GitHubAPI, ghInstance,
    ghRequest: ghInstance.request.bind( ghInstance ),
    ghGraphql: ghInstance.graphql.bind( ghInstance )
};
