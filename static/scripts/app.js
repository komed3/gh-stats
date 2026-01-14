const dataCache = new Map();

const loadData = async ( ...path ) => {
    const res = await Promise.all( path.map( async p => {
        if ( ! dataCache.has( p ) ) {
            const response = await fetch( `/data/${p}` );
            if ( ! response.ok ) throw new Error( `Failed to load from path: ${p}` );
            dataCache.set( p, p.endsWith( '.csv' )
                ? parseCSV( await response.text() )
                : await response.json()
            );
        }

        return dataCache.get( p );
    } ) );

    return path.length === 1 ? res[ 0 ] : res;
};


const parseCSV = ( raw ) => {
    const [ header, ...rows ] = raw.trim().split( '\n' ).map( r => r.split( ',' ) );
    return rows.map( r => Object.fromEntries( header.map( ( h, i ) => [ h, r[ i ] ] ) ) );
};

const $ = ( sel ) => {
    const el = document.querySelector( sel );

    return {
        el,
        doIf: ( method, ...args ) => ( el && args.length && args[ 0 ] ? $( sel )[ method ]( ...args ) : hide() ),
        text: ( val ) => ( val !== undefined ? ( el.textContent = val ) : el.textContent ),
        html: ( val ) => ( val !== undefined ? ( el.innerHTML = val ) : el.innerHTML ),
        attr: ( name, val ) => ( val !== undefined ? el.setAttribute( name, val ) : el.getAttribute( name ) ),
        src: ( val ) => ( val !== undefined ? ( el.src = val ) : el.src ),
        href: ( val ) => ( val !== undefined ? ( el.href = val ) : el.href ),
        link: ( url, text ) => ( $( sel ).href( url ) && $( sel ).text( text ?? url.replace( /^https?:\/\//, '' ) ) ),
        show: () => ( el.style.display = '' ),
        hide: () => ( el.style.display = 'none' )
    };
};

const el = ( t, c ) => Object.assign( document.createElement( t ), c || {} );

const fNumber = ( val, d = 0, opt = {} ) => {
    return Intl.NumberFormat( 'en-US', {
        notation: 'compact',
        minimumFractionDigits: d,
        maximumFractionDigits: d,
        ...opt
    } ).format( Number( val ) );
};

const fFullNum = ( val, d = 0, opt = {} ) => {
    return fNumber( val, d, { notation: 'standard', ...opt } );
};

const fPct = ( val, d = 0, opt = {} ) => {
    return fNumber( val, d, { style: 'percent', ...opt } );
};

const fDate = ( val, opt = {} ) => {
    return Intl.DateTimeFormat( 'en-US', {
        dateStyle: 'short', ...opt
    } ).format( new Date( val ) );
};
