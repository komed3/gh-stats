document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'orgs.json' ).then( orgs => {
        const container = $( '.orgs' ).el;

        for ( const org of orgs ) {
            const o = el( 'div', { className: 'box profile item' } );
            o.innerHTML = `<a href="${org.html_url}" target="_blank" class="profile-link">` +
                `<img src="${org.avatar_url}" class="profile-avatar" alt="GitHub Profile Avatar" />` +
            `</a>` +
            `<div class="profile-info">` +
                `<h2 class="profile-name">${org.name}</h2>` +
                `<h3 class="profile-login">@${org.name}</h3>` +
                `<p class="profile-bio">${org.description}</p>` +
                `<ul class="profile-details">` +
                    ( org.location ? `<li class="profile-location">` +
                        `<i class="fa fa-map-marker" aria-hidden="true"></i>` +
                        `<span>${org.location}</span>` +
                    `</li>` : '' ) +
                    `<li class="profile-joined">` +
                        `<i class="fa fa-clock-o" aria-hidden="true"></i>` +
                        `<span>Founded at ${ fDate( org.created_at ) }</span>` +
                    `</li>` +
                    ( org.blog ? `<li class="profile-blog">` +
                        `<i class="fa fa-link" aria-hidden="true"></i>` +
                        `<a href="${org.blog}" target="_blank">${ org.blog.replace( /^https?:\/\//, '' ) }</a>` +
                    `</li>` : '' ) +
                    ( org.email ? `<li class="profile-email">` +
                        `<i class="fa fa-envelope-o" aria-hidden="true"></i>` +
                        `<a href="mailto:${org.email}" target="_blank">${org.email}</a>` +
                    `</li>` : '' ) +
                    ( org.twitter_username ? `<li class="profile-twitter">` +
                        `<i class="fa fa-twitter" aria-hidden="true"></i>` +
                        `<a href="https://x.com/${org.twitter_username}" target="_blank">@${org.twitter_username}</a>` +
                    `</li>` : '' ) +
                `</ul>` +
            `</div>`;

            container.appendChild( o );
        }
    } ).catch( console.error );
} );
