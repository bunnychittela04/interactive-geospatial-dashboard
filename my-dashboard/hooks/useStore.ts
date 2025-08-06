import { create } from 'zustand';
import { Feature } from 'geojson';

export interface ColorRule {
  id: string; 
  minTemp: number;
  maxTemp: number;
  color: string;
}

export interface PolygonData {
  id: string;
  geoJson: Feature;
  color: string; 
  dataSource: 'temperature_2m'; 
  colorRules: ColorRule[];
}

interface State {
  polygons: PolygonData[];
  timeRange: [number, number];
}

interface Actions {
  addPolygon: (polygon: PolygonData) => void;
  updatePolygonRules: (polygonId: string, rules: ColorRule[]) => void;
  updatePolygonColor: (id: string, color: string) => void;
  deletePolygon: (id: string) => void; 
  setTimeRange: (range: [number, number]) => void;
}

export const useStore = create<State & Actions>((set) => ({
  polygons: [],
  timeRange: [Date.now() - 15 * 24 * 60 * 60 * 1000, Date.now() + 15 * 24 * 60 * 60 * 1000], 
  
  addPolygon: (polygon) =>
    set((state) => ({
      polygons: [...state.polygons, polygon],
    })),
  
  updatePolygonRules: (polygonId, newRules) =>
    set((state) => ({
      polygons: state.polygons.map((p) =>
        p.id === polygonId ? { ...p, colorRules: newRules } : p
      ),
    })),
  
  updatePolygonColor: (id, color) =>
    set((state) => ({
      polygons: state.polygons.map((p) =>
        p.id === id ? { ...p, color } : p
      ),
    })),

  deletePolygon: (id) => 
    set((state) => ({
      polygons: state.polygons.filter((p) => p.id !== id),
    })),
  
  setTimeRange: (range) =>
    set(() => ({
      timeRange: range,
    })),
}));