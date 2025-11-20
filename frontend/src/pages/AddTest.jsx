import React, {useState} from 'react'
import { post } from '../api.js'
import { useNavigate } from 'react-router-dom'
const TESTS = [
  {key:'TC',label:'TC',price:150},
  {key:'DC',label:'DC',price:120},
  {key:'ESR',label:'ESR',price:90},
  {key:'HB',label:'Hb%',price:160},
  {key:'LFT',label:'LFT',price:600},
  {key:'LIPID',label:'LIPID PROFILE',price:800},
  {key:'UREA',label:'UREA',price:70},
  {key:'CREAT',label:'CREATININE',price:100},
  {key:'CAL',label:'CALCIUM',price:120},
  {key:'FSH',label:'FSH',price:400},
  {key:'RA',label:'RA FACTOR',price:200},
  {key:'CRP',label:'CRP',price:300},
  {key:'ASO',label:'ASO',price:250},
]
export default function AddTest(){ const nav = useNavigate(); const [patient_name,setPatient]=useState(''); const [age,setAge]=useState(''); const [sex,setSex]=useState('M'); const [selected,setSelected]=useState([]); const [advance,setAdvance]=useState(0); const [paid_to,setPaidTo]=useState(''); const [collected_by,setCollectedBy]=useState(''); const [test_by,setTestBy]=useState('Main Lab'); const [date,setDate]=useState(new Date().toISOString().slice(0,10))
function toggle(k){ setSelected(s=> s.includes(k) ? s.filter(x=>x!==k) : [...s,k]) }
const total = selected.reduce((s,k)=> s + (TESTS.find(t=>t.key===k)?.price||0),0)
const due = Math.max(0, total - (advance||0))
async function submit(e){ e.preventDefault(); try{ await post('/add_test',{patient_name,age,sex,tests:selected,total,advance,due,paid_to,collected_by,test_by,date}); nav('/tests') }catch(er){console.error(er);alert('Save failed')} }
return (<div className="card" style={{maxWidth:900}}><h2 className="h2">Add Test</h2><form onSubmit={submit} style={{display:'grid',gap:10}}><input className="input" value={patient_name} onChange={e=>setPatient(e.target.value)} placeholder="Patient name" required/><div style={{display:'flex',gap:8}}><input className="input" value={age} onChange={e=>setAge(e.target.value)} placeholder="Age" style={{width:120}}/><select className="input" value={sex} onChange={e=>setSex(e.target.value)} style={{width:120}}><option value="M">M</option><option value="F">F</option></select><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:180}}/></div><div><div className="small">Select tests</div><div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:8}}>{TESTS.map(t=>(<button type="button" key={t.key} onClick={()=>toggle(t.key)} className="btn" style={{borderColor: selected.includes(t.key) ? 'var(--accent)' : undefined}}>{t.label} — ₹{t.price}</button>))}</div></div><div style={{display:'flex',gap:8,alignItems:'center'}}><div className="small">Total: <strong>₹{total.toFixed(2)}</strong></div><input className="input" value={advance} onChange={e=>setAdvance(e.target.value)} placeholder="Advance" style={{width:140}}/><input className="input" value={paid_to} onChange={e=>setPaidTo(e.target.value)} placeholder="Paid to" style={{width:160}}/><input className="input" value={collected_by} onChange={e=>setCollectedBy(e.target.value)} placeholder="Collected by" style={{width:160}}/><input className="input" value={test_by} onChange={e=>setTestBy(e.target.value)} placeholder="Test by" style={{width:160}}/></div><div style={{display:'flex',gap:8}}><button className="btn" type="submit">Create</button><button className="btn" type="button" onClick={()=>window.history.back()}>Cancel</button></div></form></div>) }
