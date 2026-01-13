class Rank {

    static COMMITS_MEDIAN = 1000;
    static COMMITS_WEIGHT = 2;
    static PRS_MEDIAN = 50;
    static PRS_WEIGHT = 3;
    static ISSUES_MEDIAN = 25;
    static ISSUES_WEIGHT = 1;
    static REVIEWS_MEDIAN = 2;
    static REVIEWS_WEIGHT = 1;
    static STARS_MEDIAN = 50;
    static STARS_WEIGHT = 4;
    static FOLLOWERS_MEDIAN = 10;
    static FOLLOWERS_WEIGHT = 1;

    static TOTAL_WEIGHT = 12;

    static THRESHOLDS = [ 1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100 ];
    static LEVELS = [ 'S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C' ];

    static exponential_cdf ( v ) {
        return 1 - 2 ** -v;
    }

    static log_normal_cdf ( v ) {
        return v / ( 1 + v );
    }

    static calculateRank ( commits, prs, issues, reviews, stars, followers ) {
        const rank = 1 - (
            this.COMMITS_WEIGHT * this.exponential_cdf( ( commits ?? 0 ) / this.COMMITS_MEDIAN ) +
            this.PRS_WEIGHT * this.exponential_cdf( ( prs ?? 0 ) / this.PRS_MEDIAN ) +
            this.ISSUES_WEIGHT * this.exponential_cdf( ( issues ?? 0 ) / this.ISSUES_MEDIAN ) +
            this.REVIEWS_WEIGHT * this.exponential_cdf( ( reviews ?? 0 ) / this.REVIEWS_MEDIAN ) +
            this.STARS_WEIGHT * this.log_normal_cdf( ( stars ?? 0 ) / this.STARS_MEDIAN ) +
            this.FOLLOWERS_WEIGHT * this.log_normal_cdf( ( followers ?? 0 ) / this.FOLLOWERS_MEDIAN )
        ) / this.TOTAL_WEIGHT;

        const level = this.LEVELS[ this.THRESHOLDS.findIndex( ( t ) => rank * 100 <= t ) ];
        return { rank, level, percentile: rank * 100 };
    }

}

module.exports = { Rank, calculateRank: Rank.calculateRank.bind( Rank ) };
