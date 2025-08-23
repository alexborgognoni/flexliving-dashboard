export enum PropertyType {
  Apartment = "apartment",
  House = "house",
  Studio = "studio",
  Loft = "loft",
  Villa = "villa",
  Penthouse = "penthouse",
  Townhouse = "townhouse",
  Condo = "condo",
  Cabin = "cabin",
}

export enum Amenity {
  WiFi = "wifi",
  AirConditioning = "air_conditioning",
  Heating = "heating",
  Kitchen = "kitchen",
  Washer = "washer",
  Dryer = "dryer",
  Iron = "iron",
  HairDryer = "hair_dryer",
  TV = "tv",
  Parking = "parking",
  Pool = "pool",
  HotTub = "hot_tub",
  Gym = "gym",
  Elevator = "elevator",
  Balcony = "balcony",
  Terrace = "terrace",
  Garden = "garden",
  BBQ = "bbq",
  Fireplace = "fireplace",
  CoffeeMachine = "coffee_machine",
  Dishwasher = "dishwasher",
  Microwave = "microwave",
  Refrigerator = "refrigerator",
  Toaster = "toaster",
  HighChair = "high_chair",
  Crib = "crib",
}

export enum HouseRule {
  NoSmoking = "no_smoking",
  NoPets = "no_pets",
  NoPartiesOrEvents = "no_parties_or_events",
  SecurityDepositRequired = "security_deposit_required",
}

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
  type: PropertyType;
  bedrooms: number;
  images: string[];
  amenities: Amenity[];
  price: {
    amount: number;
    currency: string;
  };
  host_id: string;
  stay_policies: {
    check_in: string;
    check_out: string;
    house_rules: HouseRule[];
  };
  rating?: number; // Average rating computed from published reviews
}
