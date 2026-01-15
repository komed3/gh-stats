document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'repos.json' ).then( repos => {
        const container = $( '.repos' ).el;
        repos.forEach( repo => {
            const key = langKey( repo.language );
            const [ owner, name ] = repo.full_name.split( '/' );
            const r = el( 'div', { className: `box item ${key}` } );

            if ( repo.archived ) r.classList.add( 'archived' );
            if ( repo.private ) r.classList.add( 'private' );

            r.innerHTML = `<div class="repo-header">` +
                `<h3><i class="fa fa-cube" aria-hidden="true"></i><span>${owner}</span>/<b>${name}</b></h3>` +
            `</div>`;

            container.appendChild( r );
        } );
    } ).catch( console.error );
} );
