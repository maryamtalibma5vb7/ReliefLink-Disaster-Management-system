import React from "react";

export default function StatCard({ title, value, icon, tone }) {
  return (
    <div className={`stat-card ${tone || ""}`}>
      <div>
        <span>{title}</span>
        <h3>{value ?? 0}</h3>
      </div>
      <i className={`bi ${icon}`}></i>
    </div>
  );
}