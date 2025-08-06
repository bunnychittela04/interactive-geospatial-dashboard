# Dynamic Data Dashboard

This is a dashboard built with Next.js, TypeScript, and a suite of modern libraries to visualize dynamic data on a map and timeline.

## Features

- **Interactive Timeline:** A dual-ended slider to select a time range.
- **Dynamic Map:** A fixed-zoom map that displays user-drawn polygons.
- **Polygon Drawing:** Tools to draw and manage polygons with a minimum of 3 and a maximum of 12 points.
- **Color-Coded Visualization:** Polygons change color based on fetched temperature data and user-defined rules.
- **API Integration:** Fetches data from the Open-Meteo API.

## Tech Stack

- **Framework:** Next.js (14.2)
- **Language:** TypeScript
- **UI/Components:** Ant Design
- **State Management:** Zustand
- **Mapping:** Leaflet & React-Leaflet
- **Drawing Tools:** Leaflet.draw

## Setup and Run Instructions

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd [your-repo-folder]
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Design & Development Remarks

- **State Management:** Zustand was chosen for its simplicity and minimal boilerplate, which is ideal for a focused project like this.
- **Map Library:** React-Leaflet was a straightforward choice for integrating Leaflet with React components.
- **Dynamic Updates:** The `useEffect` hook was used to efficiently listen for changes in the timeline state and trigger a re-render of the polygons with new data.

---
[Insert a screenshot of your finished dashboard here]