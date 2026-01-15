document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'repos.json' ).then( repos => {
        const container = $( '.repos-list' ).el;
        const filter_search = $( '.repos-filter--search' ).el;
        const filter_type = $( '.repos-filter--select[name="type"]' ).el;
        const filter_lang = $( '.repos-filter--select[name="lang"]' ).el;
        const langs = {};

        const filter = () => {
            const search = langKey( filter_search.value, ' ' );
            const type = filter_type.value;
            const lang = filter_lang.value;

            container.querySelectorAll( '.repo' ).forEach( r => {
                r.style.display = (
                    r.getAttribute( 'search' ).includes( search ) &&
                    ( ! type || r.classList.contains( type ) ) &&
                    ( ! lang || r.classList.contains( lang ) )
                ) ? '' : 'none';
            } );
        };

        const clear = ( e ) => {
            e.preventDefault();
            filter_search.value = '';
            filter_type.value = '';
            filter_lang.value = '';
            filter();
        }

        repos.forEach( repo => {
            const key = langKey( repo.language );
            const [ owner, name ] = repo.full_name.split( '/' );
            const r = el( 'div', { className: `box item repo ${key}` } );
            r.setAttribute( 'search', langKey( `${repo.full_name} ${repo.description}`, ' ' ) );

            let badge = 'cube', status = undefined;
            if ( repo.private ) r.classList.add( 'private' ), badge = 'lock', status = 'Private';
            else r.classList.add( 'public' );

            if ( repo.archived ) r.classList.add( 'archived' ), badge = 'file-archive-o', status = 'Archived';
            if ( repo.fork ) r.classList.add( 'forked' ), badge = 'code-fork', status = 'Forked';
            if ( repo.is_template ) r.classList.add( 'template' ), badge = 'clone', status = 'Template';

            if ( key ) langs[ key ] = repo.language;

            r.innerHTML = `<div class="repo-info">` +
                `<div class="repo-header">` +
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
                    ( repo.homepage ? `<li class="repo-homepage">` +
                        `<i class="fa fa-link" aria-hidden="true"></i>` +
                        `<a href="${repo.homepage}" target="_blank">${ repo.homepage.replace( /^https?:\/\//, '' ) }</a>` +
                    `</li>` : '' ) +
                    `<li class="repo-size">${ fSize( repo.size ) }</li>` +
                    `<li class="repo-updated">Updated at ${ fDate( repo.updated_at ) }</li>` +
                `</ul>` +
            `</div>` +
            `<div class="repo-stats">` +
                `<div><b>${ fNumber( repo.stargazers_count ) }</b><span>Stargazers</span></div>` +
                `<div><b>${ fNumber( repo.subscribers_count ) }</b><span>Subscribers</span></div>` +
                `<div><b>${ fNumber( repo.forks_count ) }</b><span>Forks</span></div>` +
                `<div><b>${ fNumber( repo.open_issues_count ) }</b><span>Issues</span></div>` +
            `</div>`;

            container.appendChild( r );
        } );

        filter_lang.append( ...Object.entries( langs ).map(
            ( [ key, lang ] ) => el( 'option', { value: key, text: lang } )
        ) );

        filter_search.addEventListener( 'keyup', filter );
        filter_type.addEventListener( 'change', filter );
        filter_lang.addEventListener( 'change', filter );
        $( '.repos-filter--clear' ).el.addEventListener( 'click', clear );
    } ).catch( console.error );
} );
