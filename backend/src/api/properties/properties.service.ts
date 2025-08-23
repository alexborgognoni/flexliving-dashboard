
import { getData } from '../../core/service';
import { Property, Review } from '../../core/types';

export const getProperties = (query: any) => {
    return getData<Property>('properties', query);
}

export const getPropertyById = async (id: string) => {
    const properties = await getData<Property>('properties', {});
    const property = properties.data.find(p => p.id === id);
    return {
        status: 'success',
        data: property
    }
}

export const getPropertyReviews = async (propertyId: string) => {
    const reviews = await getData<Review>('reviews', {});
    const propertyReviews = reviews.data.filter(r => r.listing_id === propertyId);
    return {
        status: 'success',
        data: propertyReviews,
        meta: {
            totalCount: propertyReviews.length,
            averageRating: propertyReviews.length > 0 
                ? propertyReviews.reduce((sum, r) => sum + r.overall_rating, 0) / propertyReviews.length
                : 0
        }
    }
}
