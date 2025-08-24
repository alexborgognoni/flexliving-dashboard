interface Review {
  overall_rating: number;
  submitted_at: string;
}

/**
 * Calculate trend based on comparing recent period averages
 * More robust than just comparing last two individual reviews
 */
export function calculateTrend(reviews: Review[]): "up" | "down" | "stable" {
  console.log(`[TREND] Calculating trend for ${reviews?.length || 0} reviews`);
  if (!reviews || reviews.length < 2) {
    console.log(`[TREND] Not enough reviews (${reviews?.length || 0} < 2), returning stable`);
    return "stable"; // Need at least 2 reviews for meaningful trend
  }

  // Sort reviews by date (newest first)
  const sortedReviews = reviews.sort((a, b) => 
    new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
  );

  // Split reviews into two periods
  const halfPoint = Math.floor(sortedReviews.length / 2);
  const recentPeriod = sortedReviews.slice(0, halfPoint);
  const olderPeriod = sortedReviews.slice(halfPoint);

  // Calculate average ratings for each period
  const recentAverage = recentPeriod.reduce((sum, review) => sum + review.overall_rating, 0) / recentPeriod.length;
  const olderAverage = olderPeriod.reduce((sum, review) => sum + review.overall_rating, 0) / olderPeriod.length;

  // Determine trend with a threshold to avoid noise
  const threshold = 0.1; // Only consider it a trend if difference is > 0.1 points
  const difference = recentAverage - olderAverage;

  let result: "up" | "down" | "stable";
  if (difference > threshold) {
    result = "up";
  } else if (difference < -threshold) {
    result = "down";
  } else {
    result = "stable";
  }
  
  console.log(`[TREND] Recent: ${recentAverage.toFixed(2)}, Older: ${olderAverage.toFixed(2)}, Diff: ${difference.toFixed(2)}, Result: ${result}`);
  return result;
}