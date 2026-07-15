import React, { useEffect, useState } from "react";
import api from "../services/api";

const empty = {
  DisasterTypeID: 1,
  DisasterName: "",
  LocationName: "",
  Severity: "Medium",
  AffectedPeople: 0,
  DisasterDate: new Date().toISOString().slice(0,10),
  Status: "Active",
  Description: ""
};

export default function Disasters({ user }) {
  const [types, setTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const canWrite = user?.RoleName === "Admin";
  const canDelete = user?.RoleName === "Admin";
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [typeRes, itemRes] = await Promise.all([api.get("/disasters/types"), api.get("/disasters")]);
    setTypes(typeRes.data.data);
    setItems(itemRes.data.data);
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!canWrite) return;
    if (editing) await api.put(`/disasters/${editing}`, form);
    else await api.post("/disasters", form);
    setMsg(editing ? "Disaster updated successfully." : "Disaster added successfully.");
    setEditing(null);
    setForm(empty);
    load();
  };

  const edit = (x) => {
    setEditing(x.DisasterID);
    setForm({
      DisasterTypeID: x.DisasterTypeID,
      DisasterName: x.DisasterName,
      LocationName: x.LocationName,
      Severity: x.Severity,
      AffectedPeople: x.AffectedPeople,
      DisasterDate: String(x.DisasterDate).slice(0,10),
      Status: x.Status,
      Description: x.Description || ""
    });
  };

  const remove = async (id) => {
    if (window.confirm("Delete this disaster?")) {
      await api.delete(`/disasters/${id}`);
      load();
    }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="panel">
          <h4>{editing ? "Update Disaster" : "Add New Disaster"}</h4>
          {msg && <div className="alert alert-success">{msg}</div>}
          {canWrite ? (
            <form onSubmit={save}>
            <label>Disaster Type</label>
            <select className="form-select mb-2" value={form.DisasterTypeID} onChange={(e)=>setForm({...form,DisasterTypeID:Number(e.target.value)})}>
              {types.map(t => <option value={t.DisasterTypeID} key={t.DisasterTypeID}>{t.TypeName}</option>)}
            </select>

            <label>Disaster Name</label>
            <input className="form-control mb-2" value={form.DisasterName} onChange={(e)=>setForm({...form,DisasterName:e.target.value})} required />

            <label>Location</label>
            <input className="form-control mb-2" value={form.LocationName} onChange={(e)=>setForm({...form,LocationName:e.target.value})} required />

            <label>Severity</label>
            <select className="form-select mb-2" value={form.Severity} onChange={(e)=>setForm({...form,Severity:e.target.value})}>
              <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
            </select>

            <label>Affected People</label>
            <input type="number" className="form-control mb-2" value={form.AffectedPeople} onChange={(e)=>setForm({...form,AffectedPeople:Number(e.target.value)})} />

            <label>Date</label>
            <input type="date" className="form-control mb-2" value={form.DisasterDate} onChange={(e)=>setForm({...form,DisasterDate:e.target.value})} />

            <label>Status</label>
            <select className="form-select mb-2" value={form.Status} onChange={(e)=>setForm({...form,Status:e.target.value})}>
              <option>Active</option><option>Under Control</option><option>Closed</option>
            </select>

            <label>Description</label>
            <textarea className="form-control mb-3" value={form.Description} onChange={(e)=>setForm({...form,Description:e.target.value})}></textarea>

            <button className="btn btn-primary w-100">{editing ? "Update" : "Save"}</button>
          </form>
          ) : (
            <div className="alert alert-info">Only Admin users can add or update disasters. Operators and Viewers can view disaster records only.</div>
          )}
        </div>
      </div>

      <div className="col-lg-8">
        <div className="panel">
          <h4>Disaster Records</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead><tr><th>Name</th><th>Type</th><th>Location</th><th>Severity</th><th>People</th><th>Status</th><th>Score</th><th>Action</th></tr></thead>
              <tbody>
                {items.map(x => (
                  <tr key={x.DisasterID}>
                    <td>{x.DisasterName}</td><td>{x.TypeName}</td><td>{x.LocationName}</td>
                    <td><span className="badge bg-warning text-dark">{x.Severity}</span></td>
                    <td>{x.AffectedPeople}</td><td>{x.Status}</td><td>{x.UrgencyScore}</td>
                    <td>
                      {canWrite && <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(x)}>Edit</button>}
                      {canDelete ? <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(x.DisasterID)}>Delete</button> : <span className="text-muted">No action</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}