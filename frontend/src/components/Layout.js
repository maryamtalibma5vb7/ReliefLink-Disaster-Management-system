import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Layout({ user, logout }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><i className="bi bi-life-preserver"></i></div>
          <div>
            <h4>ReliefLink</h4>
            <small>Emergency Response DBMS</small>
          </div>
        </div>

        <nav className="menu">
          <NavLink to="/" end><i className="bi bi-speedometer2"></i> Dashboard</NavLink>
          <NavLink to="/disasters"><i className="bi bi-exclamation-triangle"></i> Disasters</NavLink>
          <NavLink to="/resources"><i className="bi bi-box-seam"></i> Resources</NavLink>
          <NavLink to="/allocations"><i className="bi bi-diagram-3"></i> Allocation</NavLink>
          <NavLink to="/reports"><i className="bi bi-graph-up-arrow"></i> Reports</NavLink>
        </nav>

        <div className="sidebar-footer">
          <small>Logged in as</small>
          <strong>{user?.FullName}</strong>
          <small className="d-block text-muted">Role: {user?.RoleName || "User"}</small>
          <button className="btn btn-outline-light btn-sm w-100 mt-3" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="content">
        <div className="topbar">
          <div>
            <h2>ReliefLink Command Center</h2>
            <p>Manage disasters, track resources and allocate ambulances, food supplies and shelters from one dashboard.</p>
          </div>
          <div className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
            <i className="bi bi-database-check me-1"></i> SQL Server DBMS
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}