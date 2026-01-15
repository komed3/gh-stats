const languages = ( container, languageSkills ) => {
    const items = Object.entries( languageSkills )
        .filter( ( [ , { pct } ] ) => pct >= 0.025 )
        .map( ( [ lang, { pct } ] ) => ( { lang, pct } ) )
        .reduce( ( acc, { lang, pct } ) => (
            acc.sum += pct, acc.items.push( { lang, pct } ), acc
        ), { items: [], sum: 0 } );

    const widget = el( 'div', { className: 'widget widget-languages' } );
    const bar = el( 'div', { className: 'widget-languages--bar' } );
    const legend = el( 'ul', { className: 'widget-languages--legend' } );

    items.items.forEach( ( { lang, pct } ) => {
        const langKey = lang.toLowerCase().replace( /[^a-z0-9]/g, '-' );
        bar.innerHTML += `<div style="--p:${pct};--c:var(--lang-${langKey})"></div>`;
        legend.innerHTML += `<li style="--c:var(--lang-${langKey})"><span>${lang}</span>` +
            `<b>${ fPct( pct ) }</b></li>`;
    } );

    if ( items.sum < 1 ) bar.innerHTML += `<div style="--p:${ ( 1 - items.sum ) }"></div>`;

    widget.append( bar, legend );
    container.appendChild( widget );
};
