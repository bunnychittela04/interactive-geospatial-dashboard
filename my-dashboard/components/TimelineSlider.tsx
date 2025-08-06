'use client';

import { Slider, Typography } from 'antd';
import { useStore } from '@/hooks/useStore';
import { format, addHours, differenceInHours, startOfDay, addDays } from 'date-fns';

const { Text } = Typography;

const TimelineSlider = () => {
  const { timeRange, setTimeRange } = useStore();
  
  // Define the fixed 30-day window
  const minTime = startOfDay(Date.now() - 15 * 24 * 60 * 60 * 1000).getTime(); // Start of day 15 days ago
  const maxTime = startOfDay(Date.now() + 15 * 24 * 60 * 60 * 1000).getTime(); // Start of day 15 days from now

  // Generate marks for each day within the 30-day window
  const marks: { [key: number]: string } = {};
  let currentMarkDate = new Date(minTime);
  while (currentMarkDate.getTime() <= maxTime) {
    marks[currentMarkDate.getTime()] = format(currentMarkDate, 'MMM d');
    currentMarkDate = addDays(currentMarkDate, 1); // Move to the next day
  }

  // Ensure the current selected range is within the min/max bounds
  const currentRange = [
    Math.max(timeRange[0], minTime),
    Math.min(timeRange[1], maxTime)
  ];

  return (
    <div style={{ width: '90%', padding: '0 50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Text strong style={{ marginBottom: '10px' }}>
        Selected Range: {format(currentRange[0], 'MMM dd, HH:00')} to {format(currentRange[1], 'MMM dd, HH:00')}
      </Text>
      <Slider
        range
        value={currentRange} // Use currentRange to ensure values are within bounds
        min={minTime}
        max={maxTime}
        step={3600000} // Hourly resolution (1 hour in milliseconds)
        marks={marks}
        tooltip={{
          formatter: (value) => value ? format(value, 'MMM dd, HH:00') : '',
        }}
        onChange={(value) => setTimeRange(value as [number, number])}
        style={{ width: '100%' }} // Ensure slider takes full width of its container
      />
    </div>
  );
};

export default TimelineSlider;