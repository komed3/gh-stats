class Rank {

    COMMITS_MEDIAN = 1000;
    COMMITS_WEIGHT = 2;
    PRS_MEDIAN = 50;
    PRS_WEIGHT = 3;
    ISSUES_MEDIAN = 25;
    ISSUES_WEIGHT = 1;
    REVIEWS_MEDIAN = 2;
    REVIEWS_WEIGHT = 1;
    STARS_MEDIAN = 50;
    STARS_WEIGHT = 4;
    FOLLOWERS_MEDIAN = 10;
    FOLLOWERS_WEIGHT = 1;

    TOTAL_WEIGHT =
        Rank.COMMITS_WEIGHT + Rank.PRS_WEIGHT + Rank.ISSUES_WEIGHT +
        Rank.REVIEWS_WEIGHT + Rank.STARS_WEIGHT + Rank.FOLLOWERS_WEIGHT;

    THRESHOLDS = [ 1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100 ];
    LEVELS = [ 'S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C' ];

    static exponential_cdf ( v ) {
        return 1 - 2 ** -v;
    }

    static log_normal_cdf ( v ) {
        return v / ( 1 + v );
    }

    static calculateRank ( commits, prs, issues, reviews, stars, followers ) {
        const rank = 1 - (
            Rank.COMMITS_WEIGHT * Rank.exponential_cdf( commits / Rank.COMMITS_MEDIAN ) +
            Rank.PRS_WEIGHT * Rank.exponential_cdf( prs / Rank.PRS_MEDIAN ) +
            Rank.ISSUES_WEIGHT * Rank.exponential_cdf( issues / Rank.ISSUES_MEDIAN ) +
            Rank.REVIEWS_WEIGHT * Rank.exponential_cdf( reviews / Rank.REVIEWS_MEDIAN ) +
            Rank.STARS_WEIGHT * Rank.log_normal_cdf( stars / Rank.STARS_MEDIAN ) +
            Rank.FOLLOWERS_WEIGHT * Rank.log_normal_cdf( followers / Rank.FOLLOWERS_MEDIAN )
        ) / Rank.TOTAL_WEIGHT;

        const level = Rank.LEVELS[ Rank.THRESHOLDS.findIndex( ( t ) => rank * 100 <= t ) ];
        return { rank, level, percentile: rank * 100 };
    }

}

module.exports = { Rank, calculateRank: Rank.calculateRank.bind( Rank ) };
