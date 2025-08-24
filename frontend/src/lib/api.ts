const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types matching backend
export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    channel: string;
    city: string;
    neighborhood: string;
    address: string;
  };
  type: string;
  bedrooms: number;
  images: string[];
  amenities: string[];
  price: {
    amount: number;
    currency: string;
  };
  availability?: {
    calendar: {
      date: string;
      available: boolean;
    }[];
  };
  host_id: string;
  stay_policies: {
    check_in: string;
    check_out: string;
    house_rules: string[];
  };
  rating?: number;
}

export interface Host {
  id: string;
  name: string;
  avatar_url: string;
  joined_at: string;
}

export interface Guest {
  id: string;
  name: string;
  avatar_url: string;
  joined_at: string;
}

export interface Review {
  id: string;
  review_type: string;
  status: string;
  submitted_at: string;
  guest_id: string;
  listing_id: string;
  host_id: string;
  channel: {
    name: string;
    review_id: string;
  };
  public_review: string;
  overall_rating: number;
  overall_rating_source: string;
  ratings: {
    cleanliness: number;
    communication: number;
    check_in_experience: number;
    listing_accuracy: number;
    amenities: number;
    location: number;
    value_for_money: number;
  };
  ingested_at: string;
  last_updated_at: string;
}

// API Functions
export async function fetchProperties(): Promise<Property[]> {
  const response = await fetch(`${API_BASE_URL}/properties`);
  if (!response.ok) throw new Error('Failed to fetch properties');
  const data = await response.json();
  return data.data;
}

export async function fetchProperty(id: string): Promise<Property | null> {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`);
  if (!response.ok) throw new Error('Failed to fetch property');
  const data = await response.json();
  return data.data;
}

export async function fetchPropertyReviews(propertyId: string, filters?: {
  status?: string;
  minRating?: number;
  maxRating?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}) {
  let url = `${API_BASE_URL}/properties/${propertyId}/reviews`;
  
  if (filters) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 'all') {
        params.append(key, value.toString());
      }
    });
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }
  
  console.log(`[Frontend] Fetching reviews: ${url}`);
  console.log('[Frontend] Filters:', filters);
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch property reviews');
  const data = await response.json();
  console.log(`[Frontend] Received ${data.data.length} reviews`);
  return data;
}

export async function fetchHost(hostId: string): Promise<Host | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/hosts?id=${hostId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.data.find((host: Host) => host.id === hostId) || null;
  } catch {
    return null;
  }
}

export async function fetchGuest(guestId: string): Promise<Guest | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/guests?id=${guestId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.data.find((guest: Guest) => guest.id === guestId) || null;
  } catch {
    return null;
  }
}

// Cache for host/guest names to avoid repeated API calls
const hostNameCache = new Map<string, string>();
const guestNameCache = new Map<string, string>();

export async function getHostName(hostId: string): Promise<string> {
  if (hostNameCache.has(hostId)) {
    return hostNameCache.get(hostId)!;
  }
  
  const host = await fetchHost(hostId);
  const name = host?.name || `Host ${hostId}`;
  hostNameCache.set(hostId, name);
  return name;
}

export async function getGuestName(guestId: string): Promise<string> {
  if (guestNameCache.has(guestId)) {
    return guestNameCache.get(guestId)!;
  }
  
  const guest = await fetchGuest(guestId);
  const name = guest?.name || `Guest ${guestId}`;
  guestNameCache.set(guestId, name);
  return name;
}

// Enhanced property data with resolved names
export interface PropertyWithNames extends Property {
  host_name?: string;
  reviewCount?: number;
  averageRating?: number;
}

export interface ReviewWithNames extends Review {
  guest_name?: string;
  host_name?: string;
}

export async function updateReviewStatus(reviewId: string, status: string): Promise<{ success: boolean; review?: ReviewWithNames; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to update review status' };
    }

    const data = await response.json();
    return { success: true, review: data.data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update review status' };
  }
}