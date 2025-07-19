"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolatePlasma } from "d3-scale-chromatic";
import { Box, Typography, useTheme } from "@mui/material";
import worldGeoJson from "@/utils/world-geo.json";

interface ChoroplethChartProps {
  data: {
    country: string; // ISO Alpha-3 code
    value: number;
    metric?: string; // Optional label (e.g., 'score' or 'market_size_usd_')
  }[];
  onCountryClick?: (countryCode: string) => void;
}

// Format e.g. 1.2K, 3.4M, 8.9B
const formatUSD = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return num.toString();
};

const ChoroplethChart: React.FC<ChoroplethChartProps> = ({ data, onCountryClick }) => {
  const theme = useTheme();
  const maxValue = Math.max(...data.map((d) => d.value || 0), 1);
  const colorScale = scaleSequential(interpolatePlasma).domain([0, maxValue]);
  const dataMap = new Map(data.map((d) => [d.country, d.value]));

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: theme.palette.background.paper,
        boxShadow: 4,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <ComposableMap
        projection="geoEqualEarth"
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={worldGeoJson}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isoCode =
                geo.properties.ISO_A3 ||
                geo.id ||
                geo.properties["ISO3166-1-Alpha-3"];
              const value = dataMap.get(isoCode);
              const countryName =
                geo.properties.NAME_LONG || geo.properties.name || isoCode;

              const record = data.find((d) => d.country === isoCode);
const fillColor = record ? colorScale(record.value) : "#eeeeee";

return (
  <g key={geo.rsmKey}>
  <title>
  {record
    ? `${countryName} – ${record.metric ?? "Value"}: $${formatUSD(record.value)}`
    : `${countryName} – No Data`}
</title>

    <Geography
      geography={geo}
      fill={fillColor}
      stroke="#ffffff"
      strokeWidth={0.5}
      style={{
        default: { outline: "none", transition: "fill 0.3s ease-in-out" },
        hover: {
          fill: "#f57c00",
          stroke: "#333",
          outline: "none",
          cursor: "pointer",
        },
        pressed: { fill: "#c62828", outline: "none" },
      }}
      onClick={() => {
        if (onCountryClick && isoCode) onCountryClick(isoCode);
      }}
    />
  </g>
);

              return (
              <g key={geo.rsmKey}>
    <title>
      {countryName} –{" "}
      {record ? `${record.metric || "Value"}: $${formatUSD(record.value)}` : "No Data"}
    </title>
    <Geography
      geography={geo}
      fill={fillColor}
      stroke="#ffffff"
      strokeWidth={0.5}
      style={{
        default: { outline: "none", transition: "fill 0.3s ease-in-out" },
        hover: {
          fill: "#f57c00",
          stroke: "#333",
          outline: "none",
          cursor: "pointer",
        },
        pressed: { fill: "#c62828", outline: "none" },
      }}
      onClick={() => {
        if (onCountryClick && isoCode) onCountryClick(isoCode);
      }}
    />
  </g>
);
            })
          }
        </Geographies>
      </ComposableMap>
    </Box>
  );
};

export default ChoroplethChart;
