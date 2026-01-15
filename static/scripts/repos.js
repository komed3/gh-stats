document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'repos.json' ).then( repos => {
        const container = $( '.repos' ).el;
        repos.forEach( repo => {
            const key = langKey( repo.language );
            const [ owner, name ] = repo.full_name.split( '/' );
            const r = el( 'div', { className: `box item repo ${key}` } );

            let badge = 'cube', status = undefined;
            if ( repo.archived ) r.classList.add( 'archived' ), badge = 'file-archive-o', status = 'Archived';
            else if ( repo.fork ) r.classList.add( 'fork' ), badge = 'code-fork', status = 'Forked';
            else if ( repo.is_template ) r.classList.add( 'template' ), badge = 'clone', status = 'Template';
            else if ( repo.private ) r.classList.add( 'private' ), badge = 'lock', status = 'Private';

            r.innerHTML = `<div class="repo-header">` +
                `<i class="fa fa-${badge} repo-badge" aria-hidden="true"></i>` +
                `<h3 class="repo-name"><span>${owner}</span>/<a href="${repo.html_url}" target="_blank">${name}</a></h3>` +
                ( status ? `<span class="repo-status">${status}</span>` : '' ) +
            `</div>`;

            container.appendChild( r );
        } );
    } ).catch( console.error );
} );
