
import { getDatabase } from '../../core/database';
import { Review } from '../../core/types';

export const getHostawayReviews = async () => {
    const database = getDatabase();
    
    // Filter reviews by channel name = 'hostaway'
    const hostawayReviews = database.reviews.filter((review: Review) => 
        review.channel && review.channel.name === 'hostaway'
    );
    
    return hostawayReviews;
};
