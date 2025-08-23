
export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    channel: string;
    city: string;
    neighborhood: string;
    address: string;
  };
  type: string;
  bedrooms: number;
  images: string[];
  amenities: string[];
  price: {
    amount: number;
    currency: string;
  };
  availability: {
    calendar: {
      date: string;
      available: boolean;
    }[];
  };
  host_id: string;
  stay_policies: {
    check_in: string;
    check_out: string;
    house_rules: string[];
  };
}

export interface Host {
  id: number;
  name: string;
  avatar_url: string;
  joined_at: string;
}

export interface Guest {
  id: number;
  name: string;
  avatar_url: string;
  joined_at: string;
}

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
