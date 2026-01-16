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
    const wd = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
    const max = Math.log( data.reduce( ( m, day ) => Math.max( m, ...day ), 0 ) * 100 );

    for ( let h = -1; h < 24; h++ ) widget.appendChild( el( 'div', {
        className: 'hour', innerHTML: h >= 0 ? h.toString().padStart( 2, '0' ) : ''
    } ) );

    data.forEach( ( day, d ) => {
        widget.appendChild( el( 'div', { className: 'day', innerHTML: wd[ d ].substring( 0, 3 ) } ) );

        day.forEach( ( v, h ) => {
            const item = el( 'div', { className: `item l${ v === 0 ? 0 : Math.round( Math.log( v * 100 ) / max * 4 ) }` } );
            item.setAttribute( 'title', `${ wd[ d ] }, ${ ( h % 12 ) || 12 }${ h >= 12 ? 'pm' : 'am' } UTC: ${ fPct( v / 100, 2 ) }` );
            widget.appendChild( item );
        } )
    } );

    container.appendChild( widget );
};

const skills = ( container, data ) => {
    const nodes = new vis.DataSet(), edges = new vis.DataSet(), visited = new Set();

    for ( const [ lang, { weight } ] of Object.entries( data.langs ) ) {
        nodes.add( [ { id: lang, label: lang, value: weight, color: LANGS[ langKey( lang ) ] } ] );
    }

    for ( const [ from, rels ] of Object.entries( data.relations ) ) {
        for ( const [ to, value ] of Object.entries( rels ) ) {
            if ( visited.has( from + to ) || visited.has( to + from ) ) continue;
            edges.add( [ { from, to, value } ] );
            visited.add( from + to );
        }
    }

    const widget = el( 'div', { className: 'widget widget-skills' } );
    const network = new vis.Network( widget, { nodes, edges }, {
        edges: {
            arrows: {
                to: { enabled: true, scaleFactor: 0.6 },
                from: { enabled: true, scaleFactor: 0.6 }
            },
            color: { color: '#666' },
            scaling: { min: 2, max: 2 },
            smooth: false
        },
        nodes: {
            borderWidth: 0,
            color: { background: '#3d444d' },
            font: {
                face: 'Noto Sans, sans-serif', size: 16, color: '#fff',
                strokeColor: '#000', strokeWidth: 2
            },
            margin: 10,
            scaling: { min: 1, max: 3 },
            shape: 'circle'
        },
        physics: {
            solver: 'forceAtlas2Based',
            forceAtlas2Based: {
                gravitationalConstant: -50,
                centralGravity: 0.01,
                springLength: 100,
                springConstant: 0.05,
                avoidOverlap: 0.7
            },
            stabilization: {
                iterations: 10000
            }
        }
    } );

    container.appendChild( widget );
    network.fit();
    return network;
};
