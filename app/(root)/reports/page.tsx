'use client';

import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const Reports = () => {
  const [chartNames, setChartNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [chartData, setChartData] = useState<any>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('bar');

  useEffect(() => {
    fetch('/api/charts/distinct-names?category=Macroeconomic Overview')
      .then((res) => res.json())
      .then((data) => setChartNames(data.names));
  }, []);

  useEffect(() => {
    if (!selectedName) return;

    fetch(`/api/charts/data?name=${selectedName}`)
      .then((res) => res.json())
      .then((res) => {
        const { metadata, data } = res;
        setChartType(metadata.chartType);
        setChartData({
          labels: data.map((d: any) => d.x || d.date || 'N/A'),
          datasets: metadata.yKeys?.map((key: string, idx: number) => ({
            label: key,
            data: data.map((d: any) => d[key]),
            backgroundColor: `hsl(${idx * 50}, 70%, 50%)`,
            borderColor: `hsl(${idx * 50}, 70%, 50%)`,
            fill: chartType === 'line' ? false : true,
          })) || [],
        });
      });
  }, [selectedName]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dynamic Chart Viewer</h2>

      <select
        value={selectedName}
        onChange={(e) => setSelectedName(e.target.value)}
        className="mb-6 p-2 border"
      >
        <option value="">Select a Chart</option>
        {chartNames.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      {chartData && (
        <>
          {chartType === 'bar' && <Bar data={chartData} />}
          {chartType === 'line' && <Line data={chartData} />}
          {chartType === 'pie' && <Pie data={chartData} />}
        </>
      )}
    </div>
  );
};

export default Reports;
