import React, {useState, useEffect} from "react";
import Header from "../components/Header";
import { useNavigate, useSearchParams } from "react-router-dom";

const ALL_TESTS = [
  {key:"TC", label:"TC", price:150},
  {key:"DC", label:"DC", price:120},
  {key:"ESR", label:"ESR", price:90},
  {key:"Hb%", label:"Hb%", price:160},
  {key:"LFT", label:"LFT", price:600},
  {key:"LIPID PROFILE", label:"LIPID PROFILE", price:800},
  {key:"UREA", label:"UREA", price:70},
  {key:"CREATININE", label:"CREATININE", price:100},
  {key:"CALCIUM", label:"CALCIUM", price:120},
  {key:"FSH", label:"FSH", price:400},
  {key:"RA FACTOR", label:"RA FACTOR", price:200},
  {key:"CRP", label:"CRP", price:300},
  {key:"ASO", label:"ASO", price:250},
];

export default function AddTest(){
  const [params] = useSearchParams();
  const editId = params.get("id");
  const [patient_name,setName]=useState("");
  const [age,setAge]=useState("");
  const [sex,setSex]=useState("M");
  const [selected,setSelected]=useState([]);
  const [total,setTotal]=useState(0);
  const [advance,setAdvance]=useState(0);
  const [due,setDue]=useState(0);
  const [paid_to,setPaidTo]=useState("");
  const [collected_by,setCollectedBy]=useState("");
  const [test_by,setTestBy]=useState("");
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const nav = useNavigate();

  useEffect(()=>{ calc(); if(editId) loadEdit(); },[selected,advance]);

  function toggle(k){
    setSelected(s => s.includes(k) ? s.filter(x=>x!==k) : [...s,k]);
  }

  function calc(){
    let sum = 0; selected.forEach(k=>{ const t = ALL_TESTS.find(x=>x.key===k); if(t) sum += t.price;});
    setTotal(sum); setDue(Number((sum - Number(advance||0)).toFixed(2)));
  }

  async function loadEdit(){
    try{
      const res = await fetch("https://blood-test-app.onrender.com/all_tests");
      const data = await res.json();
      const r = data.find(x => String(x.id) === String(editId));
      if(!r){ alert("Not found"); return; }
      setName(r.patient_name); setAge(r.age); setSex(r.sex||"M");
      setSelected((r.tests_selected||"").split(",").filter(Boolean));
      setTotal(Number(r.total||0)); setAdvance(Number(r.advance||0)); setDue(Number(r.due||0));
      setPaidTo(r.paid_to); setCollectedBy(r.collected_by); setTestBy(r.test_by);
      setDate((r.date||r.created_at||"").slice(0,10) || new Date().toISOString().slice(0,10));
    }catch(e){ console.error(e); alert("load error"); }
  }

  async function submit(){
    if(!patient_name || selected.length===0){ alert("Enter patient and select tests"); return; }
    const payload = { patient_name, age, sex, tests: selected, total, advance, due, paid_to, collected_by, test_by, date };
    try{
      if(editId){
        await fetch(`https://blood-test-api.onrender.com/edit_test/${editId}`, {method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
        alert("Updated");
      } else {
        await fetch("https://blood-test-api.onrender.com/add_test", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)});
        alert("Created");
      }
      nav("/dashboard");
    }catch(e){ console.error(e); alert("Save error"); }
  }

  return (
    <>
      <Header title={editId ? "Edit Test" : "Add Test"} />
      <div className="container">
        <div className="card">
          <label className="label">Patient Name</label>
          <input value={patient_name} onChange={e=>setName(e.target.value)} placeholder="Patient name"/>

          <div className="row" style={{marginTop:8}}>
            <input style={{flex:1}} placeholder="Age" value={age} onChange={e=>setAge(e.target.value)}/>
            <select style={{width:110}} value={sex} onChange={e=>setSex(e.target.value)}><option>M</option><option>F</option></select>
          </div>

          <label className="label" style={{marginTop:8}}>Select Tests</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {ALL_TESTS.map(t => <div key={t.key} className="chip" onClick={()=>toggle(t.key)} style={{background: selected.includes(t.key) ? "#e6f4ff" : "#f1f5f9"}}>{t.label} • ₹{t.price}</div>)}
          </div>

          <label className="label" style={{marginTop:8}}>Test By (Lab)</label>
          <input value={test_by} onChange={e=>setTestBy(e.target.value)} placeholder="Lab name"/>

          <label className="label" style={{marginTop:8}}>Collected By</label>
          <input value={collected_by} onChange={e=>setCollectedBy(e.target.value)} placeholder="Collector name"/>

          <div style={{display:"flex",gap:8,marginTop:8}}>
            <div style={{flex:1}}>
              <label className="label">Total</label>
              <input value={total} readOnly/>
            </div>
            <div style={{width:140}}>
              <label className="label">Advance</label>
              <input type="number" value={advance} onChange={e=>setAdvance(e.target.value)}/>
            </div>
          </div>

          <label className="label">Due</label>
          <input value={due} readOnly />

          <label className="label" style={{marginTop:8}}>Paid To</label>
          <input value={paid_to} onChange={e=>setPaidTo(e.target.value)} placeholder="Paid to"/>

          <label className="label" style={{marginTop:8}}>Date</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />

          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button className="btn-primary" onClick={submit}>{editId ? "Update" : "Create"}</button>
            <button className="btn-ghost" onClick={()=>window.history.back()}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
