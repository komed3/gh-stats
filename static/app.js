const dataCache = new Map();

async function loadData ( path ) {
    if ( ! dataCache.has( path ) ) {
        const res = await fetch( `/data/${path}` );
        if ( ! res.ok ) throw new Error( `Failed to load from path: ${path}` );
        dataCache.set( path, await res.json() );
    }

    return dataCache.get( path );
}
