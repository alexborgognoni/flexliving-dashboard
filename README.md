# Flex Living - Reviews Dashboard

## Developer Assessment Submission

A comprehensive reviews management dashboard for Flex Living property managers, featuring Hostaway integration, review analytics, and public display management.

## Tech Stack

The decision about which stack to use was made with a tradeoff of time and quality in mind.
A dedicated frontend/backend architecture seemed reasonable and the choice for Express over a proper framework like Laravel was made to keep initial development time low.

### Frontend

- **Next.js 15.5.0** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **TypeScript** - Type-safe JavaScript

## Assessment Requirements Fulfilled

### 1. Hostaway Integration (Mocked) ✅

- **API Route Implementation**: `GET /api/reviews/hostaway` - Returns normalized Hostaway review data
- **Data Normalization**: Converts raw Hostaway JSON format to standardized internal structure
- **Multi-Source Processing**: Handles reviews from different channels and listing types
- **Robust Parsing**: Fuzzy matching for property/guest mapping with fallback handling

### 2. Manager Dashboard ✅

- **Property Performance Overview**: Dashboard table showing ratings, review counts, and trends
- **Advanced Filtering**: Filter by rating range, review count, trend direction, and search
- **Sorting Capabilities**: Sort by any column (property, rating, reviews, trend, host)
- **Trend Analysis**: Visual trend indicators (Rising/Lowering/Stable) with period-based calculation
- **Publication Management**: Control reviews' public visibility with a dedicated toggle in the review details
- **Detailed Analytics**: Per-property insights page with category breakdowns and charts
- **Hot Reload**: Updates the analytics in real-time based on the current reviews filter set

### 3. Review Display Page ✅

- **Public Property Pages**: Consistent with Flex Living design patterns
- **Approved Reviews Only**: Only displays manager-approved reviews marked as "published"
- **Guest Review Section**: Dedicated section within property layout
- **Responsive Design**: Clean, modern interface with proper typography and spacing

### 4. Google Reviews Integration ❌

- **Status**: Not implemented in this assessment
- **Reasoning**: Focused on core Hostaway integration and dashboard functionality. Was not able to properly map the Google Places API review structure to our format due to time constraints. This is very much possible, though.

## Key Design and Logic Decisions

### Database Architecture

An abstraction layer was created such that data is loaded/written from simple in-memory javascript objects.
This can be replaced with any database logic in the future.

- **In-Memory Database Simulation**: Uses JavaScript objects instead of a traditional database for simplicity and rapid development
- **Startup Initialization**: Database is populated and processed on server startup rather than per-request
- **Data Normalization**: Hostaway review format is normalized to internal format during initialization

### Review Processing Logic

- **Guest Name Mapping**: Uses fuzzy string matching to map Hostaway guest names to internal guest database
- **Property Matching**: Matches Hostaway listing names to internal properties using string manipulation and fuzzy logic
- **Review Filtering**: Only keeps reviews that can be successfully mapped to both guests and properties
- **Status Management**: All reviews default to "unpublished" status except if "published" on hostaway (for demo reasons)
- **Rating Calculation**:
  - Uses provided overall_rating when available
  - Computes from category averages when overall_rating is null
  - Updates rating_source field accordingly

### Property Rating System

- **Dynamic Calculation**: Property ratings are calculated as averages of all published reviews
- **Real-time Updates**: Ratings are recalculated during database initialization
- **Fallback Logic**: Uses existing property rating if no published reviews exist

This naive rating logic is subject to change in the future.

### Trend Calculation System

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
http://localhost:3000/ -> Frontend
http://localhost:8000/api -> Backend
```

### Endpoints

#### Assessment Required Routes

- **GET /api/reviews/hostaway** - Hostaway integration endpoint ✅
  - Returns normalized review data from Hostaway mock data
  - Response: `{ status: "success", data: Review[], meta: { totalCount: number, sourceCount: number, mappingSuccessRate: string } }`
  - Includes data processing statistics, normalization results, and mapping success rate

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

## Local Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/alexborgognoni/flexliving-dashboard
cd flexliving-dashboard
```

2. **Install dependencies**

```bash
npm run install # Custom script to install both frontend & backend node_modules
```

### Running the Application

For production build (currently still broken, please use dev script to test):

```bash
npm run build
npm run start
```

For a development server:

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

The build even for development server might take over 10 seconds.
This can be reduced significantly by using turbopack; however, their newest release might cause issues on some machines, that's why it's disabled by default.

### Verification

1. **Test backend API**:

```bash
curl http://localhost:8000/api/properties
```

2. **Access frontend**:
   Open `http://localhost:3000` in your browser

### Available Pages

#### Manager Dashboard (Assessment Requirement #2)

- **Dashboard Overview**: `http://localhost:3000/dashboard` - Property performance table with filtering and sorting
- **Property Insights**: `http://localhost:3000/dashboard/properties/[propertyID]` - Detailed analytics, trend analysis, and review management

#### Public Review Display (Assessment Requirement #3)

- **Property Details**: `http://localhost:3000/properties/[propertyID]` - Public-facing property page with approved reviews section

#### API Testing

- **Hostaway Reviews**: `http://localhost:8000/api/reviews/hostaway` - Test the required normalization endpoint
- **Property Reviews**: `http://localhost:8000/api/properties/[propertyID]/reviews` - Test review filtering and sorting

#### Sample Property IDs for Testing

- `423374` - Appartement 2 Chambres Spacieux à Dély Ibrahim
- `D-1001` - Charming Studio in Central Paris
- `AB-5005` - Cozy 3BR Villa with Pool in Lisbon
