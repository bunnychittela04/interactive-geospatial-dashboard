'use client';

import { Card, Button, InputNumber, Select, ColorPicker, Typography } from 'antd';
import { useStore, ColorRule } from '@/hooks/useStore';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const { Text } = Typography;
const { Option } = Select;

const Sidebar = () => {
  const { polygons, updatePolygonRules, deletePolygon } = useStore();

  return (
    <div style={{ padding: '16px', overflowY: 'auto' }}>
      <h2 style={{ marginBottom: '16px' }}>Polygons</h2>
      {polygons.length === 0 && (
        <p>Draw a polygon on the map to get started.</p>
      )}
      {polygons.map((polygon) => (
        <PolygonCard
          key={polygon.id}
          polygon={polygon}
          onUpdateRules={(newRules) => updatePolygonRules(polygon.id, newRules)}
          onDelete={() => deletePolygon(polygon.id)}
        />
      ))}
    </div>
  );
};

const PolygonCard = ({ polygon, onUpdateRules, onDelete }) => {
  const [rules, setRules] = useState<ColorRule[]>(polygon.colorRules);

  const handleRuleChange = (ruleId: string, field: keyof ColorRule, value: any) => {
    const newRules = rules.map((rule) =>
      rule.id === ruleId ? { ...rule, [field]: value } : rule
    );
    setRules(newRules);
    onUpdateRules(newRules); 
  };

  const addRule = () => {
    const newRule: ColorRule = {
      id: uuidv4(),
      minTemp: 0,
      maxTemp: 20,
      color: '#fff',
    };
    const newRules = [...rules, newRule];
    setRules(newRules);
    onUpdateRules(newRules);
  };

  const deleteRule = (ruleId: string) => {
    const newRules = rules.filter(rule => rule.id !== ruleId);
    setRules(newRules);
    onUpdateRules(newRules); 
  };

  return (
    <Card title={`Polygon ID: ${polygon.id.substring(0, 8)}`} style={{ marginBottom: '16px' }}>
      <Text strong>Data Source:</Text>
      <Select defaultValue={polygon.dataSource} style={{ width: '100%', marginBottom: '16px' }} disabled>
        <Option value="temperature_2m">Temperature at 2m</Option>
      </Select>

      <Text strong>Color Rules:</Text>
      {rules.map((rule) => (
        <Card key={rule.id} size="small" style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Text style={{ flexShrink: 0 }}>Min:</Text>
            <InputNumber
              value={rule.minTemp}
              onChange={(value) => handleRuleChange(rule.id, 'minTemp', value)}
              style={{ flex: 1, minWidth: '60px' }}
            />
            <Text style={{ flexShrink: 0 }}>Max:</Text>
            <InputNumber
              value={rule.maxTemp}
              onChange={(value) => handleRuleChange(rule.id, 'maxTemp', value)}
              style={{ flex: 1, minWidth: '60px' }}
            />
            <ColorPicker
              value={rule.color}
              onChange={(value) => handleRuleChange(rule.id, 'color', value.toHexString())}
              style={{ flexShrink: 0 }}
            />
            <Button danger size="small" onClick={() => deleteRule(rule.id)} style={{ flexShrink: 0 }}>X</Button>
          </div>
        </Card>
      ))}
      <Button onClick={addRule} style={{ marginTop: '8px', width: '100%' }}>
        Add Rule
      </Button>
      <Button type="primary" danger onClick={onDelete} style={{ marginTop: '16px', width: '100%' }}>
        Delete Polygon
      </Button>
    </Card>
  );
};

export default Sidebar;