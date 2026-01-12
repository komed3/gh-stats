async function runner ( fn ) {
    console.log( `Starting ...` );
    fn().then( () => {
        console.log( `... completed successfully.` );
    } ).catch( ( err ) => {
        console.error( `Error:`, err );
    } );
}

module.exports = { runner };
