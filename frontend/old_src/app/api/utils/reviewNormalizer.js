import { mockProperties } from "@/data/mockProperties";

// Normalize listing names for matching
function normalizeListingName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Find property by listing name
function findPropertyByListingName(listingName, properties = mockProperties) {
  const normalizedInput = normalizeListingName(listingName);
  
  return properties.find(property => {
    const normalizedPropertyName = normalizeListingName(property.listingName);
    return normalizedPropertyName === normalizedInput;
  });
}

// Calculate overall rating from categories
function calculateOverallRating(reviewCategories) {
  if (!reviewCategories || reviewCategories.length === 0) return 0;
  
  const validRatings = reviewCategories
    .map(cat => cat.rating)
    .filter(rating => rating != null && !isNaN(rating));
    
  if (validRatings.length === 0) return 0;
  
  const sum = validRatings.reduce((total, rating) => total + rating, 0);
  return Math.round((sum / validRatings.length) * 10) / 10; // Round to 1 decimal place
}

// Normalize timestamp to ISO format
function normalizeTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toISOString();
}

// Generate guest ID from guest name (mock implementation)
function generateGuestId(guestName) {
  if (!guestName) return null;
  // Simple hash function for consistent guest IDs
  let hash = 0;
  for (let i = 0; i < guestName.length; i++) {
    const char = guestName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `guest_${Math.abs(hash) % 100000}`;
}

// Normalize review from Hostaway format to our standard format
export function normalizeHostawayReview(rawReview) {
  const property = findPropertyByListingName(rawReview.listingName);
  const now = new Date().toISOString();
  
  // Extract ratings object
  const ratings = {};
  if (rawReview.reviewCategory && Array.isArray(rawReview.reviewCategory)) {
    rawReview.reviewCategory.forEach(cat => {
      if (cat.category && cat.rating != null) {
        ratings[cat.category] = cat.rating;
      }
    });
  }
  
  const overallRating = calculateOverallRating(rawReview.reviewCategory);
  
  return {
    id: `rev_${rawReview.id}`,
    review_type: rawReview.type?.replace('-', '_') || 'guest_to_host',
    status: rawReview.status === 'published' ? 'published' : 'archived',
    submitted_at: normalizeTimestamp(rawReview.submittedAt),
    guest_id: generateGuestId(rawReview.guestName),
    listing_id: property?.listingId || null,
    host_id: property?.hostId || null,
    channel: {
      name: 'hostaway',
      review_id: `HA-${rawReview.id}`
    },
    public_review: rawReview.publicReview || '',
    overall_rating: overallRating,
    overall_rating_source: 'calculated',
    ratings: ratings,
    ingested_at: now,
    last_updated_at: now,
    // Additional fields for frontend compatibility
    _meta: {
      guest_name: rawReview.guestName,
      listing_name: rawReview.listingName,
      property_data: property
    }
  };
}

// Mock function to fetch reviews from Hostaway
export async function fetchHostawayReviews() {
  const { hostawayMockReviews } = await import('@/data/channels/hostaway');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return hostawayMockReviews.map(normalizeHostawayReview);
}

// Main function to fetch and normalize reviews from all channels
export async function fetchAndNormalizeReviews() {
  const allReviews = [];
  
  // Fetch from Hostaway
  const hostawayReviews = await fetchHostawayReviews();
  allReviews.push(...hostawayReviews);
  
  // Future channels can be added here
  // const airbnbReviews = await fetchAirbnbReviews();
  // allReviews.push(...airbnbReviews);
  
  return allReviews;
}