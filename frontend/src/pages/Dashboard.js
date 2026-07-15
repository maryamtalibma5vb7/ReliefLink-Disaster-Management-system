import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const responseImg = "https://images.unsplash.com/photo-1469571486292-b53601020a01?auto=format&fit=crop&w=1200&q=80";
const COLORS = ["#2563eb", "#ef4444", "#10b981", "#f59e0b", "#7c3aed"];

export default function Dashboard() {
  const [data, setData] = useState({ stats: {}, recentAllocations: [], disasterChart: [] });
  const [error, setError] = useState("");

  const load = async () => {
    try { const res = await api.get("/reports/dashboard"); setData(res.data); setError(""); }
    catch (err) { setError(err.response?.data?.message || "Unable to load dashboard. Start backend and SQL Server."); }
  };
  useEffect(() => { load(); }, []);

  const monthlyData = useMemo(() => {
    const rows = data.recentAllocations || [];
    if (!rows.length) return [{ month: "Jan", allocations: 12 }, { month: "Feb", allocations: 18 }, { month: "Mar", allocations: 9 }, { month: "Apr", allocations: 22 }, { month: "May", allocations: 15 }];
    const map = {};
    rows.forEach(x => { const m = String(x.AllocationDate || "").slice(0,7) || "Current"; map[m] = (map[m] || 0) + 1; });
    return Object.entries(map).map(([month, allocations]) => ({ month, allocations }));
  }, [data.recentAllocations]);

  const resourceData = [
    { name: "Ambulances", value: Number(data.stats?.AvailableAmbulances || 0) },
    { name: "Food Units", value: Number(data.stats?.AvailableFoodUnits || 0) },
    { name: "Shelter Capacity", value: Number(data.stats?.AvailableShelterCapacity || 0) }
  ];

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="executive-hero mb-4" style={{ backgroundImage: `linear-gradient(120deg, rgba(15,23,42,.94), rgba(29,78,216,.72)), url(${responseImg})` }}>
        <div><span className="eyebrow light">Live Relief Operations</span><h1>Modern Metrics Command Dashboard</h1><p>Professional analytics view for disasters, ambulance availability, food stock, shelter capacity and real-time allocation decisions.</p><div className="hero-actions"><button className="btn btn-light"><i className="bi bi-plus-circle me-2"></i>New Disaster</button><button className="btn btn-outline-light"><i className="bi bi-download me-2"></i>Export Summary</button></div></div>
        <div className="hero-glass"><b>SQL Server</b><span>Connected Database</span><strong>{data.stats?.TotalAllocations || 0}</strong><small>Total Allocations</small></div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3"><StatCard title="Active Disasters" value={data.stats?.ActiveDisasters} icon="bi-exclamation-octagon" tone="red" /></div>
        <div className="col-md-3"><StatCard title="Available Ambulances" value={data.stats?.AvailableAmbulances} icon="bi-truck-front" tone="blue" /></div>
        <div className="col-md-3"><StatCard title="Food Units" value={data.stats?.AvailableFoodUnits} icon="bi-basket" tone="green" /></div>
        <div className="col-md-3"><StatCard title="Shelter Capacity" value={data.stats?.AvailableShelterCapacity} icon="bi-house-heart" tone="purple" /></div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8"><div className="panel chart-panel"><div className="panel-title"><h4>Allocation Trend</h4><span>Monthly response activity</span></div><ResponsiveContainer width="100%" height={290}><AreaChart data={monthlyData}><defs><linearGradient id="alloc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.55}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis allowDecimals={false}/><Tooltip/><Area type="monotone" dataKey="allocations" stroke="#2563eb" fill="url(#alloc)" strokeWidth={3}/></AreaChart></ResponsiveContainer></div></div>
        <div className="col-lg-4"><div className="panel chart-panel"><div className="panel-title"><h4>Resource Availability</h4><span>Live operational capacity</span></div><ResponsiveContainer width="100%" height={290}><PieChart><Pie data={resourceData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={105} paddingAngle={4}>{resourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7"><div className="panel"><div className="panel-title"><h4>Recent Resource Allocations</h4><span>Latest emergency dispatches</span></div><div className="table-responsive"><table className="table align-middle"><thead><tr><th>Disaster</th><th>Ambulance</th><th>Food</th><th>Shelter</th><th>Priority</th></tr></thead><tbody>{data.recentAllocations?.map((x) => (<tr key={x.AllocationID}><td><b>{x.DisasterName}</b><br/><small>{x.DisasterLocation}</small></td><td>{x.AmbulanceNo || "-"}</td><td>{x.FoodQuantity || 0}</td><td>{x.ShelterPeople || 0}</td><td><span className={`badge priority-${String(x.PriorityLevel).toLowerCase()}`}>{x.PriorityLevel}</span></td></tr>))}{data.recentAllocations?.length === 0 && <tr><td colSpan="5">No allocation found.</td></tr>}</tbody></table></div></div></div>
        <div className="col-lg-5"><div className="panel chart-panel"><div className="panel-title"><h4>Disaster Type Summary</h4><span>Distribution by category</span></div><ResponsiveContainer width="100%" height={260}><BarChart data={data.disasterChart || []}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="TypeName"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="Total" radius={[10,10,0,0]} fill="#ef4444"/></BarChart></ResponsiveContainer></div></div>
      </div>
    </div>
  );
}
