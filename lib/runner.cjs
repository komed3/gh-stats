async function runner ( fn ) {
    console.log( `Starting ${ fn.name } ...` );
    if ( require.main === module ) fn().then( () => {
        console.log( `${ fn.name } completed successfully.` );
    } ).catch( ( err ) => {
        console.error( `Error in ${ fn.name }:`, err );
    } );
}

module.exports = { runner };
