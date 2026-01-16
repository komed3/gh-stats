document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'stats.json' ).then( stats => {
        let s = '.stats-global--';

        $( s + 'contribs b' ).text( fNumber( stats.totalContribs, 1 ) );
        $( s + 'repos b' ).text( fNumber( stats.totalPublicRepos ) );
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
    } ).catch( console.error );
} );
