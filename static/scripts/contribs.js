document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'stats.json' ).then( stats => {
        let s = '.contribs-info--stats-';
        $( s + 'avgYear b' ).text( fNumber( stats.avgContribsPerYear, 1 ) );
        $( s + 'avgDay b' ).text( fNumber( stats.avgContribsPerDay, 1 ) );
        $( s + 'activeWd b' ).text( [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ][ stats.mostActiveWeekday ] );
        $( s + 'activePeriod b' ).text( stats.mostActivePeriod );
        $( s + 'codeProd b' ).text( fSize( stats.codeProductivity / 1024 ) );
        $( s + 'busiestDay b' ).text( fDate( stats.busiestDay.date ) );

        contribCharts( $( '.contribs-info--years .chart' ).el, stats.yearlyTotals );
    } ).catch( console.error );
} );
