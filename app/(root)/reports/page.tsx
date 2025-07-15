"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { format } from "date-fns";
import ChoroplethChart from "@/components/shared/ChoroplethChart";
import { formatUSD } from "@/utils/formatUSD";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CATEGORIES = [
  "Macroeconomic Overview",
  "Business Climate",
  "Investment Trends",
] as const;

type SupportedChartType = "bar" | "line" | "pie" | "combo" | "area" | "choropleth";

interface ChartMetadata {
  _id: string;
  name: string;
  chartType: SupportedChartType;
  chartSubtype?: string;
}

type ChartDataItem = { [key: string]: any };

export default function Reports() {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [charts, setCharts] = useState<{ metadata: ChartMetadata; data: ChartDataItem[] }[]>([]);
  const [selectedChart, setSelectedChart] = useState<{ metadata: ChartMetadata; data: ChartDataItem[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchCharts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/charts/distinct-names?category=${encodeURIComponent(selectedCategory)}`);
        const { names } = await res.json();

        const chartFetches = await Promise.all(
          names.map(async (name: string) => {
            const res = await fetch(`/api/charts/data?name=${encodeURIComponent(name)}`);
            const result = await res.json();
            return { metadata: result.metadata, data: result.data };
          })
        );

        setCharts(chartFetches);

        // Extract unique countries
        const countries = new Set<string>();
        chartFetches.forEach(({ data }) => {
          data.forEach((item: ChartDataItem) => {
  if (item.country) countries.add(item.country);
});

        });
        setAvailableCountries(["All", ...Array.from(countries).sort()]);
      } catch (err) {
        console.error("Chart fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, [selectedCategory]);

  const formatMonthYear = (input: string) => {
    try {
      return format(new Date(input), "MMM-yyyy");
    } catch {
      return input;
    }
  };

  const transformToChartJsData = (metadata: ChartMetadata, raw: ChartDataItem[]) => {
    const keys = Object.keys(raw[0] || {}).filter(k => !["_id", "__v", "metadataId"].includes(k));
    const xKey = keys.find(k =>
      ["display_month", "month_year", "date", "year", "x"].includes(k.toLowerCase())
    ) || keys[0];
    const yKeys = keys.filter(k => k !== xKey);

    const labels = raw.map(item => item.display_month || (item.month_year ? formatMonthYear(item.month_year) : item[xKey]));
    const datasets = yKeys.map((key, i) => {
      const color = `hsl(${i * 60}, 70%, 50%)`;
      return {
        label: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        data: raw.map(item => item[key]),
        backgroundColor: color,
        borderColor: color,
        pointBackgroundColor: color,
        fill: metadata.chartType === "area",
        tension: metadata.chartSubtype?.includes("spline") ? 0.4 : 0,
        ...(metadata.chartType === "combo" && {
          type: i % 2 === 0 ? "bar" : "line",
        }),
      };
    });

    return { labels, datasets };
  };

  const renderChart = (meta: ChartMetadata, data: ChartDataItem[]) => {
    const chartData = transformToChartJsData(meta, data);
    const baseOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: true,
          text: meta.name,
        },
      },
      layout: { padding: { top: 10, bottom: 10 } },
    };

    switch (meta.chartType) {
      case "bar":
        return <Bar data={chartData as ChartData<"bar">} options={baseOptions as ChartOptions<"bar">} />;
      case "line":
        return <Line data={chartData as ChartData<"line">} options={baseOptions as ChartOptions<"line">} />;
      case "area":
        const areaData = {
          ...chartData,
          datasets: chartData.datasets.map(ds => ({
            ...ds,
            fill: true,
            backgroundColor: ds.borderColor + "33",
          })),
        };
        return <Line data={areaData as ChartData<"line">} options={baseOptions as ChartOptions<"line">} />;
      case "pie":
        const pieData: ChartData<"pie"> = {
          labels: chartData.labels,
          datasets: [{
            label: meta.name,
            data: chartData.datasets[0]?.data || [],
            backgroundColor: chartData.datasets.map(ds => ds.borderColor),
          }],
        };
        return <Pie data={pieData} options={baseOptions as ChartOptions<"pie">} />;
      case "combo":
        const comboData = {
          ...chartData,
          datasets: chartData.datasets.map((ds, i) => ({
            ...ds,
            type: i % 2 === 0 ? "bar" : "line",
            borderWidth: 2,
            fill: false,
          })),
        };
        return <Bar data={comboData as ChartData<"bar">} options={baseOptions as ChartOptions<"bar">} />;
      case "choropleth":
        return (
          <ChoroplethChart
            data={data.map(d => ({ country: d.country, value: d.market_size_usd_ }))}
            onCountryClick={(code) => {
              const c = data.find(d => d.country === code);
              if (c) alert(`${code}: $${formatUSD(c.market_size_usd_)}`);
            }}
          />
        );
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  const filteredCharts = charts.map(({ metadata, data }) => ({
    metadata,
    data: selectedCountry === "All" ? data : data.filter(d => d.country === selectedCountry),
  }));

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 md:px-8 bg-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Reports & Analytics</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Country</InputLabel>
          <Select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {availableCountries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {loading ? (
        <p>Loading charts...</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {filteredCharts.map(({ metadata, data }) => (
            <div
              key={metadata._id}
              className="w-full sm:w-[48%] lg:w-[46%] xl:w-[44%] 2xl:w-[32%] p-4 border rounded shadow bg-gray-50 cursor-pointer"
              onClick={() => setSelectedChart({ metadata, data })}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-2">{metadata.name}</h3>
              <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden">
                {renderChart(metadata, data)}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedChart} onClose={() => setSelectedChart(null)} fullWidth maxWidth="lg">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {selectedChart?.metadata.name}
          <IconButton onClick={() => setSelectedChart(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%", height: "500px" }}>
            {selectedChart && renderChart(selectedChart.metadata, selectedChart.data)}
          </Box>
        </DialogContent>
      </Dialog>
    </main>
  );
}
