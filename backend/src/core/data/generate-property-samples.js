const propertyTypes = ["apartment", "house", "studio", "loft", "villa"];
const amenities = ["wifi", "air_conditioning", "heating", "kitchen", "washer", "dryer", "iron", "hair_dryer", "tv", "parking"];
const houseRules = ["no_smoking", "no_pets", "no_parties_or_events", "security_deposit_required"];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Function to pad host ID to 5 digits
function formatHostId(number) {
  return "200" + number.toString().padStart(2, "0");
}

function generateProperty(id) {
  const type = getRandomElement(propertyTypes);
  const hostNumber = Math.floor(Math.random() * 20) + 1; // 1–20
  const hostId = formatHostId(hostNumber);
  const price = Math.floor(Math.random() * 100) + 50;

  return {
    id: (10000 + id).toString(),
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} in City ${id}`,
    description: `A beautiful ${type} located in the heart of the city.`,
    location: {
      channel: getRandomElement(["Airbnb", "Booking.com", "Vrbo"]),
      city: getRandomElement(["Paris", "Berlin", "New York", "Tokyo", "London"]),
      neighborhood: getRandomElement(["Downtown", "Uptown", "Suburbs"]),
      address: `${id} Main St, City ${id}`
    },
    type,
    bedrooms: Math.floor(Math.random() * 3) + 1,
    images: [
      `https://example.com/images/${10000 + id}-1.jpg`,
      `https://example.com/images/${10000 + id}-2.jpg`
    ],
    amenities: [getRandomElement(amenities), getRandomElement(amenities)],
    price: {
      amount: price,
      currency: "USD"
    },
    host_id: hostId,
    stay_policies: {
      check_in: "15:00",
      check_out: "11:00",
      house_rules: [getRandomElement(houseRules), getRandomElement(houseRules)]
    }
  };
}

const properties = Array.from({ length: 100 }, (_, i) => generateProperty(i + 1));
console.log(JSON.stringify(properties, null, 2));
