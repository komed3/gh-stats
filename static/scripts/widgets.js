const languages = ( container, data ) => {
    const items = Object.entries( data )
        .filter( ( [ , { pct } ] ) => pct >= 0.025 )
        .map( ( [ lang, { pct } ] ) => ( { lang, pct } ) )
        .sort( ( a, b ) => b.pct - a.pct )
        .reduce( ( acc, { lang, pct } ) => (
            acc.sum += pct, acc.items.push( { lang, pct } ), acc
        ), { items: [], sum: 0 } );

    const widget = el( 'div', { className: 'widget widget-languages' } );
    const bar = el( 'div', { className: 'widget-languages--bar' } );
    const legend = el( 'ul', { className: 'widget-languages--legend' } );

    items.items.forEach( ( { lang, pct } ) => {
        const key = langKey( lang );
        bar.innerHTML += `<div style="--p:${pct};--c:var(--lang-${key})"></div>`;
        legend.innerHTML += `<li style="--c:var(--lang-${key})"><span>${lang}</span>` +
            `<b>${ fPct( pct ) }</b></li>`;
    } );

    if ( items.sum < 1 ) {
        bar.innerHTML += `<div style="--p:${ ( 1 - items.sum ) }"></div>`;
        legend.innerHTML += `<li><span>Others</span><b>${ fPct( 1 - items.sum ) }</b></li>`;
    }

    widget.append( bar, legend );
    container.appendChild( widget );
};

const heatmap = ( container, data ) => {
    const widget = el( 'div', { className: 'widget widget-heatmap' } );

    container.appendChild( widget );
};
