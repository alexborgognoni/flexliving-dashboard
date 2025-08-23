import path from 'path';
import { Property, Host, Guest, Review } from './types';

// Database state - this simulates our database
let database = {
  properties: [] as Property[],
  hosts: [] as Host[],
  guests: [] as Guest[],
  reviews: [] as Review[]
};

// Flag to track initialization
let isInitialized = false;

/**
 * Initialize the database by loading data and processing reviews
 */
export const initializeDatabase = async (): Promise<void> => {
  if (isInitialized) {
    console.log('Database already initialized');
    return;
  }

  console.log('Initializing database...');

  try {
    // Load static data from JS files
    const propertiesPath = path.join(__dirname, 'data', 'properties.js');
    const hostsPath = path.join(__dirname, 'data', 'hosts.js');
    const guestsPath = path.join(__dirname, 'data', 'guests.js');
    const hostawayReviewsPath = path.join(__dirname, 'data', 'reviews_hostaway.js');

    // Clear require cache to ensure fresh data
    delete require.cache[require.resolve(propertiesPath)];
    delete require.cache[require.resolve(hostsPath)];
    delete require.cache[require.resolve(guestsPath)];
    delete require.cache[require.resolve(hostawayReviewsPath)];

    // Load data
    database.properties = require(propertiesPath);
    database.hosts = require(hostsPath);
    database.guests = require(guestsPath);
    
    const hostawayData = require(hostawayReviewsPath);
    
    console.log(`Loaded ${database.properties.length} properties, ${database.hosts.length} hosts, ${database.guests.length} guests`);
    
    // Process and normalize Hostaway reviews
    database.reviews = await normalizeHostawayReviews(hostawayData.result);
    console.log(`Normalized ${database.reviews.length} reviews from Hostaway`);

    // Calculate property ratings from reviews
    calculatePropertyRatings();
    
    isInitialized = true;
    console.log('Database initialization complete');
    
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

/**
 * Normalize Hostaway reviews into our format
 */
const normalizeHostawayReviews = async (hostawayReviews: any[]): Promise<Review[]> => {
  const normalizedReviews: Review[] = [];
  
  for (const hostawayReview of hostawayReviews) {
    const normalized = await normalizeHostawayReview(hostawayReview);
    if (normalized) {
      normalizedReviews.push(normalized);
    }
  }
  
  return normalizedReviews;
};

/**
 * Normalize a single Hostaway review
 */
const normalizeHostawayReview = async (hostawayReview: any): Promise<Review | null> => {
  // Find guest by name
  const guest = database.guests.find(g => g.name === hostawayReview.guestName);
  if (!guest) {
    return null; // Skip reviews where guest cannot be mapped
  }

  // Find property by listing name
  const property = findPropertyByListingName(hostawayReview.listingName);
  if (!property) {
    return null; // Skip reviews where property cannot be mapped
  }

  // Map ratings from hostaway format to our format
  const ratings = {
    cleanliness: 0,
    communication: 0,
    check_in_experience: 0,
    listing_accuracy: 0,
    amenities: 0,
    location: 0,
    value_for_money: 0
  };

  hostawayReview.reviewCategory?.forEach((cat: any) => {
    if (ratings.hasOwnProperty(cat.category)) {
      ratings[cat.category as keyof typeof ratings] = cat.rating;
    }
  });

  // Calculate overall rating and determine source
  let overall_rating = 0;
  let overall_rating_source = 'hostaway';

  if (hostawayReview.rating !== null && hostawayReview.rating !== undefined) {
    overall_rating = hostawayReview.rating;
    overall_rating_source = 'hostaway';
  } else {
    const categoryValues = Object.values(ratings).filter(rating => rating > 0);
    if (categoryValues.length > 0) {
      overall_rating = categoryValues.reduce((sum, rating) => sum + rating, 0) / categoryValues.length;
      overall_rating_source = 'computed';
    }
  }

  // Set status (for demo, publish only originally published reviews)
  let reviewStatus = 'pending';
  if (hostawayReview.status === 'published') {
    reviewStatus = 'published';
  }

  return {
    id: hostawayReview.id.toString(),
    review_type: hostawayReview.type || 'guest-to-host',
    status: reviewStatus,
    submitted_at: hostawayReview.submittedAt,
    guest_id: guest.id,
    listing_id: property.id,
    host_id: property.host_id,
    channel: {
      name: 'hostaway',
      review_id: hostawayReview.id.toString()
    },
    public_review: hostawayReview.publicReview || '',
    overall_rating: Math.round(overall_rating * 10) / 10,
    overall_rating_source,
    ratings,
    ingested_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString()
  };
};

/**
 * Find property by listing name with fuzzy matching
 */
const findPropertyByListingName = (partialTitle: string): Property | null => {
  // Try exact match first
  let property = database.properties.find(prop => prop.title === partialTitle);
  
  if (!property) {
    // Special mapping for known hostaway listing names to our property titles
    const mappings: Record<string, string> = {
      "Apartment in City 15": "423374",
      "Villa in City 1": "AB-5005",
      "House in City 12": "D-1001",
      "Loft in City 13": "423374",
      "House in City 14": "D-1001",
      "Apartment in City 22": "423374",
      "Apartment in City 26": "AB-5005",
      "Loft in City 27": "D-1001",
      "Apartment in City 28": "423374",
      "Studio in City 100": "D-1001"
    };
    
    if (mappings[partialTitle]) {
      property = database.properties.find(prop => prop.id === mappings[partialTitle]);
    }
  }
  
  return property || null;
};

/**
 * Calculate average ratings for properties from published reviews
 */
const calculatePropertyRatings = (): void => {
  for (const property of database.properties) {
    const publishedReviews = database.reviews.filter(
      review => review.listing_id === property.id && review.status === 'published'
    );
    
    if (publishedReviews.length > 0) {
      const totalRating = publishedReviews.reduce((sum, review) => sum + review.overall_rating, 0);
      property.rating = Math.round((totalRating / publishedReviews.length) * 10) / 10;
      console.log(`Property ${property.id} (${property.title}): ${publishedReviews.length} published reviews, average rating: ${property.rating}`);
    } else {
      property.rating = null;
      console.log(`Property ${property.id} (${property.title}): No published reviews, rating: null`);
    }
  }
};

/**
 * Get database tables
 */
export const getDatabase = () => {
  if (!isInitialized) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return database;
};

/**
 * Reset database (useful for testing)
 */
export const resetDatabase = (): void => {
  database = {
    properties: [],
    hosts: [],
    guests: [],
    reviews: []
  };
  isInitialized = false;
};