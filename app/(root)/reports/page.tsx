"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
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
  country?: string;
}

type ChartDataItem = { [key: string]: any };

export default function Reports() {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [countries, setCountries] = useState<string[]>([]);

  const [charts, setCharts] = useState<{ metadata: ChartMetadata; data: ChartDataItem[] }[]>([]);
  const [selectedChart, setSelectedChart] = useState<{ metadata: ChartMetadata; data: ChartDataItem[] } | null>(null);
  const [loading, setLoading] = useState(false);

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

        // Extract country codes from metadata
        const countrySet = new Set<string>();
        chartFetches.forEach(({ metadata }) => {
          if (metadata.country) countrySet.add(metadata.country);
        });
        setCountries(["All", ...Array.from(countrySet)]);

        setCharts(chartFetches);
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
        legend: { display: true, position: "top" },
        title: { display: true, text: meta.name },
      },
      layout: { padding: { top: 10, bottom: 10 } },
    };

    switch (meta.chartType) {
      case "bar":
        return <Bar data={chartData as ChartData<"bar">} options={baseOptions as ChartOptions<"bar">} />;
      case "line":
        return <Line data={chartData as ChartData<"line">} options={baseOptions as ChartOptions<"line">} />;
      case "area":
        return (
          <Line
            data={{
              ...chartData,
              datasets: chartData.datasets.map(ds => ({
                ...ds,
                fill: true,
                backgroundColor: ds.borderColor + "33",
              })),
            }}
            options={baseOptions as ChartOptions<"line">}
          />
        );
      case "pie":
        return (
          <Pie
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  label: meta.name,
                  data: chartData.datasets[0]?.data || [],
                  backgroundColor: chartData.datasets.map(ds => ds.borderColor),
                },
              ],
            }}
            options={baseOptions as ChartOptions<"pie">}
          />
        );
      case "combo":
        return (
          <Bar
            data={{
              ...chartData,
              datasets: chartData.datasets.map((ds, i) => ({
                ...ds,
                type: i % 2 === 0 ? "bar" : "line",
                borderWidth: 2,
                fill: false,
              })),
            }}
            options={baseOptions as ChartOptions<"bar">}
          />
        );
      case "choropleth":
        return (
          <ChoroplethChart
            data={data.map(d => ({ country: d.country, value: d.market_size_usd_ }))}
            onCountryClick={code => {
              const c = data.find(d => d.country === code);
              if (c) alert(`${code}: $${formatUSD(c.market_size_usd_)}`);
            }}
          />
        );
      default:
        return <p>Unsupported chart type</p>;
    }
  };

  const filteredCharts = selectedCountry === "All"
    ? charts
    : charts.filter(chart => chart.metadata.country === selectedCountry);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 md:px-8 bg-white">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Reports & Analytics</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Category Filter */}
        <label className="flex-1">
          <span className="font-semibold">Category:</span>
          <select
            className="mt-1 w-full p-2 border rounded text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        {/* Country Filter */}
        <label className="flex-1">
          <span className="font-semibold">Country:</span>
          <select
            className="mt-1 w-full p-2 border rounded text-sm"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countries.map((countryCode) => (
              <option key={countryCode} value={countryCode}>
                {countryCode === "All" ? "All Countries" : countryCode}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading charts...</p>
      ) : (
        <div className="flex flex-wrap gap-6 mt-6">
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
    

      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">
          Sources for Zambia’s Macroeconomic Data
        </h2>

        <div className="space-y-6 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold">
              1. Gross Domestic Product (GDP) & Economic Growth
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <a
                  href="https://data.worldbank.org/country/zambia"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  World Bank Open Data – Zambia GDP
                </a>
              </li>
              <li>
                <a
                  href="https://www.macrotrends.net/global-metrics/countries/ZMB/zambia/gdp-gross-domestic-product"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  MacroTrends – Zambia GDP (1960–2025)
                </a>
              </li>
              <li>
                <a
                  href="https://www.imf.org/external/datamapper/profile/ZMB"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  IMF DataMapper – Zambia GDP Growth
                </a>
              </li>
              <li>
                <a
                  href="https://www.reuters.com/world/africa/zambia-targets-growth-rebound-after-worst-drought-living-memory-2024-09-27/"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Reuters – Growth Projections
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">2. Inflation Rate</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <a
                  href="https://tradingeconomics.com/zambia/inflation-cpi"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Trading Economics – Zambia CPI
                </a>
              </li>
              <li>
                <a
                  href="https://www.macrotrends.net/global-metrics/countries/ZMB/zambia/inflation-rate-cpi"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  MacroTrends – CPI (1986–2025)
                </a>
              </li>
              <li>
                <a
                  href="https://www.zamstats.gov.zm/"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  ZamStats – Official Inflation Reports
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">3. Exchange Rate</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <a
                  href="https://tradingeconomics.com/zambia/currency"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Trading Economics – Exchange Rate
                </a>
              </li>
              <li>
                <a
                  href="https://fred.stlouisfed.org/tags/series?t=zambia"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  FRED – ZMW/USD
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">4. Public Debt</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <a
                  href="https://www.mofnp.gov.zm/?page_id=3475"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Ministry of Finance – Debt Reports
                </a>
              </li>
              <li>
                <a
                  href="https://tradingeconomics.com/zambia/government-debt"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Trading Economics – Government Debt
                </a>
              </li>
              <li>
                <a
                  href="https://www.statista.com/statistics/532531/national-debt-of-zambia/"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Statista – Debt Trends
                </a>
              </li>
              <li>
                <a
                  href="https://www.ceicdata.com/en/indicator/zambia/government-debt--of-nominal-gdp"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  CEIC – Debt as % of GDP
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">
              5. Purchasing Managers' Index (PMI)
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <a
                  href="https://sponsorships.standardbank.com/static_file/CIB/PDF/2024/PMI/June2024/ZM_PMI_ENG_2407.pdf"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Stanbic Bank – June 2024 PMI
                </a>
              </li>
              <li>
                <a
                  href="https://www.stanbicbank.co.zm/static_file/Zambia/filedownloads/ZM_PMI_ENG_2303_LITE.pdf"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Stanbic Bank – March 2023 PMI
                </a>
              </li>
              <li>
                <a
                  href="https://tradingeconomics.com/zambia/composite-pmi"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Trading Economics – PMI Trends
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">6. Population & Growth Rate</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <a
                  href="https://www.macrotrends.net/global-metrics/countries/ZMB/zambia/population"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  MacroTrends – Population & Growth
                </a>
              </li>
              <li>
                <a
                  href="https://data.worldbank.org/indicator/SP.POP.GROW?locations=ZM"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  World Bank – Growth Rate
                </a>
              </li>
              <li>
                <a
                  href="https://www.worldometers.info/world-population/zambia-population/"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Worldometer – Projections
                </a>
              </li>
              <li>
                <a
                  href="https://www.zamstats.gov.zm"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  ZamStats – 2022 Census
                </a>
              </li>
              <li>
                <a
                  href="https://www.lusakatimes.com/2022/12/24/preliminary-data-shows-population-grew-from-13-1-million-in-2010-to-19-6-million-in-2022/"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Lusaka Times – Census Article
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
