Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.offset = false;
Chart.defaults.layout.padding = 0;

Chart.defaults.font.family = 'Noto Sans, sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.font.weight = 400;
Chart.defaults.color = '#fff';

Chart.defaults.transitions = { active: { animation: { duration: 0 } } };
Chart.defaults.animations = {
    x: { duration: 0 },
    y: { duration: 150, easing: 'easeOutBack' }
};

Chart.defaults.plugins.tooltip.padding = { top: 10, left: 12, right: 16, bottom: 10 };
Chart.defaults.plugins.tooltip.animation = { duration: 150, easing: 'easeOutBack' };
Chart.defaults.plugins.tooltip.titleColor = '#fff';
Chart.defaults.plugins.tooltip.bodyColor = '#4493f8';
Chart.defaults.plugins.tooltip.backgroundColor = '#010409';
Chart.defaults.plugins.tooltip.borderColor = '#3d444d';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.cornerRadius = 5;
Chart.defaults.plugins.tooltip.boxPadding = 4;

const chart = ( container, options ) => {
    const ctx = el( 'canvas' );
    container.append( ctx );

    return new Chart( ctx, options );
};

const contribRadar = ( container, data ) => {
    return chart( container, {
        type: 'radar',
        data: {
            labels: [ 'Commits', 'Issues', 'PRs', 'Reviews', 'Repos' ],
            datasets: [ {
                data: [
                    Math.log( data.commit || 1 ),
                    Math.log( data.issue || 1 ),
                    Math.log( data.pr || 1 ),
                    Math.log( data.review || 1 ),
                    Math.log( data.repo || 1 )
                ],
                fill: true,
                borderWidth: 2,
                borderColor: '#39d353',
                backgroundColor: '#39d35333',
                pointBackgroundColor: '#010409',
                pointBorderColor: '#39d353',
                pointHoverBackgroundColor: '#010409',
                pointHoverBorderColor: '#39d353',
                tension: 0.1
            } ]
        },
        options: {
            events: [],
            plugins: { legend: false },
            scales: {
                r: {
                    angleLines: { lineWidth: 1, color: '#3d444d' },
                    grid: { lineWidth: 1, color: '#3d444d' },
                    ticks: { count: 6, display: false }
                }
            }
        }
    } );
};
