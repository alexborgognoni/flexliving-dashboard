import { fetchAndNormalizeReviews } from "@/app/api/utils/reviewNormalizer";

// Helper function to get nested property value
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

// Helper function to apply filters
function applyFilters(reviews, filters) {
  return reviews.filter(review => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true; // Skip empty filters
      
      const reviewValue = getNestedValue(review, key);
      
      // Handle different types of filtering
      if (typeof reviewValue === 'string') {
        return reviewValue.toLowerCase().includes(value.toLowerCase());
      } else if (typeof reviewValue === 'number') {
        return reviewValue.toString().includes(value.toString());
      } else if (typeof reviewValue === 'boolean') {
        return reviewValue.toString() === value.toString();
      } else if (reviewValue && typeof reviewValue === 'object') {
        // For nested objects like channel, convert to string and search
        return JSON.stringify(reviewValue).toLowerCase().includes(value.toLowerCase());
      }
      
      return false;
    });
  });
}

// Helper function to apply sorting
function applySorting(reviews, sortBy, sortOrder = 'desc') {
  return [...reviews].sort((a, b) => {
    const aValue = getNestedValue(a, sortBy);
    const bValue = getNestedValue(b, sortBy);
    
    // Handle null/undefined values
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    // Handle different data types
    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else {
      // Convert to strings for comparison
      comparison = String(aValue).localeCompare(String(bValue));
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

// Helper function to apply pagination
function applyPagination(reviews, limit, offset) {
  const start = offset;
  const end = limit ? start + limit : reviews.length;
  return reviews.slice(start, end);
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    
    // Parse query parameters
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')) : null;
    const offset = url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')) : 0;
    const sortBy = url.searchParams.get('sort_by') || 'submitted_at';
    const sortOrder = url.searchParams.get('sort_order') || 'desc';
    
    // Parse filter parameters
    const filters = {};
    for (const [key, value] of url.searchParams.entries()) {
      // Skip pagination and sorting parameters
      if (!['limit', 'offset', 'sort_by', 'sort_order'].includes(key)) {
        filters[key] = value;
      }
    }
    
    // Fetch and normalize all reviews
    let reviews = await fetchAndNormalizeReviews();
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      reviews = applyFilters(reviews, filters);
    }
    
    // Get total count before pagination
    const totalCount = reviews.length;
    
    // Apply sorting
    reviews = applySorting(reviews, sortBy, sortOrder);
    
    // Apply pagination
    const paginatedReviews = applyPagination(reviews, limit, offset);
    
    // Calculate pagination metadata
    const hasMore = limit ? (offset + limit) < totalCount : false;
    const nextOffset = hasMore ? offset + limit : null;
    
    return Response.json({
      status: "success",
      data: paginatedReviews,
      meta: {
        total_count: totalCount,
        returned_count: paginatedReviews.length,
        limit: limit,
        offset: offset,
        has_more: hasMore,
        next_offset: nextOffset
      }
    });
    
  } catch (error) {
    console.error('Error in /api/reviews:', error);
    return Response.json(
      { 
        status: "fail", 
        message: "Failed to fetch reviews",
        error: error.message 
      },
      { status: 500 }
    );
  }
}