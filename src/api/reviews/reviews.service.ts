import { getData } from '../../core/service';
import { Review } from '../../core/types';

export const getReviews = (query: any) => {
    return getData<Review>('reviews', query);
}