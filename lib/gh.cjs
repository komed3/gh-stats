const { Octokit } = require( 'octokit' );

class ghClient {

    client;

    constructor () {
        this.client = new Octokit( { auth: process.env.GH_TOKEN } );
    }

    request ( endpoint, options = {}, type = 'GET' ) {
        return this.client.request( `${type} ${endpoint}`, options );
    }

    graphql ( query, variables = {} ) {
        return this.client.graphql( query, variables );
    }

}

const ghInstance = new ghClient();

module.exports = {
    ghClient, ghInstance,
    ghRequest: ghInstance.request.bind( ghInstance ),
    ghGraphql: ghInstance.graphql.bind( ghInstance )
};
