"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolateYlGnBu } from "d3-scale-chromatic";
import { Tooltip, Box, Typography } from "@mui/material";
import worldGeoJson from "@/utils/world-geo.json";

interface ChoroplethChartProps {
  data: {
    country: string; // ISO Alpha-3 code (e.g., ZMB)
    value: number;   // Market value in USD
  }[];
}

// Helper to format numbers like 1.2M or 3.4B
const formatUSD = (num: number): string => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

const ChoroplethChart: React.FC<ChoroplethChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value || 0), 0) || 1;
  const colorScale = scaleSequential(interpolateYlGnBu).domain([0, maxValue]);
  const dataMap = new Map(data.map((d) => [d.country, d.value]));

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1000px",
        mx: "auto",
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
        backgroundColor: "#f0f4f8",
      }}
    >
      <ComposableMap projection="geoEqualEarth" style={{ width: "100%", height: "auto" }}>
        <Geographies geography={worldGeoJson}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isoCode =
                geo.properties.ISO_A3 ||
                geo.id ||
                geo.properties["ISO3166-1-Alpha-3"];
              const value = dataMap.get(isoCode);
              const countryName = geo.properties.name;

              return (
                <Tooltip
                  key={geo.rsmKey}
                  title={
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Country: {countryName}
                      </Typography>
                      <Typography variant="caption">
                        Market Size in USD: {value ? `$${formatUSD(value)}` : "N/A"}
                      </Typography>
                    </Box>
                  }
                  arrow
                >
                  <Geography
                    geography={geo}
                    fill={value ? colorScale(value) : "#eaeaea"}
                    stroke="#ffffff"
                    strokeWidth={0.6}
                    style={{
                      default: { outline: "none", transition: "fill 0.3s ease" },
                      hover: {
                        outline: "none",
                        cursor: "pointer",
                        fill: "#f57c00",
                        stroke: "#424242",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                </Tooltip>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </Box>
  );
};

export default ChoroplethChart;
