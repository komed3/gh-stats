const { Octokit } = require( '@octokit' );

function ghClient () {
    return new Octokit( { auth: process.env.GH_TOKEN } );
}

async function ghRequest ( type = 'GET', endpoint, options = {} ) {
    const client = ghClient();
    return await client.request( `${type} ${endpoint}`, options );
}

async function ghOpenQL ( query, variables = {} ) {
    const client = ghClient();
    return await client.graphql( query, variables );
}

module.exports = { ghClient, ghRequest, ghOpenQL };