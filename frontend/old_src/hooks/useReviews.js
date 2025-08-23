import { useQuery } from '@tanstack/react-query';

async function fetchReviews({ 
  listingId, 
  status, 
  limit, 
  offset = 0, 
  sortBy = 'submitted_at', 
  sortOrder = 'desc',
  ...filters 
}) {
  const params = new URLSearchParams();
  
  // Add filters
  if (listingId) params.append('listing_id', listingId);
  if (status) params.append('status', status);
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());
  if (sortBy) params.append('sort_by', sortBy);
  if (sortOrder) params.append('sort_order', sortOrder);
  
  // Add any additional filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const response = await fetch(`/api/reviews?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (data.status !== 'success') {
    throw new Error(data.message || 'Failed to fetch reviews');
  }
  
  return data;
}

export function useReviews(options = {}) {
  const {
    listingId,
    status = 'published',
    limit,
    offset = 0,
    sortBy = 'submitted_at',
    sortOrder = 'desc',
    enabled = true,
    ...filters
  } = options;
  
  return useQuery({
    queryKey: ['reviews', { listingId, status, limit, offset, sortBy, sortOrder, ...filters }],
    queryFn: () => fetchReviews({ listingId, status, limit, offset, sortBy, sortOrder, ...filters }),
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook specifically for property reviews (maintains backward compatibility)
export function usePropertyReviews(listingId, options = {}) {
  return useReviews({
    listingId,
    status: 'published',
    ...options,
    enabled: !!listingId && options.enabled !== false
  });
}