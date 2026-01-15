document.addEventListener( 'DOMContentLoaded', function () {
    loadData( 'orgs.json' ).then( orgs => {
        const container = $( '.orgs' ).el;

        for ( const org of orgs ) {
            const o = el( 'div', { className: 'box profile item' } );
            o.innerHTML = `<a href="${org.html_url}" target="_blank" class="profile-link">` +
                `<img src="${org.avatar_url}" class="profile-avatar" alt="GitHub Profile Avatar" />` +
            `</a>` +
            `<div class="dashboard-profile--info">` +
                `<h2 class="profile-name">${org.name}</h2>` +
                `<h3 class="profile-login">@${org.name}</h3>` +
                `<p class="profile-bio">${org.description}</p>` +
            `</div>`;

            container.appendChild( o );
        }
    } ).catch( console.error );
} );
