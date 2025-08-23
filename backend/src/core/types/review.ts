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

type ReviewCategory = {
  category: 'cleanliness' | 'communication' | 'location' | 'check_in_experience' | 'value_for_money' | 'amenities';
  rating: number;
};

type HostawayReview = {
  id: number;
  type: 'guest-to-host' | 'host-to-guest'
  status: 'awaiting' | 'pending' | 'scheduled' | 'submitted' | 'published' | 'expired';
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
};
