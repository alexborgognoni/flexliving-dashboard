
import { getData, getById } from '../../core/service';
import { Review } from '../../core/types';

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
