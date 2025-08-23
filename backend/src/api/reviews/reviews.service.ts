
import { getData, getById } from '../../core/service';
import { Review } from '../../core/types';
import { getDatabase } from '../../core/database';

export const getReviews = async (query: any) => {
    return getData<Review>('reviews', query);
}

export const getReviewById = async (id: string) => {
    const review = await getById<Review>('reviews', id);
    return {
        status: 'success',
        data: review
    }
}

export const updateReviewStatus = async (id: string, status: string) => {
    const database = getDatabase();
    const reviewIndex = database.reviews.findIndex(review => review.id === id);
    
    if (reviewIndex === -1) {
        return {
            status: 'error',
            message: 'Review not found'
        };
    }
    
    database.reviews[reviewIndex].status = status;
    
    return {
        status: 'success',
        data: database.reviews[reviewIndex],
        message: `Review status updated to ${status}`
    };
}
