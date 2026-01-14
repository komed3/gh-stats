const dataCache = new Map();

const loadData = async ( path ) => {
    if ( ! dataCache.has( path ) ) {
        const res = await fetch( `/data/${path}` );
        if ( ! res.ok ) throw new Error( `Failed to load from path: ${path}` );
        dataCache.set( path, await res.json() );
    }

    return dataCache.get( path );
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
        hide: () => ( el.style.display = 'none' ),
        show: () => ( el.style.display = '' ),
        link: ( url, text ) => ( $.href( url ).text( text ?? url.replace( /^https?:\/\//, '' ) ) )
    };
};
