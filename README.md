# The Flex Property Reviews Dashboard

A comprehensive dashboard for managing and analyzing property reviews from Hostaway, designed for The Flex property management platform.

## Tech Stack

### Frontend
- **Next.js 15.5.0** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hooks** - useState, useEffect, useMemo, useCallback for state management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **TypeScript** - Type-safe JavaScript
- **CORS** - Cross-origin resource sharing
- **ts-node-dev** - Development server with hot reload

### Data Layer
- **JavaScript Objects** - In-memory database simulation
- **JSON-to-JS Migration** - Converted from JSON files for better database simulation

## Key Design and Logic Decisions

### Database Architecture
- **In-Memory Database Simulation**: Uses JavaScript objects instead of a traditional database for simplicity and rapid development
- **Startup Initialization**: Database is populated and processed on server startup rather than per-request
- **Data Normalization**: Hostaway review format is normalized to internal format during initialization

### Review Processing Logic
- **Guest Name Mapping**: Uses fuzzy string matching to map Hostaway guest names to internal guest database
- **Property Matching**: Matches Hostaway listing names to internal properties using string manipulation and fuzzy logic
- **Review Filtering**: Only keeps reviews that can be successfully mapped to both guests and properties
- **Status Management**: All reviews default to "pending" status, with demo logic for published reviews
- **Rating Calculation**: 
  - Uses provided overall_rating when available
  - Computes from category averages when overall_rating is null
  - Updates rating_source field accordingly

### Property Rating System
- **Dynamic Calculation**: Property ratings are calculated as averages of all published reviews
- **Real-time Updates**: Ratings are recalculated during database initialization
- **Fallback Logic**: Uses existing property rating if no published reviews exist

### Trend Calculation System
- **Consistent Algorithm**: Both dashboard and insights pages use identical trend calculation logic
- **Unfiltered Data**: Trends are calculated using the complete, unfiltered review dataset for accuracy
- **Period-Based Comparison**: Reviews are split into recent and older periods (50/50 split by date)
- **Threshold-Based Classification**: 
  - "Rising" when recent average > older average by 0.1+ points
  - "Lowering" when recent average < older average by 0.1+ points  
  - "Stable" when difference is within ±0.1 points
- **Minimum Data Requirement**: Requires at least 2 reviews for meaningful trend analysis

### Frontend Data Flow
- **API Abstraction**: Centralized API utilities in `/lib/api.ts` with TypeScript interfaces
- **Name Resolution**: Host and guest IDs are resolved to names throughout the UI
- **Caching Strategy**: Host/guest names are cached to avoid repeated API calls
- **Progressive Enhancement**: Graceful fallbacks when names cannot be resolved
- **Trend Consistency**: Dashboard table and insights hero section display identical trends by using the same unfiltered dataset
- **Filter-Based Ratings**: Category ratings in insights page reflect filtered data while overall trend remains based on complete data

### Component Architecture
- **Page-Level Data Fetching**: Each page handles its own data requirements
- **Reusable Components**: Modular UI components for consistency
- **Type Safety**: Comprehensive TypeScript interfaces matching backend data structures

## API Behaviors

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### Properties
- **GET /properties** - List all properties
  - Returns: `{ status: "success", data: Property[], meta: { totalCount: number } }`
  - Includes calculated ratings from published reviews

- **GET /properties/:id** - Get single property
  - Returns: `{ status: "success", data: Property }`

- **GET /properties/:id/reviews** - Get reviews for property
  - Returns: `{ status: "success", data: Review[], meta: { totalCount: number, averageRating: number } }`
  - Supports optional query parameters for filtering (status, rating range, date range, search, sorting)
  - Returns filtered data in `data` array while `meta.averageRating` reflects all published reviews
  - Only returns reviews that could be mapped during normalization

#### Hosts
- **GET /hosts** - List all hosts
  - Query params: `?id=hostId` for filtering
  - Returns: `{ status: "success", data: Host[], meta: { totalCount: number } }`

- **GET /hosts/:id** - Get single host
  - Returns: `{ status: "success", data: Host }`

#### Guests  
- **GET /guests** - List all guests
  - Query params: `?id=guestId` for filtering
  - Returns: `{ status: "success", data: Guest[], meta: { totalCount: number } }`

- **GET /guests/:id** - Get single guest
  - Returns: `{ status: "success", data: Guest }`

#### Reviews
- **GET /reviews** - List all reviews
  - Returns: `{ status: "success", data: Review[], meta: { totalCount: number } }`
  - Only includes successfully normalized reviews

### Data Processing Pipeline
1. **Startup**: Server loads JavaScript data files
2. **Normalization**: Hostaway reviews are processed and normalized
3. **Mapping**: Reviews mapped to guests/properties using fuzzy matching
4. **Filtering**: Unmappable reviews are discarded
5. **Rating Calculation**: Property ratings computed from published reviews
6. **API Ready**: Endpoints serve processed, normalized data

## Local Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd FlexDashboard/code
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the backend server** (Terminal 1)
```bash
cd backend
npm run dev
```
Backend will be available at `http://localhost:8000`

2. **Start the frontend development server** (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will be available at `http://localhost:3000`

### Verification

1. **Test backend API**:
```bash
curl http://localhost:8000/api/properties
```

2. **Access frontend**:
Open `http://localhost:3000` in your browser

### Available Pages

- **Dashboard**: `http://localhost:3000/dashboard` - Property overview with ratings and host names
- **Property Insights**: `http://localhost:3000/dashboard/properties/[propertyID]` - Detailed analytics and reviews
- **Property Details**: `http://localhost:3000/properties/[propertyID]` - Public property view with guest reviews

### Development Notes

- **Hot Reload**: Both frontend and backend support hot reload during development
- **TypeScript**: Full TypeScript support with type checking
- **CORS**: Backend configured to accept requests from frontend
- **Data**: Uses sample data from JavaScript files in `/backend/src/core/data/`
- **Database**: No external database required - uses in-memory JavaScript objects

### Sample Property IDs for Testing
- `423374` - Appartement 2 Chambres Spacieux à Dély Ibrahim
- `D-1001` - Charming Studio in Central Paris  
- `AB-5005` - Cozy 3BR Villa with Pool in Lisbon
