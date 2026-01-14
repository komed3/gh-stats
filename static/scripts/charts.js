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
                pointRadius: 4,
                pointBackgroundColor: '#010409',
                pointBorderColor: '#39d353',
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

const distributionChart = ( container, labels, data ) => {
    return chart( container, {
        type: 'line',
        data: {
            labels,
            datasets: [ {
                data,
                borderWidth: 2,
                borderColor: '#39d353',
                backgroundColor: '#39d35333',
                pointRadius: 6,
                pointBackgroundColor: '#010409',
                pointBorderColor: '#39d353',
                tension: 0.1
            } ]
        },
        options: {
            events: [],
            plugins: { legend: false },
            scales: {
                x: {
                    offset: true,
                    ticks: {
                        autoSkip: true,
                        maxRotation: 0,
                        minRotation: 0
                    }
                },
                y: {
                    grid: { lineWidth: 1, color: '#3d444d', drawTicks: false },
                    border: { dash: [ 5, 5 ] },
                    ticks: {
                        maxTicksLimit: 3,
                        callback: v => fPct( v / 100 ),
                        color: '#9198a1'
                    }
                }
            }
        }
    } );
};

const weekdayDistribution = ( container, data ) => {
    return distributionChart( container, [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ], data );
};

const hourDistribution = ( container, data ) => {
    return distributionChart( container, [
        '12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
        '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'
    ], data );
};

const periodDistribution = ( container, data ) => {
    return distributionChart( container, [
        'Morning', 'Daytime', 'Evening', 'Night'
    ], Object.values( data ) );
};
