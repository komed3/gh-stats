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
            `</div>` +
            `<p class="repo-desc">${repo.description}</p>` +
            `<ul class="repo-topics">${ ( repo.topics ?? [] ).slice( 0, 7 ).map( t => `<li>${t}</li>` ).join( '' ) }</ul>` +
            `<ul class="repo-meta">` +
                ( key ? `<li class="repo-lang" style="--c:var(--lang-${key})">${repo.language}</li>` : '' ) +
                ( repo.license?.name ? `<li class="repo-license">` +
                    `<i class="fa fa-balance-scale" aria-hidden="true"></i>` +
                    `<span>${repo.license.name}</span>` +
                `</li>` : '' ) +
                `<li class="repo-updated">Updated at ${ fDate( repo.updated_at ) }</span></li>` +
            `</ul>`;

            container.appendChild( r );
        } );
    } ).catch( console.error );
} );
