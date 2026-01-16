document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'stats.json' ).then( stats => {
        const repos = stats.totalPublicRepos + stats.totalPrivateRepos;

        let s = '.stats-global--';
        $( s + 'contribs b' ).text( fNumber( stats.totalContribs, 1 ) );
        $( s + 'repos b' ).text( fNumber( repos ) );
        $( s + 'gists b' ).text( fNumber( stats.totalGists ) );
        $( s + 'orgs b' ).text( fNumber( stats.numOrgs ) );
        $( s + 'disk b' ).text( fSize( stats.diskUsage ) );
        $( s + 'plan b' ).text( stats.planName );
        $( s + 'age b' ).text( fNumber( stats.accountAge / 365.25 ) + 'y' );
        $( s + 'reach b' ).text( fNumber( stats.socialReach ) );
        $( s + 'stars b' ).text( fNumber( stats.totalStars ) );
        $( s + 'level b' ).text( stats.ghLevel );
        $( s + 'rank b' ).text( fPct( stats.ghRank ) );
        $( s + 'powerLevel b' ).text( fNumber( stats.powerLevel ) );
        $( s + 'repoSize b' ).text( fSize( stats.totalRepoSize ) );
        $( s + 'health b' ).text( fPct( stats.accountHealth ) );
        $( s + 'projectMaturity b' ).text( fNumber( stats.projectMaturity, 3 ) );
        $( s + 'codeProd b' ).text( fSize( stats.codeProductivity / 1024 ) );
        $( s + 'contribDensity b' ).text( fNumber( stats.contributionDensity, 1 ) );
        $( s + 'activityConsistency b' ).text( fNumber( stats.activityConsistency, 2 ) );
        $( s + 'hours b' ).text( fNumber( stats.estimatedCodingHours, 1 ) );
        $( s + 'value b' ).text( fMoney( stats.estimatedCodingValueUSD ) );
        $( s + 'trend b' ).text( fNumber( stats.commitTrend ) );

        s = '.stats-heatmap--stats-';
        $( s + 'avgYear b' ).text( fNumber( stats.avgContribsPerYear, 1 ) );
        $( s + 'avgDay b' ).text( fNumber( stats.avgContribsPerDay, 1 ) );
        $( s + 'activeWd b' ).text( [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ][ stats.mostActiveWeekday ] );
        $( s + 'activeHour b' ).text( stats.mostActiveHour % 12 + ( stats.mostActiveHour >= 12 ? 'pm' : 'am' ) + ' UTC' );
        $( s + 'activePeriod b' ).text( stats.mostActivePeriod );
        $( s + 'commonActivity b' ).text( stats.mostCommonActivity );

        s = '.stats-skills--stats-';
        $( s + 'mostUsed b' ).text( stats.mostUsedLang.lang );
        $( s + 'leastUsed b' ).text( stats.leastUsedLang.lang );
        $( s + 'codeSize b' ).text( fSize( stats.totalCodeSize ) );
        $( s + 'numLangs b' ).text( fFullNum( stats.numLanguages ) );
        $( s + 'langPerRepo b' ).text( fNumber( repos / stats.numLanguages, 1 ) );
        $( s + 'diversity b' ).text( fNumber( stats.languageDiversity, 2 ) );
    } ).catch( console.error );

    loadData( 'activity.json' ).then( activity => {
        heatmap( $( '.stats-heatmap--graph .chart' ).el, activity.heatmapPct );
        hourDistribution( $( '.stats-activity .chart' ).el, activity.hoursPct );
    } ).catch( console.error );
} );
