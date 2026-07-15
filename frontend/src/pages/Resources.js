import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Resources({ user }) {
  const [tab, setTab] = useState("ambulances");
  const [ambulances, setAmbulances] = useState([]);
  const [food, setFood] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [ambForm, setAmbForm] = useState({ VehicleNo:"", DriverName:"", DriverPhone:"", BaseLocation:"", CurrentStatus:"Available" });
  const [foodForm, setFoodForm] = useState({ FoodName:"", UnitName:"Packets", QuantityAvailable:0, ExpiryDate:"", StorageLocation:"" });
  const [shelterForm, setShelterForm] = useState({ ShelterName:"", LocationName:"", TotalCapacity:0, AvailableCapacity:0, ContactPerson:"", ContactPhone:"", CurrentStatus:"Open" });

  const isValidVehicleNo = (value) => /^[A-Za-z0-9][A-Za-z0-9\- ]{2,19}$/.test(value.trim());
  const isValidName = (value) => /^[A-Za-z][A-Za-z' \-]{2,63}$/.test(value.trim());
  const isValidPhone = (value) => /^[0-9+\-\s()]{7,30}$/.test(value.trim());
  const isValidLocation = (value) => /^[A-Za-z0-9][A-Za-z0-9'\-,.() ]{2,80}$/.test(value.trim());

  const validateAmbulance = (data) => {
    if (!data.VehicleNo.trim() || !data.DriverName.trim() || !data.DriverPhone.trim() || !data.BaseLocation.trim()) {
      return "Vehicle number, driver name, driver phone and base location are required.";
    }
    if (!isValidVehicleNo(data.VehicleNo)) {
      return "Vehicle number must be 3-20 characters and may include letters, numbers, hyphens and spaces.";
    }
    if (!isValidName(data.DriverName)) {
      return "Driver name must be 3-64 characters and contain only letters, spaces, apostrophes or hyphens.";
    }
    if (!isValidPhone(data.DriverPhone)) {
      return "Driver phone must be a valid phone number.";
    }
    if (!isValidLocation(data.BaseLocation)) {
      return "Base location must be 3-80 characters and contain only letters, numbers and punctuation.";
    }
    return "";
  };

  const load = async () => {
    const [a,f,s] = await Promise.all([
      api.get("/resources/ambulances"),
      api.get("/resources/food"),
      api.get("/resources/shelters")
    ]);
    setAmbulances(a.data.data); setFood(f.data.data); setShelters(s.data.data);
  };
  useEffect(()=>{ load(); }, []);

  const canWrite = user?.RoleName !== "Viewer";
  const canDelete = user?.RoleName === "Admin";

  const addAmb = async (e) => {
    e.preventDefault();
    if (!canWrite) return;
    const error = validateAmbulance(ambForm);
    if (error) {
      setMessage(error);
      setMessageType("danger");
      return;
    }
    await api.post("/resources/ambulances", ambForm);
    setMessage("Ambulance added successfully.");
    setMessageType("success");
    setAmbForm({ VehicleNo:"", DriverName:"", DriverPhone:"", BaseLocation:"", CurrentStatus:"Available" });
    load();
  };
  const addFood = async (e) => { e.preventDefault(); await api.post("/resources/food", foodForm); setFoodForm({ FoodName:"", UnitName:"Packets", QuantityAvailable:0, ExpiryDate:"", StorageLocation:"" }); load(); };
  const addShelter = async (e) => { e.preventDefault(); await api.post("/resources/shelters", shelterForm); setShelterForm({ ShelterName:"", LocationName:"", TotalCapacity:0, AvailableCapacity:0, ContactPerson:"", ContactPhone:"", CurrentStatus:"Open" }); load(); };
  const removeItem = async (url) => { if (!canDelete) return; if (window.confirm("Delete this resource record?")) { await api.delete(url); load(); } };

  return (
    <div className="panel">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Resource Management</h4>
        <div className="btn-group">
          <button className={`btn btn-${tab==="ambulances"?"primary":"outline-primary"}`} onClick={()=>setTab("ambulances")}>Ambulances</button>
          <button className={`btn btn-${tab==="food"?"success":"outline-success"}`} onClick={()=>setTab("food")}>Food Supplies</button>
          <button className={`btn btn-${tab==="shelters"?"warning":"outline-warning"}`} onClick={()=>setTab("shelters")}>Shelters</button>
        </div>
      </div>

      {tab === "ambulances" && (
        <div className="row g-4">
          <div className="col-lg-4">
            <h5>Add Ambulance</h5>
            {message && <div className={`alert alert-${messageType}`}>{message}</div>}
            {canWrite ? (
              <form onSubmit={addAmb}>
              {["VehicleNo","DriverName","DriverPhone","BaseLocation"].map(k => <input key={k} className="form-control mb-2" placeholder={k} value={ambForm[k]} onChange={(e)=>setAmbForm({...ambForm,[k]:e.target.value})} required />)}
              <select className="form-select mb-3" value={ambForm.CurrentStatus} onChange={(e)=>setAmbForm({...ambForm,CurrentStatus:e.target.value})}><option>Available</option><option>Allocated</option><option>Maintenance</option></select>
              <button className="btn btn-primary w-100">Add Ambulance</button>
            </form>
            ) : (
              <div className="alert alert-info">Viewers can only review ambulance records.</div>
            )}
          </div>
          <div className="col-lg-8 table-responsive">
            <table className="table table-hover"><thead><tr><th>Vehicle</th><th>Driver</th><th>Phone</th><th>Location</th><th>Status</th><th>Action</th></tr></thead><tbody>{ambulances.map(x=><tr key={x.AmbulanceID}><td>{x.VehicleNo}</td><td>{x.DriverName}</td><td>{x.DriverPhone}</td><td>{x.BaseLocation}</td><td><span className={`status-pill ${x.CurrentStatus}`}>{x.CurrentStatus}</span></td><td>{canDelete ? <button className="btn btn-sm btn-outline-danger" onClick={()=>removeItem(`/resources/ambulances/${x.AmbulanceID}`)}>Delete</button> : <span className="text-muted">No action</span>}</td></tr>)}</tbody></table>
          </div>
        </div>
      )}

      {tab === "food" && (
        <div className="row g-4">
          <div className="col-lg-4">
            <h5>Add Food Supply</h5>
            {canWrite ? (
              <form onSubmit={addFood}>
                <input className="form-control mb-2" placeholder="Food Name" value={foodForm.FoodName} onChange={(e)=>setFoodForm({...foodForm,FoodName:e.target.value})} required />
                <input className="form-control mb-2" placeholder="Unit Name" value={foodForm.UnitName} onChange={(e)=>setFoodForm({...foodForm,UnitName:e.target.value})} required />
                <input type="number" className="form-control mb-2" placeholder="Quantity" value={foodForm.QuantityAvailable} onChange={(e)=>setFoodForm({...foodForm,QuantityAvailable:Number(e.target.value)})} required />
                <input type="date" className="form-control mb-2" value={foodForm.ExpiryDate} onChange={(e)=>setFoodForm({...foodForm,ExpiryDate:e.target.value})} />
                <input className="form-control mb-3" placeholder="Storage Location" value={foodForm.StorageLocation} onChange={(e)=>setFoodForm({...foodForm,StorageLocation:e.target.value})} required />
                <button className="btn btn-success w-100">Add Food</button>
              </form>
            ) : (
              <div className="alert alert-info">Viewers can only review food supply records.</div>
            )}
          </div>
          <div className="col-lg-8 table-responsive">
            <table className="table table-hover"><thead><tr><th>Name</th><th>Unit</th><th>Quantity</th><th>Expiry</th><th>Location</th><th>Action</th></tr></thead><tbody>{food.map(x=><tr key={x.FoodID}><td>{x.FoodName}</td><td>{x.UnitName}</td><td>{x.QuantityAvailable}</td><td>{String(x.ExpiryDate||"").slice(0,10)}</td><td>{x.StorageLocation}</td><td>{canDelete ? <button className="btn btn-sm btn-outline-danger" onClick={()=>removeItem(`/resources/food/${x.FoodID}`)}>Delete</button> : <span className="text-muted">No action</span>}</td></tr>)}</tbody></table>
          </div>
        </div>
      )}

      {tab === "shelters" && (
        <div className="row g-4">
          <div className="col-lg-4">
            <h5>Add Shelter</h5>
            {canWrite ? (
              <form onSubmit={addShelter}>
                <input className="form-control mb-2" placeholder="Shelter Name" value={shelterForm.ShelterName} onChange={(e)=>setShelterForm({...shelterForm,ShelterName:e.target.value})} required />
                <input className="form-control mb-2" placeholder="Location" value={shelterForm.LocationName} onChange={(e)=>setShelterForm({...shelterForm,LocationName:e.target.value})} required />
                <input type="number" className="form-control mb-2" placeholder="Total Capacity" value={shelterForm.TotalCapacity} onChange={(e)=>setShelterForm({...shelterForm,TotalCapacity:Number(e.target.value),AvailableCapacity:Number(e.target.value)})} required />
                <input className="form-control mb-2" placeholder="Contact Person" value={shelterForm.ContactPerson} onChange={(e)=>setShelterForm({...shelterForm,ContactPerson:e.target.value})} />
                <input className="form-control mb-2" placeholder="Contact Phone" value={shelterForm.ContactPhone} onChange={(e)=>setShelterForm({...shelterForm,ContactPhone:e.target.value})} />
                <select className="form-select mb-3" value={shelterForm.CurrentStatus} onChange={(e)=>setShelterForm({...shelterForm,CurrentStatus:e.target.value})}><option>Open</option><option>Full</option><option>Closed</option></select>
                <button className="btn btn-warning w-100">Add Shelter</button>
              </form>
            ) : (
              <div className="alert alert-info">Viewers may review shelters but cannot add or edit them.</div>
            )}
          </div>
          <div className="col-lg-8 table-responsive">
            <table className="table table-hover"><thead><tr><th>Name</th><th>Location</th><th>Total</th><th>Available</th><th>Status</th><th>Contact</th><th>Action</th></tr></thead><tbody>{shelters.map(x=><tr key={x.ShelterID}><td>{x.ShelterName}</td><td>{x.LocationName}</td><td>{x.TotalCapacity}</td><td>{x.AvailableCapacity}</td><td><span className={`status-pill ${x.CurrentStatus}`}>{x.CurrentStatus}</span></td><td>{x.ContactPerson}</td><td>{canDelete ? <button className="btn btn-sm btn-outline-danger" onClick={()=>removeItem(`/resources/shelters/${x.ShelterID}`)}>Delete</button> : <span className="text-muted">No action</span>}</td></tr>)}</tbody></table>
          </div>
        </div>
      )}
    </div>
  );
}