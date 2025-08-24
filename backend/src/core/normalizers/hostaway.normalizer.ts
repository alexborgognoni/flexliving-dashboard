
import { Review, Property, Host, Guest } from '../types';

interface HostawayReview {
    id: number;
    type: string;
    status: string;
    rating: number | null;
    publicReview: string;
    reviewCategory: {
        category: string;
        rating: number;
    }[];
    submittedAt: string;
    guestName: string;
    listingName: string;
}

export const normalizeHostawayReview = (hostawayReview: HostawayReview, properties: Property[], hosts: Host[], guests: Guest[]): Review => {
    const ratings: { [key: string]: number } = {};
    hostawayReview.reviewCategory.forEach(category => {
        ratings[category.category] = category.rating;
    });

    const property = properties.find(p => p.title === hostawayReview.listingName);
    const guest = guests.find(g => g.name === hostawayReview.guestName);
    const host = property ? hosts.find(h => h.id.toString() === property.host_id) : undefined;

    return {
        id: hostawayReview.id.toString(),
        review_type: hostawayReview.type,
        status: hostawayReview.status === 'published' ? 'published' : 'unpublished',
        submitted_at: new Date(hostawayReview.submittedAt).toISOString(),
        guest_id: guest ? guest.id.toString() : 'unknown',
        listing_id: property ? property.id : 'unknown',
        host_id: host ? host.id.toString() : 'unknown',
        channel: {
            name: 'hostaway',
            review_id: hostawayReview.id.toString(),
        },
        public_review: hostawayReview.publicReview,
        overall_rating: hostawayReview.rating || 0,
        overall_rating_source: 'channel',
        ratings: {
            cleanliness: ratings.cleanliness || 0,
            communication: ratings.communication || 0,
            check_in_experience: ratings.check_in_experience || 0,
            listing_accuracy: ratings.listing_accuracy || 0,
            amenities: ratings.amenities || 0,
            location: ratings.location || 0,
            value_for_money: ratings.value_for_money || 0,
        },
        ingested_at: new Date().toISOString(),
        last_updated_at: new Date().toISOString(),
    };
};
