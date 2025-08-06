'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useStore } from '@/hooks/useStore';
import { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-draw';
import { v4 as uuidv4 } from 'uuid';
import { centroid } from '@turf/turf';

// Fix for default Leaflet marker icons not showing up in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapPolygons = () => {
  const { polygons, timeRange, updatePolygonColor } = useStore();

  useEffect(() => {
    polygons.forEach(async (p) => {
      if (!p.colorRules || p.colorRules.length === 0) {
        updatePolygonColor(p.id, '#808080');
        return;
      }

      const polygonCentroid = centroid(p.geoJson);
      const [lon, lat] = polygonCentroid.geometry.coordinates;
      const startDate = new Date(timeRange[0]).toISOString().split('T')[0];
      const endDate = new Date(timeRange[1]).toISOString().split('T')[0];

      try {
        const response = await fetch(
          `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m`
        );
        const data = await response.json();

        let avgTemp = 0;
        if (data.hourly && data.hourly.temperature_2m) {
          const temps = data.hourly.temperature_2m;
          if (temps.length > 0) {
            avgTemp = temps.reduce((a: number, b: number) => a + b, 0) / temps.length;
          }
        }

        let newColor = '#3388ff';
        for (const rule of p.colorRules) {
          if (avgTemp >= rule.minTemp && avgTemp < rule.maxTemp) {
            newColor = rule.color;
            break;
          }
        }
        updatePolygonColor(p.id, newColor);

      } catch (error) {
        console.error('Error fetching data for polygon', p.id, error);
        updatePolygonColor(p.id, '#FF0000');
      }
    });
  }, [polygons, timeRange, updatePolygonColor]);

  return (
    <>
      {polygons.map((p) => (
        <GeoJSON
          key={p.id}
          data={p.geoJson as any}
          style={() => ({
            fillColor: p.color,
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
          })}
        />
      ))}
    </>
  );
};

const Map = () => {
  const featureGroupRef = useRef(null);
  const { addPolygon, deletePolygon } = useStore();

  const onCreated = (e: any) => {
    const { layer } = e;
    const latLngs = layer.getLatLngs()[0];

    if (latLngs.length >= 3 && latLngs.length <= 12) {
      const geoJson = layer.toGeoJSON();
      const newPolygon = {
        id: uuidv4(),
        geoJson: geoJson,
        color: '#3388ff',
        dataSource: 'temperature_2m' as const,
        colorRules: [
            { id: uuidv4(), minTemp: -999, maxTemp: 10, color: '#3366ff' },
            { id: uuidv4(), minTemp: 10, maxTemp: 25, color: '#ffff33' },
            { id: uuidv4(), minTemp: 25, maxTemp: 999, color: '#ff6633' },
        ],
      };
      addPolygon(newPolygon);
      // The `EditControl` will now automatically add the layer to the FeatureGroup.
    } else {
      alert('Polygon must have between 3 and 12 points.');
      // The `EditControl` will automatically handle removing the invalid layer.
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={6}
        minZoom={6}
        maxZoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={onCreated}
            draw={{
              polyline: false,
              marker: false,
              circlemarker: false,
              circle: false,
              rectangle: false,
              polygon: {
                allowIntersection: false,
                drawError: {
                  color: '#e10000',
                  message: '<strong>Error:</strong> Polygon edges cannot cross!',
                },
                shapeOptions: {
                  color: '#3388ff',
                },
              },
            }}
            edit={{
              featureGroup: featureGroupRef.current as any,
              remove: true,
              edit: false,
            }}
          />
          <MapPolygons />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default Map;