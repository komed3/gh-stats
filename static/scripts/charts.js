const chart = ( container, options ) => {
    const ctx = el( 'canvas' );
    container.append( ctx );

    return new Chart( ctx, options );
};

const contribRadar = ( container, data ) => {
    return chart( container, {} );
};
