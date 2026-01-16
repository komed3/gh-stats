document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'stats.json' ).then( stats => {
        let s = '.contribs-info--stats-';
        $( s + 'avgYear b' ).text( fFullNum( stats.avgContribsPerYear ) );
        $( s + 'avgDay b' ).text( fFullNum( stats.avgContribsPerDay ) );
        $( s + 'activeWd b' ).text( [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ][ stats.mostActiveWeekday ] );
        $( s + 'activePeriod b' ).text( stats.mostActivePeriod );
        $( s + 'codeProd b' ).text( fSize( stats.codeProductivity / 1024 ) );
        $( s + 'busiestDay b' ).text( fDate( stats.busiestDay.date ) );

        contribCharts( $( '.contribs-info--years .chart' ).el, stats.yearlyTotals );

        const container = $( '.contribs-years' ).el;
        Promise.all( Object.keys( stats.yearlyTotals ).sort().reverse().slice( 0, 10 ).map( year =>
            loadData( `year/${year}.csv` ).then( data => {
                const y = el( 'div', { className: 'box contribs-years--year' } );
                y.innerHTML = `<h3 class="box-hl">Contributions ${year}</h3>`;
                y.appendChild( calendar( data ) );
                return y;
            } )
        ) ).then( years =>
            years.forEach( y => container.appendChild( y ) )
        ).catch( console.error );

    } ).catch( console.error );
} );
