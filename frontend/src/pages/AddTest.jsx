import React, { useState, useEffect } from "react";
import api from "../api";
import { useSearchParams, useNavigate } from "react-router-dom";

const ALL_TESTS = [
  { key:"TC", label:"TC", price:150 },
  { key:"DC", label:"DC", price:120 },
  { key:"ESR", label:"ESR", price:90 },
  { key:"Hb%", label:"Hb%", price:160 },
  { key:"LFT", label:"LFT", price:600 },
  { key:"LIPID PROFILE", label:"LIPID PROFILE", price:800 },
  { key:"UREA", label:"UREA", price:70 },
  { key:"CREATININE", label:"CREATININE", price:100 },
  { key:"CALCIUM", label:"CALCIUM", price:120 },
  { key:"FSH", label:"FSH", price:400 },
  { key:"RA FACTOR", label:"RA FACTOR", price:200 },
  { key:"CRP", label:"CRP", price:300 },
  { key:"ASO", label:"ASO", price:250 },
];

export default function AddTest({ user }) {
  const [params] = useSearchParams();
  const editId = params.get("id");
  const [patient_name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("M");
  const [selected, setSelected] = useState([]);
  const [otherName, setOtherName] = useState("");
  const [total, setTotal] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [due, setDue] = useState(0);
  const [paid_to, setPaidTo] = useState("");
  const [collected_by, setCollectedBy] = useState((user && user.username) || "");
  const [test_by, setTestBy] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0,10));
  const nav = useNavigate();

  useEffect(()=>{
    calc();
    if (editId) loadEdit();
    // eslint-disable-next-line
  }, [selected, advance]);

  function toggle(t) {
    if (selected.includes(t.key)) setSelected(selected.filter(s=>s!==t.key));
    else setSelected([...selected, t.key]);
  }

  function calc(){
    let sum = 0;
    selected.forEach(k => {
      const it = ALL_TESTS.find(x=>x.key===k);
      if (it) sum += it.price;
    });
    if (otherName && !selected.includes("OTHER")) {
      // assuming other has a small price input below; here skip
    }
    setTotal(sum);
    setDue(Number((sum - Number(advance||0)).toFixed(2)));
  }

  async function loadEdit(){
    try {
      const res = await api.get("/all_tests");
      const r = res.data.find(x => Number(x.id) === Number(editId));
      if (!r) { alert("Not found"); return; }
      setName(r.patient_name); setAge(r.age); setSex(r.sex || "M");
      setSelected((r.tests || r.tests_selected || "").toString().split(",").filter(Boolean));
      setTotal(Number(r.total || 0)); setAdvance(Number(r.advance||0)); setDue(Number(r.due||0));
      setPaidTo(r.paid_to); setCollectedBy(r.collected_by); setTestBy(r.test_by);
      setDate((r.date || r.created_at || "").substring(0,10));
    } catch(e){ console.error(e); alert("load error"); }
  }

  async function submit(){
    if (!patient_name || selected.length===0) { alert("Enter patient and select tests"); return; }
    const payload = {
      patient_name,
      age,
      sex,
      tests: selected,
      total,
      advance,
      due,
      paid_to,
      collected_by,
      test_by,
      date
    };

    try {
      if (editId) {
        await api.put(`/edit_test/${editId}`, payload);
        alert("Updated");
      } else {
        await api.post("/add_test", {
          patient_name, age, sex,
          tests: selected,
          total, advance, due, paid_to, collected_by, test_by, date
        });
        alert("Created");
      }
      nav("/");
    } catch(e){
      console.error(e); alert("Error saving");
    }
  }

  return (
    <div className="card">
      <h2>{editId ? "Edit Test" : "Add Test"}</h2>

      <label className="label">Patient Name</label>
      <input value={patient_name} onChange={(e)=>setName(e.target.value)} placeholder="Patient name" />

      <div className="row" style={{marginTop:8}}>
        <input style={{flex:1}} value={age} onChange={e=>setAge(e.target.value)} placeholder="Age" />
        <select style={{width:120}} value={sex} onChange={e=>setSex(e.target.value)}>
          <option value="M">M</option><option value="F">F</option>
        </select>
      </div>

      <label className="label" style={{marginTop:8}}>Select Tests (tap to toggle)</label>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {ALL_TESTS.map(t => (
          <div key={t.key} className="chip" style={{borderRadius:8, background: selected.includes(t.key) ? "#e0f2fe" : "#f1f5f9"}} onClick={()=>toggle(t)}>
            {t.label} • ₹{t.price}
          </div>
        ))}
      </div>

      <label className="label" style={{marginTop:8}}>Test By / Lab</label>
      <input value={test_by} onChange={e=>setTestBy(e.target.value)} placeholder="Lab name (e.g. ABC Lab)" />

      <label className="label" style={{marginTop:8}}>Collected By</label>
      <input value={collected_by} onChange={e=>setCollectedBy(e.target.value)} placeholder="Collector name" />

      <label className="label" style={{marginTop:8}}>Paid To</label>
      <input value={paid_to} onChange={e=>setPaidTo(e.target.value)} placeholder="Paid to" />

      <label className="label" style={{marginTop:8}}>Date</label>
      <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />

      <div style={{display:"flex", gap:8, marginTop:8}}>
        <div style={{flex:1}}>
          <label className="label">Total</label>
          <input value={total} readOnly />
        </div>
        <div style={{width:140}}>
          <label className="label">Advance</label>
          <input type="number" value={advance} onChange={e=>setAdvance(e.target.value)} />
        </div>
      </div>

      <label className="label" style={{marginTop:6}}>Due</label>
      <input value={due} readOnly />

      <div style={{display:"flex", gap:8, marginTop:10}}>
        <button className="btn-primary" onClick={submit}>{editId ? "Update" : "Create"}</button>
        <button className="btn-ghost" onClick={()=>window.history.back()}>Cancel</button>
      </div>
    </div>
  );
                                                    }
