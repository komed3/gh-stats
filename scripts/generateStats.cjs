const { calculateRank } = require( '../lib/rank.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { readJSON, readCSV, scanDir, writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const r3 = ( v ) => Number( v.toFixed( 3 ) );
    const sortedCounts = ( data ) => data.map( r => r.count ).sort( ( a, b ) => a - b );

    // Load data
    const profile = await readJSON( 'profile.json' );
    const repos = await readJSON( 'repos.json' ) || [];
    const languages = await readJSON( 'languages.json' ) || {};
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
    const avgContribsPerYear = avgContribsPerDay * 365.25;
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

    // Trend calculations
    const linearRegression = ( data ) => {
        const { n, x, y, sumX, sumY } = Object.entries( data ).reduce( ( acc, [ y, t ] ) => {
            acc.x.push( +y ); acc.y.push( +t ); acc.n++; acc.sumX += +y; acc.sumY += +t;
            return acc;
        }, { x: [], y: [], n: 0, sumX: 0, sumY: 0 } );

        const sumXY = x.reduce( ( s, xi, i ) => s + xi * y[ i ], 0 );
        const sumXX = x.reduce( ( s, xi ) => s + xi * xi, 0 );

        return r3( ( n * sumXY - sumX * sumY ) / ( n * sumXX - sumX * sumX ) );
    };

    const commitTrend = linearRegression( yearlyTotals );

    // Language calculations
    const codeExtrema = ( data ) => data.reduce( ( acc, [ lang, size ] ) => {
        if ( size > acc.max.size ) acc.max = { lang, size };
        if ( size < acc.min.size ) acc.min = { lang, size };
        return acc;
    }, {
        max: { lang: '', size: 0 },
        min: { lang: '', size: Infinity }
    } );

    const skillLevel = ( size ) => size > 1e6 ? 'Expert' : size > 25e4 ? 'Advanced' :
        size > 5e4 ? 'Intermediate' : 'Beginner';

    const skills = ( data, total, max ) => Object.fromEntries( data.map( ( [ lang, size ] ) => [
        lang, { level: skillLevel( size ), pct: r3( size / total ), weight: r3( size / max ) }
    ] ) );

    const diversity = ( data, total ) => r3( -data.reduce( ( s, [ , size ] ) => {
        const p = size / total; return s + p * Math.log2( p );
    }, 0 ) );

    const langEntries = Object.entries( languages.langs );
    const numLanguages = langEntries.length;
    const totalCodeSize = langEntries.reduce( ( s, [, size ] ) => s + size, 0 );
    const { max: mostUsedLang, min: leastUsedLang } = codeExtrema( langEntries );
    const maxLangSize = mostUsedLang.size;
    const languageSkills = skills( langEntries, totalCodeSize, maxLangSize );
    const languageDiversity = diversity( langEntries, totalCodeSize );

    // Activity
    const arrMaxMin = ( data ) => ( {
        max: data.indexOf( Math.max( ...data ) ),
        min: data.indexOf( Math.min( ...data ) )
    } );

    const { max: mostActiveWeekday, min: leastActiveWeekday } = arrMaxMin( activity.weekdays );
    const { max: mostActiveHour, min: leastActiveHour } = arrMaxMin( activity.hours );
    const { period: mostActivePeriod } = Object.entries( activity.periods ).reduce(
        ( acc, [ period, count ] ) => count > acc.count ? { period, count } : acc,
        { period: '', count: 0 }
    );

    // Radar
    const { total: totalActivities, commit, issue, pr, review, repo } = radar;
    const activityBreakdown = { commit, issue, pr, review, repo };
    const { type: mostCommonActivity } = Object.entries( activityBreakdown ).reduce(
        ( acc, [ type, count ] ) => count > acc.count ? { type, count } : acc,
        { type: '', count: 0 }
    );

    // Repos
    const totalRepoSize = repos.reduce( ( s, repo ) => s + ( repo.size || 0 ), 0 );
    const forkedRepos = repos.filter( repo => repo.fork ).length;
    const archivedRepos = repos.filter( repo => repo.archived ).length;

    // Profile
    const totalPublicRepos = profile.public_repos || 0;
    const totalPrivateRepos = profile.total_private_repos || 0;
    const totalGists = profile.public_gists || 0;
    const totalFollowers = profile.followers || 0;
    const totalFollowing = profile.following || 0;
    const accountAge = Math.floor( ( currTime - createdAt ) / 86.4e6 );
    const twoFactorEnabled = profile.two_factor_authentication || false;
    const hasBlog = !! profile.blog;
    const hasLocation = !! profile.location;
    const hasEmail = !! profile.email;
    const bioLength = profile.bio ? profile.bio.length : 0;
    const planName = profile.plan?.name || 'unknown';
    const diskUsage = profile.disk_usage || 0;
    const spaceUsed = profile.plan?.space || 0;

    // Health
    const accountHealth = r3(
        ( totalPublicRepos ? 0.2 : 0 ) + Math.min( 0.2, accountAge / 3650 ) +
        ( ( +hasBlog + +hasLocation + +hasEmail + +( bioLength > 0 ) ) / 10 ) +
        ( twoFactorEnabled ? 0.2 : 0 )
    );

    // Social
    const numFollowers = followers.length;
    const numOrgs = orgs.length;
    const totalOrgFollowers = orgs.reduce( ( s, org ) => s + ( org.followers || 0 ), 0 );
    const socialReach = numFollowers + totalOrgFollowers;
    const totalStars = repos.reduce( ( s, r ) => s + ( r.stargazers_count || 0 ), 0 );
    const totalWatchers = repos.reduce( ( s, r ) => s + ( r.watchers_count || 0 ), 0 );

    // Projects
    const projectMaturity = r3( ( totalPublicRepos + totalPrivateRepos ) / accountAge );
    const codeProductivity = r3( totalCodeSize / totalContribs );
    const contributionDensity = r3( totalContribs / accountAge );
    const activityConsistency = r3( contribsStdDev / avgContribsPerDay );

    // Meta
    const powerLevel = totalStars * 10 + totalContribs + socialReach * 5;
    const { rank, level: ghLevel, percentile } = calculateRank(
        commit, pr, issue, review, totalStars, socialReach
    );

    const estimatedCodingHours = r3( totalContribs * 15 / 60 );
    const estimatedCodingValueUSD = r3( estimatedCodingHours * 50 );

    // Compile stats
    await writeJSON( 'stats.json', {
        // Profile stats
        totalPublicRepos, totalPrivateRepos, totalGists, totalFollowers, totalFollowing,
        accountAge, twoFactorEnabled, hasBlog, hasLocation, hasEmail, bioLength,
        planName, diskUsage, spaceUsed, accountHealth,

        // Social
        numFollowers, numOrgs, totalOrgFollowers, socialReach, totalStars, totalWatchers,

        // Contribs
        totalContribs, avgContribsPerDay, avgContribsPerYear, contribsMedian, contribsStdDev,
        yearlyTotals, yearlyAvgs, longestStreak, currentStreak, busiestDay, leastActiveDay,
        contribPercentiles, commitTrend,

        // Activity
        mostActiveWeekday, leastActiveWeekday, mostActiveHour, leastActiveHour,
        mostActivePeriod, totalActivities, activityBreakdown, mostCommonActivity,

        // Repos
        totalRepoSize, forkedRepos, archivedRepos,

        // Coding & projects
        totalCodeSize, numLanguages, mostUsedLang, leastUsedLang, languageDiversity,
        languageSkills, projectMaturity, codeProductivity, contributionDensity,
        activityConsistency,

        // Meta
        powerLevel, ghRank: r3( rank ), ghLevel, ghPercentile: r3( percentile ),
        estimatedCodingHours, estimatedCodingValueUSD
    } );

} );
