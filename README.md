# Student Portfolio - Practical 2: State Management and Routing in React

An extended version of the B.Tech Student Portfolio web application, implementing client-side routing, React state management, theme customization, controlled form validation, and error boundaries.

## Features Implemented

### 1. Client-Side Routing (`react-router-dom` v6)
- Wrapped the app in `<BrowserRouter>` within [main.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/main.jsx).
- Defined multi-page navigation routes in [App.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/App.jsx) using `<Routes>` and `<Route>`.
- Replaced standard anchor tags (`<a>`) in [Navbar.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/components/Navbar.jsx) and [Header.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/components/Header.jsx) with `<NavLink>` and `<Link>` to transition pages seamlessly without full browser reloads.
- **Active Navigation Indicator**: Utilized NavLink's callback pattern to apply dynamic styling highlights to active sections.

### 2. Multi-Page Routes
- **Home Route (`/`)**: Renders the core portfolio sections ([Hero.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/components/Hero.jsx), [About.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/components/About.jsx), [Skills.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/components/Skills.jsx), and [Education.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/components/Education.jsx)) combined in a single [Home.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/components/Home.jsx) component.
- **Projects Route (`/projects`)**: Displays academic projects ([Projects.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/components/Projects.jsx)) dynamically with badge tags and action buttons.
- **Contact Route (`/contact`)**: Renders a dedicated contact form page with advanced state validation.
- **404 Not Found Route (`*`)**: Renders a custom space-themed fallback page ([NotFound.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/components/NotFound.jsx)) for undefined routing paths.

### 3. State Management Hooks (`useState` / `useEffect`)
- **Dark/Light Mode Theme Toggle**:
  - Controlled by a state variable `theme` in [App.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/App.jsx).
  - Syncs the theme class name (`light` / `dark`) with the document HTML root node `document.documentElement` and persists the selection in `localStorage`.
  - Added CSS design tokens and smooth transitions inside [index.css](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/index.css) and [App.css](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/App.css).
- **Controlled Contact Inputs**:
  - Implements state hook values for `name`, `email`, and `message` in [Contact.jsx](file:///d:/sem_4/AWDF/PRACTICAL/prc_1/student-portfolio/src/components/Contact.jsx).
  - **Live Preview Display**: Renders typed messages in real-time beneath input controls.
  - **Live Character Counter**: Tracks character length of the message box dynamically (up to 500 characters) and triggers warning styling as it nears constraints.
- **UI Visibility Toggle**:
  - State hook toggles a help tooltip box explaining form validation rules and data handling.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

1. Clone or navigate to the repository directory.
2. Install the necessary package dependencies:
   ```bash
   npm install
   ```
3. Run the Vite local development server:
   ```bash
   npm run dev
   ```
4. Build the application for production release:
   ```bash
   npm run build
   ```

---

## Developer Details
- **Student Name**: Parth Patoliya
- **College/Affiliation**: CHARUSAT University
- **Course**: Advanced Web Development Frameworks (ITUE301)
