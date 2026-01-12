const { Octokit } = require( '@octokit' );

function ghClient () {
    return new Octokit( { auth: process.env.GH_TOKEN } );
}

function ghRequest ( endpoint, options = {} ) {
    const client = ghClient();
    return client.request( endpoint, options );
}

module.exports = { ghClient, ghRequest };