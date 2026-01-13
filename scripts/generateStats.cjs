const { runner } = require( '../lib/runner.cjs' );
const { readJSON, readCSV, scanDir, writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const round = ( val ) => Number( val.toFixed( 3 ) );
    const parseCSVToObjects = ( data ) => {
        if ( ! data || data.length < 2 ) return [];
        const [ headers, ...rows ] = data;
        return rows.map( r => Object.fromEntries( headers.map( ( h, i ) => [ h, r[ i ] ] ) ) );
    }

    // Load data
    const profile = await readJSON( 'profile.json' );
    const repos = await readJSON( 'repos.json' ) || [];
    const languages = await readJSON( 'languages.json' ) || {};
    const contribs = parseCSVToObjects( await readCSV( 'contribs.csv' ) );
    const activity = await readJSON( 'activity.json' );
    const followers = await readJSON( 'follower.json' ) || [];
    const orgs = await readJSON( 'orgs.json' ) || [];
    const radar = await readJSON( 'radar.json' );

    // Scan year directory
    const currTime = new Date();
    const yearData = Object.fromEntries(
        await Promise.all( ( await scanDir('year' ) ).map( async file => [
            file.replace( '.csv', '' ), parseCSVToObjects( await readCSV( `year/${file}` )
                .filter( r => new Date( r.date ) <= currTime ) )
        ] ) )
    );

} );