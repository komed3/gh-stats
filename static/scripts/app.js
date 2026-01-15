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
    const $$ = document.querySelector( sel );

    return {
        el: $$,
        doIf: ( method, ...args ) => ( $$ && args.length && args[ 0 ] ? $( sel )[ method ]( ...args ) : hide() ),
        text: ( val ) => ( val !== undefined ? ( $$.textContent = val ) : $$.textContent ),
        html: ( val ) => ( val !== undefined ? ( $$.innerHTML = val ) : $$.innerHTML ),
        attr: ( name, val ) => ( val !== undefined ? $$.setAttribute( name, val ) : $$.getAttribute( name ) ),
        src: ( val ) => ( val !== undefined ? ( $$.src = val ) : $$.src ),
        href: ( val ) => ( val !== undefined ? ( $$.href = val ) : $$.href ),
        link: ( url, text ) => ( $( sel ).href( url ) && $( sel ).text( text ?? url.replace( /^https?:\/\//, '' ) ) ),
        show: () => ( $$.style.display = '' ),
        hide: () => ( $$.style.display = 'none' )
    };
};

const el = ( t, c ) => Object.assign( document.createElement( t ), c || {} );

const langKey = ( lang ) => String( lang ?? '' ).toLowerCase().replace( /[^a-z0-9]/g, '-' );

const fDate = ( val, opt = {} ) => Intl.DateTimeFormat( 'en-US', { dateStyle: 'short', ...opt } ).format( new Date( val ) );

const fNumber = ( val, d = 0, opt = {} ) => Intl.NumberFormat( 'en-US', {
    notation: 'compact', minimumFractionDigits: d, maximumFractionDigits: d, ...opt
} ).format( Number( val ) );

const fFullNum = ( val, d = 0, opt = {} ) => fNumber( val, d, { notation: 'standard', ...opt } );

const fPct = ( val, d = 0, opt = {} ) => fNumber( val, d, { style: 'percent', ...opt } );

const fSize = ( val, d = 0 ) => {
    const i = Math.floor( Math.log10( val * 1024 ) / 3 );
    return fNumber( val * 1024 / Math.pow( 1000, i ), d ) + [ 'B', 'kB', 'MB', 'GB' ][ i ];
};
