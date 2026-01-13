const { runner } = require( '../lib/runner.cjs' );
const { readJSON, readCSV, scanDir, writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const r3 = ( v ) => Number( v.toFixed( 3 ) );
    const sortedCounts = ( data ) => data.map( r => r.count ).sort( ( a, b ) => a - b );

    // Load data
    const profile = await readJSON( 'profile.json' );
    const repos = await readJSON( 'repos.json' ) || [];
    const languages = await readJSON( 'languages.json' ) || {};
    const contribs = await readCSV( 'contribs.csv' );
    const activity = await readJSON( 'activity.json' );
    const followers = await readJSON( 'follower.json' ) || [];
    const orgs = await readJSON( 'orgs.json' ) || [];
    const radar = await readJSON( 'radar.json' );

    // Scan year directory
    const createdAt = new Date( profile.created_at ), currTime = new Date();
    const yearData = Object.fromEntries(
        await Promise.all( ( await scanDir( 'year', '.csv' ) ).map( async file => [
            file.replace( '.csv', '' ), ( await readCSV( `year/${file}` ) )
                .filter( r => ( d = new Date( r.date ) ) && createdAt <= d && d <= currTime )
        ] ) )
    );

    const years = Object.keys( yearData ).sort();
    const filteredData = years.flatMap( y => yearData[ y ] );
    const reversedData = structuredClone( filteredData ).reverse();

    // Contribution calculations
    const calcTotal = ( data ) => data.reduce( ( s, r ) => s + r.count, 0 );
    const calcAvg = ( data ) => r3( calcTotal( data ) / data.length );

    const calcStdDev = ( data ) => {
        const counts = data.map( r => r.count );
        const mean = counts.reduce( ( a, b ) => a + b, 0 ) / counts.length;
        const variance = counts.reduce( ( s, c ) => s + Math.pow( c - mean, 2 ), 0 ) / counts.length;
        return r3( Math.sqrt( variance ) );
    };

    const calcMedian = ( data ) => {
        const counts = sortedCounts( data );
        const mid = Math.floor( counts.length / 2 );
        return counts.length % 2 !== 0 ? counts[ mid ] : r3(
            ( counts[ mid - 1 ] + counts[ mid ] ) / 2
        );
    };

    const calcStreak = ( data ) => data.reduce( ( acc, { date, count } ) => {
        acc.current.days = count > 0 ? acc.current.days + 1 : 0;
        acc.current.end = count > 0 ? date : acc.current.end;
        acc.current.start = acc.current.days === 1 ? date : acc.current.start;
        acc.longest = acc.current.days > acc.longest.days ? {
            days: acc.current.days, start: acc.current.start, end: acc.current.end
        } : acc.longest;
        return acc;
    }, {
        longest: { days: 0, start: undefined, end: undefined },
        current: { days: 0, start: undefined, end: undefined }
    } );

    const findExtrema = ( data ) => data.reduce( ( acc, { count, date } ) => {
        if ( count > acc.max.count ) acc.max = { date, count };
        if ( count < acc.min.count ) acc.min = { date, count };
        return acc;
    }, {
        max: { date: '', count: 0 },
        min: { date: '', count: Infinity }
    } );

    const totalContribs = calcTotal( filteredData );
    const avgContribsPerDay = calcAvg( filteredData );
    const contribsStdDev = calcStdDev( filteredData );
    const contribsMedian = calcMedian( filteredData );
    const { max: busiestDay, min: leastActiveDay } = findExtrema( reversedData );
    const { longest: longestStreak, current: currentStreak } = calcStreak( filteredData );

    // Yearly contribution
    const yearlyTotals = Object.fromEntries( years.map( y => [ y, calcTotal( yearData[ y ] ) ] ) );
    const yearlyAvgs = Object.fromEntries( years.map( y => [ y, calcAvg( yearData[ y ] ) ] ) );

    // Percentiles
    const counts = sortedCounts( filteredData );
    const contribPercentiles = Object.fromEntries( [ 50, 75, 90, 95, 99 ].map(
        p => [ `p${p}`, counts[ Math.floor( p / 100 * ( counts.length - 1 ) ) ] ]
    ) );

    // Compile stats
    await writeJSON( 'stats.json', {
        totalContribs, avgContribsPerDay, contribsMedian, contribsStdDev, yearlyTotals, yearlyAvgs,
        longestStreak, currentStreak, busiestDay, leastActiveDay, contribPercentiles
    } );

} );
