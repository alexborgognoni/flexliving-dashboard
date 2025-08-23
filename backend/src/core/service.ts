import { Review, Property, Guest, Host } from './types';
import { getDatabase } from './database';

export const getData = async <T>(entityName: string, query: any): Promise<{ status: string; data: T[]; meta: any; }> => {
    const { sortBy, order = 'asc', limit = 10, offset = 0, status, minRating, maxRating, startDate, endDate, search, ...filters } = query;
    const database = getDatabase();
    
    // Get the appropriate data array
    let data: T[];
    switch (entityName) {
        case 'properties':
            data = database.properties as T[];
            break;
        case 'hosts':
            data = database.hosts as T[];
            break;
        case 'guests':
            data = database.guests as T[];
            break;
        case 'reviews':
            data = database.reviews as T[];
            break;
        default:
            throw new Error(`Unknown entity: ${entityName}`);
    }

    let filteredData = data;

    // Apply specific filters for reviews
    if (entityName === 'reviews') {
        filteredData = filteredData.filter((item: any) => {
            // Status filter
            if (status && status !== 'all' && item.status !== status) {
                return false;
            }
            
            // Rating range filter
            if (minRating !== undefined && item.overall_rating < parseFloat(minRating)) {
                return false;
            }
            if (maxRating !== undefined && item.overall_rating > parseFloat(maxRating)) {
                return false;
            }
            
            // Date range filter
            if (startDate || endDate) {
                const itemDate = new Date(item.submitted_at);
                if (startDate && itemDate < new Date(startDate)) {
                    return false;
                }
                if (endDate && itemDate > new Date(endDate)) {
                    return false;
                }
            }
            
            // Search filter
            if (search && !item.public_review.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }
            
            return true;
        });
    }

    // Apply general filters
    if (Object.keys(filters).length > 0) {
        filteredData = filteredData.filter((item: any) => {
            for (const key in filters) {
                if (item[key] !== filters[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    // Apply sorting
    if (sortBy) {
        filteredData.sort((a: any, b: any) => {
            if (a[sortBy] < b[sortBy]) {
                return order === 'asc' ? -1 : 1;
            }
            if (a[sortBy] > b[sortBy]) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    const totalCount = filteredData.length;
    const paginatedData = filteredData.slice(offset, offset + limit);

    return {
        status: 'success',
        data: paginatedData,
        meta: {
            totalCount,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: (parseInt(offset) + parseInt(limit)) < totalCount,
            sortBy,
            order,
            filters
        }
    };
};

export const getById = async <T>(entityName: string, id: string): Promise<T | null> => {
    const database = getDatabase();
    
    let data: any[];
    switch (entityName) {
        case 'properties':
            data = database.properties;
            break;
        case 'hosts':
            data = database.hosts;
            break;
        case 'guests':
            data = database.guests;
            break;
        case 'reviews':
            data = database.reviews;
            break;
        default:
            throw new Error(`Unknown entity: ${entityName}`);
    }
    
    return data.find((item: any) => item.id === id) || null;
};

export const getGuestByName = async (guestName: string): Promise<Guest | null> => {
    const database = getDatabase();
    return database.guests.find(guest => guest.name === guestName) || null;
};

export const getHostById = async (hostId: string): Promise<Host | null> => {
    return await getById<Host>('hosts', hostId);
};

export const getPropertyByPartialTitle = async (partialTitle: string): Promise<Property | null> => {
    const database = getDatabase();
    
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
        
        if (!property) {
            // Try fuzzy matching - remove common words and match key parts
            const cleanTitle = partialTitle.toLowerCase()
                .replace(/apartment|house|villa|studio|loft|in|city|\d+/gi, '')
                .trim();
            
            property = database.properties.find(prop => {
                const cleanPropTitle = prop.title.toLowerCase()
                    .replace(/apartment|house|villa|studio|loft|in|city|\d+/gi, '')
                    .trim();
                
                return cleanPropTitle.includes(cleanTitle) || cleanTitle.includes(cleanPropTitle);
            });
        }
    }
    
    return property || null;
};

export const getReviewsForProperty = async (propertyId: string): Promise<Review[]> => {
    const database = getDatabase();
    return database.reviews.filter(review => review.listing_id === propertyId);
};