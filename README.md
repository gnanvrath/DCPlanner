# DC Planner — Museums Showcase

A small React app to browse and plan museum visits in Washington, D.C.

Features
- Museums grouped and filterable by category: Art, Science, History, Other
- Filter by organization, price (free/paid), and booking requirement
- Search by name or description
- Add museums to a simple planner (saved in localStorage)
- Sample JSON dataset you can extend

Quick start
1. Install dependencies:
   npm install

2. Run the dev server:
   npm start

3. Build for production:
   npm run build

Data
- Sample data lives in public/data/museums.json.
- Each museum entry fields:
  - id (string)
  - name (string)
  - organization (string)
  - category (one of: Art, Science, History, Other)
  - description (string)
  - address (string)
  - free (boolean)
  - booking_required (boolean)
  - website (string)
  - hours (string)
  - tags (array of strings)
  - lat, lng (optional for map)

Extending
- Add more museums to public/data/museums.json.
- Add a backend later to support booking links and real-time availability.

Notes / Next steps
- Integrate a map (Leaflet) and clustering for nearby museums.
- Add user accounts and sync planner between devices.
- Add filters for accessibility features and family-friendly attributes.

License: MIT