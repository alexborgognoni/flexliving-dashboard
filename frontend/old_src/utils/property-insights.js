// Utility functions for data processing
export function calculateCategoryAverages(reviews) {
  const categoryTotals = {};
  const categoryCounts = {};

  reviews.forEach((review) => {
    if (review.ratings && typeof review.ratings === "object") {
      Object.entries(review.ratings).forEach(([category, rating]) => {
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
          categoryCounts[category] = 0;
        }
        categoryTotals[category] += rating;
        categoryCounts[category] += 1;
      });
    }
  });

  return Object.keys(categoryTotals).map((category) => ({
    category: category
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    average:
      Math.round((categoryTotals[category] / categoryCounts[category]) * 10) /
      10,
  }));
}

export function createRatingDistribution(reviews) {
  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
  };

  reviews.forEach((review) => {
    const roundedRating = Math.round(review.overall_rating);
    if (roundedRating >= 1 && roundedRating <= 10) {
      distribution[roundedRating]++;
    }
  });

  return Object.keys(distribution).map((rating) => ({
    rating: rating,
    count: distribution[rating],
  }));
}

export function createTrendData(reviews) {
  const monthlyData = {};

  reviews.forEach((review) => {
    const date = new Date(review.submitted_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { ratings: [], month: monthKey };
    }
    monthlyData[monthKey].ratings.push(review.overall_rating);
  });

  return Object.values(monthlyData)
    .map((month) => ({
      month: month.month,
      average:
        month.ratings.reduce((sum, rating) => sum + rating, 0) /
        month.ratings.length,
      count: month.ratings.length,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
