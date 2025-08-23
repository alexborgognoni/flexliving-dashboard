
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

export const getPropertyReviews = async (propertyId: string) => {
    const reviews = await getReviewsForProperty(propertyId);
    const publishedReviews = reviews.filter(r => r.status === 'published');
    
    return {
        status: 'success',
        data: reviews,
        meta: {
            totalCount: reviews.length,
            publishedCount: publishedReviews.length,
            averageRating: publishedReviews.length > 0 
                ? publishedReviews.reduce((sum, r) => sum + r.overall_rating, 0) / publishedReviews.length
                : 0
        }
    }
}
