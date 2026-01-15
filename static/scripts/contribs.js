document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'stats.json' ).then( stats => {
        contribCharts( $( '.contribs-info--years .chart' ).el, stats.yearlyTotals );
    } ).catch( console.error );
} );
