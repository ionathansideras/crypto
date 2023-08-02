import React from "react";
import { redirect, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";
import {
  Chart as Chartjs,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";

Chartjs.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
);

export default function Ditails() {
  const location = useLocation(); // React Router's useLocation hook to access state from the previous page
  const { id } = location.state; // Extracting the "id" from the state

  // States to store the coin data and color themes
  const [datacoin, setData] = useState([]);
  const { backColor } = location.state;
  const { elColor } = location.state;
  const { background } = location.state;

  useEffect(() => {
    // Fetch coin data using the provided "id"
    fetch(`https://api.coinlore.net/api/ticker/?id=${id}`)
      .then((response) => response.json())
      .then((all) => setData(all))
      .catch((err) => console.log(err));
  }, []);

  const data = {
    labels: ["Before 7d", "Before 24h", "Before 1h"],
    datasets: [
      {
        label: "Percent change",
        data: datacoin.length
          ? [
              +datacoin[0].percent_change_7d,
              +datacoin[0].percent_change_24h,
              +datacoin[0].percent_change_1h,
            ]
          : [],
        backgroundColor: "red", // This color will be overridden by the "options" below
        borderColor: "red", // This color will be overridden by the "options" below
        pointBorderColor: "black", // This color will be overridden by the "options" below
      },
    ],
  };

  const options = {
    plugins: {
      legend: true,
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  };

  return (
    <div style={{ backgroundColor: background }} className="allstats">
      <header className="titlename">
        <h1
          style={{
            color: elColor, // Set the title color based on the theme
          }}
        >
          {datacoin.length ? datacoin[0].name : "Loading..."}
        </h1>
      </header>
      <div className="infoofcoin">
        <div className="graph">
          {/* Display the line chart with the provided data and options */}
          <Line data={data} options={options}></Line>
        </div>
        {datacoin.map((e) => {
          return (
            <div
              style={{
                backgroundColor: backColor, // Set the background color based on the theme
                color: elColor, // Set the text color based on the theme
              }}
              className="displayinfo"
              key={e.id}
            >
              {/* Display various coin details */}
              <p style={{ border: `${elColor} 1px solid` }}>
                {e.name} {e.symbol}
              </p>
              <p style={{ border: `${elColor} 1px solid` }}>
                USD price: ${e.price_usd}
              </p>
              <p style={{ border: `${elColor} 1px solid` }}>
                24h volume: ${e.volume24}
              </p>
              <p style={{ border: `${elColor} 1px solid` }}>Rank: {e.rank}</p>
              <p style={{ border: `${elColor} 1px solid` }}>
                Market cap USD: ${e.market_cap_usd}
              </p>
              <p style={{ border: `${elColor} 1px solid` }}>
                Circulating Supply: {e.csupply}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
