const { runner } = require( '../lib/runner.cjs' );
const { readJSON, readCSV, scanDir, writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const round = ( val ) => Number( val.toFixed( 3 ) );
    const parseCSVToObjects = ( data ) => {
        if ( ! data || data.length < 2 ) return [];
        const [ headers, ...rows ] = data;
        return rows.map( r => Object.fromEntries(
            headers.map( ( h, i ) => [ h, r[ i ] ] )
        ) );
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

    // Contribution calculations
    const calcTotalContribs = ( data ) => data.reduce( ( s, r ) => s + parseInt( r.count || 0 ), 0 );
    const calcAvg = ( data ) => round( calcTotalContribs( data ) / data.length );

    const calcStdDev = ( data ) => {
        const counts = data.map( r => parseInt( r.count || 0 ) );
        const mean = counts.reduce( ( a, b ) => a + b, 0 ) / counts.length;
        const variance = counts.reduce( ( s, c ) => s + Math.pow( c - mean, 2 ), 0 ) / counts.length;
        return { mean, stdDev: round( Math.sqrt( variance ) ) };
    }

    const calcMedian = ( data ) => {
        const counts = data.map( r => parseInt( r.count || 0 ) ).sort( ( a, b ) => a - b );
        const mid = Math.floor( counts.length / 2 );
        return counts.length % 2 !== 0 ? counts[ mid ] : round(
            ( counts[ mid - 1 ] + counts[ mid ] ) / 2
        );
    }

    const totalContribs = calcTotalContribs( yearData );
    const avgPerDay = calcAvg( yearData );
    const { mean, stdDev } = calcStdDev( yearData );
    const median = calcMedian( yearData );

} );