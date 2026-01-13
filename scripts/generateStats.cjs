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
    const calcTotal = ( data ) => data.reduce( ( s, r ) => s + parseInt( r.count || 0 ), 0 );
    const calcAvg = ( data ) => round( calcTotal( data ) / data.length );

    const calcStdDev = ( data ) => {
        const counts = data.map( r => parseInt( r.count || 0 ) );
        const mean = counts.reduce( ( a, b ) => a + b, 0 ) / counts.length;
        const variance = counts.reduce( ( s, c ) => s + Math.pow( c - mean, 2 ), 0 ) / counts.length;
        return { mean, stdDev: round( Math.sqrt( variance ) ) };
    };

    const calcMedian = ( data ) => {
        const counts = data.map( r => parseInt( r.count || 0 ) ).sort( ( a, b ) => a - b );
        const mid = Math.floor( counts.length / 2 );
        return counts.length % 2 !== 0 ? counts[ mid ] : round(
            ( counts[ mid - 1 ] + counts[ mid ] ) / 2
        );
    };

    const calcStreak = ( data ) => data.reduce( ( acc, { count } ) => {
        count > 0 ? acc.current++ : ( acc.current = 0 );
        acc.longest = Math.max( acc.longest, acc.current );
        return acc;
    }, { longest: 0, current: 0 } );

    const findExtrema = ( data ) => data.reduce( ( acc, { count, date } ) => {
        if ( count > acc.max.count ) acc.max = { date, count };
        if ( count < acc.min.count ) acc.min = { date, count };
        return acc;
    }, {
        max: { date: '', count: 0 },
        min: { date: '', count: Infinity }
    } );

    const totalContribs = calcTotal( yearData );
    const avgContribsPerDay = calcAvg( yearData );
    const { mean: contribsMean, stdDev: contribsStdDev } = calcStdDev( yearData );
    const contribsMedian = calcMedian( yearData );
    const { max: busiestDay, min: leastActiveDay } = findExtrema( yearData );
    const { longest: longestStreak, current: currentStreak } = calcStreak( yearData );

    // Yearly contribution
    const years = Object.keys( yearData ).sort();
    const yearlyTotals = Object.fromEntries( years.map( y => [ y, calcTotal( yearData[ y ] ) ] ) );
    const yearlyAvgs = Object.fromEntries( years.map( y => [ y, calcAvg( yearData[ y ] ) ] ) );

    // Compile stats
    await writeJSON( 'stats.json', {
        totalContribs, avgContribsPerDay, contribsMedian, contribsMean, contribsStdDev,
        yearlyTotals, yearlyAvgs, longestStreak, currentStreak, busiestDay, leastActiveDay
    } );

} );