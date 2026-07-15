import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const signupBg = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80";
const NAME_REGEX = /^[A-Za-z][A-Za-z' \-]{2,63}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;

export default function Signup() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", roleName: "Operator" });
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const submit = async (e) => {
    e.preventDefault();

    if (!NAME_REGEX.test(form.fullName.trim())) {
      setType("danger");
      return setMessage("Full name must be 3-64 characters and contain only letters, spaces, apostrophes or hyphens.");
    }
    if (!EMAIL_REGEX.test(form.email.trim().toLowerCase())) {
      setType("danger");
      return setMessage("Please provide a valid email address.");
    }
    if (!PASSWORD_REGEX.test(form.password)) {
      setType("danger");
      return setMessage("Password must be at least 8 chars and include uppercase, lowercase, number and special character.");
    }

    try {
      const res = await api.post("/auth/signup", form);
      setType("success"); setMessage(res.data.message);
      setForm({ fullName: "", email: "", password: "", roleName: "Operator" });
    } catch (err) {
      setType("danger");
      setMessage(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="signup-screen" style={{ backgroundImage: `linear-gradient(90deg, rgba(8,16,38,.92), rgba(8,16,38,.60)), url(${signupBg})` }}>
      <Link to="/login" className="back-login"><i className="bi bi-arrow-left"></i> Back to Login</Link>
      <div className="signup-copy"><div className="brand-row"><div className="brand-mark"><i className="bi bi-shield-fill-check"></i></div><div><h3>ReliefLink</h3><span>Disaster Resource Management</span></div></div><h1>Create Your Account</h1><p>Register authorized personnel and select access role for disaster operations.</p><ul><li><i className="bi bi-check-circle"></i> Admin: full control, including disaster creation and management</li><li><i className="bi bi-check-circle"></i> Operator: daily resource allocation and support</li><li><i className="bi bi-check-circle"></i> Viewer: reports and monitoring only</li></ul></div>
      <div className="auth-card signup-card"><div className="text-center mb-4"><div className="auth-logo"><i className="bi bi-person-plus"></i></div><h2>Create Account</h2><p>Register as an authorized ReliefLink user</p></div>{message && <div className={`alert alert-${type}`}>{message}</div>}<form onSubmit={submit}><label>Full Name</label><input className="form-control mb-3" value={form.fullName} onChange={(e)=>setForm({...form,fullName:e.target.value})} required /><label>Email Address</label><input className="form-control mb-3" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required /><label>Password</label><input className="form-control mb-3" type="password" minLength="6" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required /><label>Role</label><select className="form-select mb-3" value={form.roleName} onChange={(e)=>setForm({...form,roleName:e.target.value})}><option>Admin</option><option>Operator</option><option>Viewer</option></select><button className="btn btn-danger w-100 btn-lg gradient-btn-danger"><i className="bi bi-person-plus-fill me-2"></i>Create Account</button></form><p className="text-center mt-3 mb-0">Already have an account? <Link to="/login">Login here</Link></p></div>
    </div>
  );
}
