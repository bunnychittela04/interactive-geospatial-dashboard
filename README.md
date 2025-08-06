Interactive Geospatial Dashboard

This project implements a dynamic dashboard interface using React/Next.js and TypeScript. It visualizes data over an interactive map and timeline, supporting polygon creation and color-coded data display based on selected datasets.


Here's how the dashboard looks with a few drawn polygons and the timeline active:
<img width="1892" height="942" alt="Screenshot 2025-08-06 140203" src="https://github.com/user-attachments/assets/3c1f38c5-b257-48a2-84e3-2232ca8afb5e" />


Features

The dashboard includes the following key functionalities:

Timeline Slider (STEP 1):

A horizontal, dual-ended range slider at the top of the dashboard.

Allows users to select an hourly time window across a 30-day range (15 days before and after today).

Visually shows selected time(s) with daily marks.

Includes a Play/Pause button for automatic timeline advancement.




Interactive Map (STEP 2):

An embedded Leaflet map, centered on India.

Zoom is locked at a specific resolution (zoom level 6) as per requirements.

Maintains polygon visibility when the user moves the map.




Polygon Drawing Tools (STEP 3):

Users can define polygonal regions on the map using drawing controls.

Supports polygons with a minimum of 3 and a maximum of 12 points.

Polygons persist on the map after creation.

Users can view all drawn polygons in the sidebar and delete any polygon.





Data Source Selection in Sidebar (STEP 4):

A dedicated sidebar provides controls for each drawn polygon.

Currently uses Open-Meteo's temperature_2m as the mandatory data source.

Users can define threshold-based coloring rules using numerical inputs (Min/Max) and a color picker, similar to data filtering in spreadsheets.




Color Polygons Based on Data (STEP 5):

When a polygon is created or the timeline changes, its centroid is extracted.

Data is fetched for the current time range from Open-Meteo.

If the timeline range is more than 1 hour, the temperature values are averaged.

The polygon's color is dynamically updated based on the fetched average temperature and its defined color rules.







Open-Meteo API Connection (STEP 6):

Connects to https://archive-api.open-meteo.com/v1/archive.

Uses latitude, longitude (from polygon centroid), start date, end date, and hourly=temperature_2m parameters.








Dynamic Updates on Timeline Change (STEP 7):

When the timeline slider is adjusted (manually or via play button), all polygons automatically fetch updated data, re-apply color rules, and visually update on the map.








Tech Stack

Required:

React/Next.js: Frontend framework.

TypeScript: For type safety.

Zustand: Lightweight state management.

Leaflet & React-Leaflet: Mapping library.

Leaflet.draw & React-Leaflet-Draw: Drawing tools for Leaflet.

Ant Design: UI component library.








Implemented Optional/Liked:

date-fns: Date manipulation utilities.

uuid: For generating unique IDs.

@turf/turf: Geospatial analysis (e.g., centroid).

@ant-design/icons: Ant Design icon library.

@ant-design/nextjs-registry: Ant Design integration for Next.js App Router.









Setup and Run Instructions

Follow these steps to get the project running on your local machine:

1.Clone the repository:

git clone https://github.com/bunnychittela04/interactive-geospatial-dashboard.git
cd interactive-geospatial-dashboard

 <[your-repository-url](https://github.com/bunnychittela04/interactive-geospatial-dashboard.git)> 

2.Install Dependencies:
Navigate into your project directory and install all required packages. The --legacy-peer-deps flag is crucial for resolving potential peer dependency conflicts, especially with react-leaflet and React 18.

npm install --legacy-peer-deps
npm install @ant-design/icons # Ensure Ant Design icons are installed



3.Verify/Update next.config.mjs:
Ensure your next.config.mjs file is configured to transpile Ant Design.

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@ant-design'],
};

export default nextConfig;




4.Verify/Update app/layout.tsx:
Ensure your app/layout.tsx includes the AntdRegistry for proper Ant Design integration.

import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}




5.Run the Development Server:

npm run dev




6.Access the Dashboard:
Open your web browser and navigate to http://localhost:3000.




Troubleshooting Common Issues:
"Module not found" errors: Ensure you've run npm install --legacy-peer-deps in the correct my-dashboard directory.

ReferenceError: window is not defined or Element type is invalid: This indicates a client-side component is being rendered on the server. Ensure Map.tsx and Sidebar.tsx have export default and are imported dynamically with ssr: false in app/page.tsx.

Persistent errors after code changes: Perform a clean rebuild:

Ctrl + C # Stop the server
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install --legacy-peer-deps
npm run dev





--->Design and Development Remarks
State Management: Zustand was chosen for its simplicity, lightweight nature, and efficient global state management, which is ideal for managing the dynamic polygons array and timeRange.

Map Interaction & Drawing: react-leaflet and react-leaflet-draw provide robust features for interactive mapping and polygon creation. Careful configuration of FeatureGroup and EditControl ensures smooth drawing, "Finish" button functionality, and proper layer management upon deletion.

Dynamic Data Visualization: The useEffect hook within MapPolygons is the core of the dynamic coloring. It efficiently monitors changes in the timeline and polygon rules, triggering API calls to Open-Meteo and subsequent color updates based on the fetched average temperatures.

Modular Component Design: The application is structured into clear components (TimelineSlider, Map, Sidebar) that interact through the shared Zustand store, promoting maintainability and scalability.

Date Handling: date-fns simplifies complex date calculations and formatting, ensuring accurate representation of the timeline.

User Experience: The dashboard provides intuitive controls for drawing, managing polygons, and navigating the timeline, including a play/pause feature for animated data progression.
