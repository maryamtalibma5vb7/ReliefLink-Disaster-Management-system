import React, { useEffect, useState } from "react";
import api from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports({ user }) {
  const [allocations, setAllocations] = useState([]);
  const [logs, setLogs] = useState([]);

  const load = async () => {
    const allocationRes = await api.get("/reports/allocation-report");
    setAllocations(allocationRes.data.data || []);
    if (user?.RoleName === "Admin") {
      const logRes = await api.get("/reports/activity-logs");
      setLogs(logRes.data.data || []);
    } else {
      setLogs([]);
    }
  };
  useEffect(()=>{ load(); }, []);

  const reportRows = allocations.map(x => ({ Date: String(x.AllocationDate).slice(0,10), Disaster: x.DisasterName, Location: x.DisasterLocation, Ambulance: x.AmbulanceNo || "-", Food: x.FoodName || "-", FoodQuantity: x.FoodQuantity || 0, Shelter: x.ShelterName || "-", ShelterPeople: x.ShelterPeople || 0, Priority: x.PriorityLevel, Status: x.AllocationStatus }));

  const exportExcel = () => { const wb = XLSX.utils.book_new(); const ws = XLSX.utils.json_to_sheet(reportRows); XLSX.utils.book_append_sheet(wb, ws, "Allocation Report"); XLSX.writeFile(wb, "ReliefLink_Allocation_Report.xlsx"); };
  const exportWord = () => { const html = `<html><head><meta charset='utf-8'><title>ReliefLink Report</title></head><body><h1>ReliefLink Allocation Report</h1><p>Generated from SQL Server view vw_AllocationReport.</p><table border='1' cellspacing='0' cellpadding='6'><tr>${Object.keys(reportRows[0] || {Date:"",Disaster:"",Location:"",Ambulance:"",Food:"",FoodQuantity:"",Shelter:"",ShelterPeople:"",Priority:"",Status:""}).map(h=>`<th>${h}</th>`).join("")}</tr>${reportRows.map(r=>`<tr>${Object.values(r).map(v=>`<td>${v}</td>`).join("")}</tr>`).join("")}</table></body></html>`; saveAs(new Blob([html], { type: "application/msword;charset=utf-8" }), "ReliefLink_Allocation_Report.doc"); };
  const exportPDF = () => { const doc = new jsPDF("l", "pt"); doc.setFontSize(18); doc.text("ReliefLink Allocation Report", 40, 40); doc.setFontSize(10); doc.text("Generated from SQL Server database", 40, 58); autoTable(doc, { startY: 80, head: [["Date","Disaster","Location","Ambulance","Food","Qty","Shelter","People","Priority","Status"]], body: reportRows.map(r => [r.Date,r.Disaster,r.Location,r.Ambulance,r.Food,r.FoodQuantity,r.Shelter,r.ShelterPeople,r.Priority,r.Status]), styles: { fontSize: 8 } }); doc.save("ReliefLink_Allocation_Report.pdf"); };

  return (
    <div className="row g-4">
      <div className="col-12"><div className="report-toolbar"><div><h3>Reports & Export Center</h3><p>Generate professional reports in Excel, Word and PDF formats.</p></div><div className="d-flex gap-2 flex-wrap"><button onClick={exportExcel} className="btn btn-success"><i className="bi bi-file-earmark-excel me-2"></i>Excel</button><button onClick={exportWord} className="btn btn-primary"><i className="bi bi-file-earmark-word me-2"></i>Word</button><button onClick={exportPDF} className="btn btn-danger"><i className="bi bi-file-earmark-pdf me-2"></i>PDF</button></div></div></div>
      <div className="col-lg-8"><div className="panel"><h4>Detailed Allocation Report</h4><p className="text-muted">Report generated from SQL Server view <b>vw_AllocationReport</b> using joins.</p><div className="table-responsive"><table className="table table-striped align-middle"><thead><tr><th>Date</th><th>Disaster</th><th>Location</th><th>Ambulance</th><th>Food</th><th>Shelter</th><th>Priority</th></tr></thead><tbody>{allocations.map(x => (<tr key={x.AllocationID}><td>{String(x.AllocationDate).slice(0,10)}</td><td>{x.DisasterName}</td><td>{x.DisasterLocation}</td><td>{x.AmbulanceNo || "-"}</td><td>{x.FoodName || "-"} / {x.FoodQuantity}</td><td>{x.ShelterName || "-"} / {x.ShelterPeople}</td><td><span className={`badge priority-${String(x.PriorityLevel).toLowerCase()}`}>{x.PriorityLevel}</span></td></tr>))}</tbody></table></div></div></div>
      <div className="col-lg-4"><div className="panel"><h4>Database Activity Logs</h4><p className="text-muted">Trigger and procedure activity saved in SQL Server.</p>{user?.RoleName === "Admin" ? logs.map(x => (<div className="log-item" key={x.LogID}><strong>{x.ActionName}</strong><p>{x.Detail}</p><small>{String(x.CreatedAt).replace("T"," ").slice(0,19)}</small></div>)) : <div className="alert alert-info">Activity logs are available only to admin users.</div>}</div></div>
    </div>
  );
}
