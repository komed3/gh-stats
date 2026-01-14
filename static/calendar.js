const calendar = ( data ) => {
    const container = el( 'div', { className: 'calendar dark' } );
    const level = [ 'l0', 'l1', 'l2', 'l3', 'l4' ];

    const days = new Map( data.map( d => [ d.date, d ] ) );
    const dts = [ ...days.keys() ].map( d=>new Date( d ) );
    const start = new Date( Math.min( ...dts ) );
    const end = new Date( Math.max( ...dts ) );
    start.setDate( start.getDate() - start.getDay() );

    const head = el( 'div', { className: 'header' } );
    const grid = el( 'div', { className: 'grid' } );
    const labs = el( 'div', { className: 'weekdays' } );
    [ 'Sun', '', 'Tue', '', 'Thu', '', 'Sat' ].forEach(
        t => labs.append( el( 'span', { textContent: t } ) )
    );

    container.append( head, labs, grid );

    let mon = -1, wk;
    for ( let d = new Date( start ); d <= end; d.setDate( d.getDate() + 1 ) ) {
        if ( ! d.getDay() ) {
            wk = el( 'div', { className: 'week' } );
            grid.append( wk );

            if ( d.getMonth() != mon ) {
                head.append( el( 'span', { textContent: d.toLocaleString( 'en', { month: 'short' } ) } ) );
                mon = d.getMonth();
            }
        }

        const k = d.toISOString().slice( 0, 10 ), v = days.get( k ) || { count: 0, level: 0 };
        if ( ! days.has( k ) ) wk.append( el( 'span', { className: 'empty' } ) );
        else wk.append( el( 'span', {
            className: `day ${ level[ ( v.level || 0 ) ] }`,
            title: `${v.count} commits on ${ fDate( k ) }`
        } ) );
    }

    const legend = el( 'div', { className: 'legend' } );
    legend.append( 'Less', ...level.map( l => el( 'span', { className: `day ${l}` } ) ), 'More' );
    container.append( legend );

    return container;
};
