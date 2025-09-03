# Ish's Miami Marlins Schedule App

## Setup Steps

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd miami-marlins-schedule-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## Project Architecture

### Tech Stack Choices
- **Vite + React + TypeScript**: Fast development with type safety
- **Material-UI**: Professional components with accessible design out of box
- **RTK Query**: Data fetching with automatic caching and real-time updates
- **MLB Stats API**: Official MLB data source for schedules and live game data

### Architecture Decisions
- **Component structure**: Separated pages from reusable components
- **CSS Grid Layout**: Custom grid system for optimal information display
- **API integration**: RTK Query handles schedule and live game data with TypeScript interfaces
- **State management**: Redux store for API state, local React state for UI interactions

### Key Features Implementation
- **Marlins.com UI**: Applied Marlins theme, font, colors
- **Real-time Schedule Data**: Displays all 11 Marlins affiliate teams across all league levels
- **Live Game Tracking**: Current inning, outs, active batter, and pitching information
- **Game State Management**: Handles Preview, Live, Final, and No Game states
- **Date Navigation**: Calendar picker with refresh functionality
- **League Level Display**: Interactive popover showing team league information
- **Error Handling**: Error boundaries and user-friendly error messages

### Development Process
1. Set up project foundation with Vite, TypeScript, and Material-UI
2. Integrated MLB Stats API with RTK Query and proper caching
3. Built comprehensive team mapping for all Marlins affiliates
4. Implemented 2x3 grid layout system for data presentation per wireframe
5. Added real-time live game data with current batter/pitcher tracking
6. Enhanced with date navigation, refresh functionality, and error handling

### MLB API Integration
- **Schedule Endpoint**: `https://statsapi.mlb.com/api/v1/schedule`
- **Live Game Feed**: `https://statsapi.mlb.com/api/v1.1/game/{gamePk}/feed/live`
- **Team Information**: `https://statsapi.mlb.com/api/v1/teams/{teamId}`

### Teams Covered
- Miami Marlins (MLB)
- Jacksonville Jumbo Shrimp (AAA)
- Pensacola Blue Wahoos (AA)
- Beloit Sky Carp (High-A)
- Jupiter Hammerheads (Low-A)
- FCL Marlins (Complex League)
- DSL Marlins (Dominican Summer League)
- Plus additional affiliate teams and training sites

### Long-Term Thinking: Possible Future Wins, Gains, 3 Steps Ahead Mindset
**Performance & Scale**
- Strategic caching policies based on timezone and traffic patterns
- CDN integration for faster global access
- Performance monitoring and optimization
- Advanced image formats and sources for RWD

**Enhanced User Experience**  
- Team logo integration with AWS S3 storage
- Mobile-first progressive web app
- Push notifications for game updates

**Data & Analytics**
- Historical schedule data and performance metrics
- User engagement tracking and personalization
- Advanced game statistics integration

**Technical Infrastructure**
- Improved CSS architecture with design system
- Comprehensive test coverage and CI/CD pipeline
- Multi-language support for international fans

### Missed Opportunities
1. Unit Testing: React/Jest Unit tests for code quality and delivery confidence ⚾ 🛡️🛡️ 💥💥 🚀🚀
2. On Base Diamond: Display runners on base using SVG and CSS Variables