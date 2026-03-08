# RapidResQ – Intelligent Early Warning & Disaster Coordination System

An end-to-end hackathon prototype designed to bridge the gap between disaster early warnings, immediate citizen action, and coordinated volunteer rescue efforts.

---

## 🏗️ Core Technology Stack

- **Frontend**: React (Vite), Tailwind CSS (for styling and Dark Mode mapping), React Router (for navigation)
- **Backend**: Python, Django, Django REST Framework (DRF)
- **Database**: SQLite (default Django DB, easily swappable)
- **Map Integration**: Leaflet.js, React-Leaflet, Leaflet Routing Machine
- **External APIs**: 
  - OpenStreetMap (OSM) Nominatim API for Address Reverse-Geocoding
  - CartoDB Base Maps (Dark Matter Tiles)
- **Icons**: Lucide React
- **Notifications**: Native Browser HTML5 Notification API & Navigator Geolocation API

---

## 🚀 Key Features Implemented & Technologies Used

### 1. 🚨 Critical Alert System & Push Notifications
- **Functionality**: A global warning system that pushes active, high-risk meteorological alerts to all users.
- **Tech Used**: Django API (`Alert` model), React `useEffect` polling interval (checks every 10s for new alerts), HTML5 Browser Notification API.

### 2. 📍 Integrated Live Crisis Map & Safe Route Planner
- **Functionality**: A central dashboard displaying all active emergency reports, government alerts, registered volunteer teams, and shelter camps on an interactive map. It also features a "Safe Route Planner" that calculates paths avoiding the epicenters of reported disasters.
- **Tech Used**: `React-Leaflet` for the map canvas, `Leaflet Routing Machine` for road network calculations, CartoDB styling, and custom coordinate-avoidance logic to manipulate waypoints around danger zones.

### 3. 🔥 Emergency SOS & Automated Reporting
- **Functionality**: A giant, highly visible "1-Click" SOS button accessible from anywhere in the app that instantly captures the user's GPS format. Features a legal warning modal to deter false requests.
- **Tech Used**: HTML5 `navigator.geolocation`, React State Context, and the `Nominatim API` (Reverse Geocoding) to automatically convert raw coordinates (`Lat`, `Lng`) into readable street addresses/place names.

### 4. 🧠 AI Disaster Predictions Dashboard
- **Functionality**: A dedicated predictive dashboard simulating machine learning output. It forecasts upcoming disasters (floods, heatwaves, cyclones) by region, assigning occurrence probabilities, AI confidence scores, and automated safety recommendations.
- **Tech Used**: Tailwind CSS grid layouts, progress bars, and custom functional React filtering (`.filter` / `.map`) based on mocked complex data structures.

### 5. 👥 Role-Based Authentication & Dashboards
- **Functionality**: Users can browse anonymously, but registering allows them to select a role (`Citizen` vs. `Volunteer`). Volunteer roles get access to a protected Rescue Coordination Dashboard.
- **Tech Used**: Django REST Framework standard Token Authentication (`authtoken`), React `AuthContext`, LocalStorage for session persistence. 
- **Citizen Dashboard**: Fast-tracks SOS reporting by auto-filling known user profiles and using GPS.
- **Rescue Dashboard**: Allows volunteers to view "Pending" rescue operations, hit "Attend", and move the report to "Assigned/En-route".

### 6. 🚁 Live Navigation Tracking
- **Functionality**: In the Live Dashboard Route Planner, volunteers can click "Start Navigation" and watch their device be tracked live on the map while it adjusts the path via the safest routes.
- **Tech Used**: HTML5 `watchPosition` API updating React state continuously, passing dynamic start markers into the Leaflet Routing Machine.

### 7. 🤖 Interactive AI Chatbot (Mock)
- **Functionality**: An always-present floating chatbot wrapper that provides users with automated disaster mitigation instructions on-demand.
- **Tech Used**: React floating positioning (`fixed bottom right`), conditional rendering (`useState` for open/collapse), and simulated asynchronous typing delays (`setTimeout`).

### 8. 🌑 Global "Sleek" Dark Mode Theme
- **Functionality**: The entire application uses a modern, high-contrast dark theme utilizing deep slate backgrounds and glowing accent colors for easier viewing in emergency scenarios and at night.
- **Tech Used**: Tailwind CSS customized global variables (`index.css`) and a Node script to migrate the entire codebase from standard light defaults (`bg-white`, `text-gray-900`) to unified slate components.

### 9. 🏥 First Aid, Contacts, and Donation Hubs
- **Functionality**: Static but crucial informational hubs documenting life-saving first aid techniques (with dropdown accordions), a directory of vital emergency contacts, and a mock donation portal to funnel relief funds.
- **Tech Used**: React Router DOM (linking), Tailwind Accordion UI patterns, Mock UI forms.

---

## 📂 Project Structure

- **`/rapidresq_backend/`**: Django project container.
  - `alerts/`, `camps/`, `reports/`, `volunteers/`: Individual Django Apps handling specific domain logic, models, and REST endpoints.
- **`/rapidresq_frontend/`**: Vite + React frontend application.
  - `src/components/`: Reusable specific UI components (Map, SOS Button, ChatBot, Banners).
  - `src/pages/`: Complete dashboard pages tied to the React Router.
  - `src/context/`: Global state management (`AuthContext`).
  - `src/services/api.js`: Centralized Axios configuration for making authenticated requests to the backend.
