import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Allocations({ user }) {
  const [disasters, setDisasters] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState("");
  const canAllocate = user?.RoleName !== "Viewer";
  const [food, setFood] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [form, setForm] = useState({
    DisasterID: "",
    AmbulanceID: "",
    FoodID: "",
    FoodQuantity: 0,
    ShelterID: "",
    ShelterPeople: 0,
    PriorityLevel: "High",
    Notes: ""
  });

  const load = async () => {
    const [d,a,f,s,h] = await Promise.all([
      api.get("/disasters"),
      api.get("/resources/ambulances"),
      api.get("/resources/food"),
      api.get("/resources/shelters"),
      api.get("/allocations")
    ]);
    setDisasters(d.data.data.filter(x => x.Status !== "Closed"));
    setAmbulances(a.data.data.filter(x => x.CurrentStatus === "Available"));
    setFood(f.data.data.filter(x => x.QuantityAvailable > 0));
    setShelters(s.data.data.filter(x => x.CurrentStatus === "Open" && x.AvailableCapacity > 0));
    setHistory(h.data.data);
  };

  useEffect(()=>{ load(); }, []);

  const allocate = async (e) => {
    e.preventDefault();
    if (!canAllocate) return;
    setMsg("");
    try {
      await api.post("/allocations", {
        ...form,
        DisasterID: Number(form.DisasterID),
        AmbulanceID: form.AmbulanceID ? Number(form.AmbulanceID) : null,
        FoodID: form.FoodID ? Number(form.FoodID) : null,
        FoodQuantity: Number(form.FoodQuantity || 0),
        ShelterID: form.ShelterID ? Number(form.ShelterID) : null,
        ShelterPeople: Number(form.ShelterPeople || 0),
        AllocatedBy: user?.UserID || 1
      });
      setMsg("Allocation completed. SQL Server has deducted food quantity, shelter capacity and changed ambulance status.");
      setForm({ DisasterID:"", AmbulanceID:"", FoodID:"", FoodQuantity:0, ShelterID:"", ShelterPeople:0, PriorityLevel:"High", Notes:"" });
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Allocation failed.");
    }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="panel allocation-panel">
          <h4>Allocate Relief Resources</h4>
          <p className="text-muted">Select a disaster and allocate ambulance, food and shelter according to urgency and availability.</p>
          {msg && <div className="alert alert-info">{msg}</div>}
          {!canAllocate && <div className="alert alert-info">Viewer access: allocation actions are limited. Contact an admin or operator to assign resources.</div>}

          <form onSubmit={allocate}>
            <label>Disaster Situation</label>
            <select className="form-select mb-2" value={form.DisasterID} onChange={(e)=>setForm({...form,DisasterID:e.target.value})} required>
              <option value="">Select disaster</option>
              {disasters.map(x => <option key={x.DisasterID} value={x.DisasterID}>{x.DisasterName} - {x.Severity}</option>)}
            </select>

            <label>Ambulance</label>
            <select className="form-select mb-2" value={form.AmbulanceID} onChange={(e)=>setForm({...form,AmbulanceID:e.target.value})}>
              <option value="">No ambulance</option>
              {ambulances.map(x => <option key={x.AmbulanceID} value={x.AmbulanceID}>{x.VehicleNo} - {x.BaseLocation}</option>)}
            </select>

            <label>Food Supply</label>
            <select className="form-select mb-2" value={form.FoodID} onChange={(e)=>setForm({...form,FoodID:e.target.value})}>
              <option value="">No food</option>
              {food.map(x => <option key={x.FoodID} value={x.FoodID}>{x.FoodName} ({x.QuantityAvailable} available)</option>)}
            </select>

            <label>Food Quantity</label>
            <input type="number" className="form-control mb-2" value={form.FoodQuantity} onChange={(e)=>setForm({...form,FoodQuantity:e.target.value})} />

            <label>Shelter</label>
            <select className="form-select mb-2" value={form.ShelterID} onChange={(e)=>setForm({...form,ShelterID:e.target.value})}>
              <option value="">No shelter</option>
              {shelters.map(x => <option key={x.ShelterID} value={x.ShelterID}>{x.ShelterName} ({x.AvailableCapacity} capacity)</option>)}
            </select>

            <label>People for Shelter</label>
            <input type="number" className="form-control mb-2" value={form.ShelterPeople} onChange={(e)=>setForm({...form,ShelterPeople:e.target.value})} />

            <label>Priority</label>
            <select className="form-select mb-2" value={form.PriorityLevel} onChange={(e)=>setForm({...form,PriorityLevel:e.target.value})}>
              <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
            </select>

            <label>Notes</label>
            <textarea className="form-control mb-3" value={form.Notes} onChange={(e)=>setForm({...form,Notes:e.target.value})}></textarea>

            <button className="btn btn-danger w-100 btn-lg">Allocate Resources</button>
          </form>
        </div>
      </div>

      <div className="col-lg-8">
        <div className="panel">
          <h4>Allocation History</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead><tr><th>Disaster</th><th>Type</th><th>Ambulance</th><th>Food Qty</th><th>Shelter People</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                {history.map(x => (
                  <tr key={x.AllocationID}>
                    <td>{x.DisasterName}</td>
                    <td>{x.DisasterType}</td>
                    <td>{x.AmbulanceNo || "-"}</td>
                    <td>{x.FoodQuantity}</td>
                    <td>{x.ShelterPeople}</td>
                    <td><span className="badge bg-danger">{x.PriorityLevel}</span></td>
                    <td>{x.AllocationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="alert alert-success">
            This module uses SQL Server stored procedure <b>sp_AllocateReliefResources</b> with transaction, validation, resource deduction and allocation history.
          </div>
        </div>
      </div>
    </div>
  );
}