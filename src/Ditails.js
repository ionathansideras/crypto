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
  const location = useLocation();
  const { id } = location.state;
  const [datacoin, setData] = useState([]);

  const { backColor } = location.state;
  const { elColor } = location.state;
  const { background } = location.state;

  useEffect(() => {
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
        backgroundColor: "red",
        borderColor: "red",
        pointBorderColor: "black",
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
            color: elColor,
          }}
        >
          {datacoin.length ? datacoin[0].name : "Loading..."}
        </h1>
      </header>
      <div className="infoofcoin">
        <div className="graph">
          <Line data={data} options={options}></Line>
        </div>
        {datacoin.map((e) => {
          return (
            <div
              style={{
                backgroundColor: backColor,
                color: elColor,
              }}
              className="displayinfo"
              key={e.id}
            >
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
                Market cup USD: ${e.market_cap_usd}
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
