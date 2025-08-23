
import { getData, getById, getReviewsForProperty } from '../../core/service';
import { Property } from '../../core/types';

export const getProperties = (query: any) => {
    return getData<Property>('properties', query);
}

export const getPropertyById = async (id: string) => {
    const property = await getById<Property>('properties', id);
    return {
        status: 'success',
        data: property
    }
}

export const getPropertyReviews = async (propertyId: string, query: any = {}) => {
    // First get all reviews for the property
    const allReviews = await getReviewsForProperty(propertyId);
    
    // Add the property filter to the query to filter by property ID
    const queryWithProperty = {
        ...query,
        listing_id: propertyId
    };
    
    // Use the core getData service with filters
    const filteredResult = await getData('reviews', queryWithProperty);
    
    // Calculate stats from all reviews for this property
    const publishedReviews = allReviews.filter(r => r.status === 'published');
    
    return {
        status: 'success',
        data: filteredResult.data,
        meta: {
            ...filteredResult.meta,
            totalCount: filteredResult.meta.totalCount,
            publishedCount: publishedReviews.length,
            averageRating: publishedReviews.length > 0 
                ? publishedReviews.reduce((sum, r) => sum + r.overall_rating, 0) / publishedReviews.length
                : 0
        }
    }
}
