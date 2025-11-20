import React, {useState, useEffect} from 'react'
import { apiFetch } from '../api.js'
import { useNavigate } from 'react-router-dom'

export default function AddTest(){
  const nav = useNavigate()
  const [catalog,setCatalog] = useState([])
  const [rows,setRows] = useState([])
  const [patient,setPatient] = useState({patient_name:'',age:'',sex:'Male',date:''})
  const [saving,setSaving] = useState(false)

  useEffect(()=>{ (async()=>{ try{ const c = await apiFetch('/tests_catalog', {method:'GET'}); setCatalog(c||[]) }catch(e){ console.error(e) } })() },[])

  function addRow(){
    setRows(r=>[...r, {id:Date.now(), test_name:'', price:0}])
  }
  function removeRow(id){ setRows(r=>r.filter(x=>x.id!==id)) }
  function updateRow(id, key, val){ setRows(r=>r.map(x=> x.id===id ? {...x, [key]: val} : x)) }

  const total = rows.reduce((s,x)=> s + (parseFloat(x.price)||0), 0)
  const due = total - (parseFloat(patient.advance)||0 || 0)

  async function save(){
    if(!patient.patient_name) return alert('Enter patient name')
    setSaving(true)
    try{
      const body = {
        patient_name: patient.patient_name,
        age: patient.age,
        sex: patient.sex,
        date: patient.date,
        tests: rows.map(r=>({name: r.test_name, price: parseFloat(r.price)||0})),
        advance: parseFloat(patient.advance)||0,
        paid_to: '',
        collected_by: 1,
        created_by: 1,
        test_by: ''
      }
      await apiFetch('/add_test', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
      alert('Saved')
      nav('/tests')
    }catch(e){ console.error(e); alert('Save failed') }
    setSaving(false)
  }

  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Add Test</h2>
        <div><button className="btn btn-ghost" onClick={()=>nav(-1)}>Back</button></div>
      </div>

      <label>Patient name</label>
      <input value={patient.patient_name} onChange={e=>setPatient({...patient, patient_name:e.target.value})} />

      <div className="row" style={{marginTop:8}}>
        <div style={{flex:1}}>
          <label>Age</label>
          <input value={patient.age} onChange={e=>setPatient({...patient, age:e.target.value})} />
        </div>
        <div style={{width:140}}>
          <label>Sex</label>
          <select value={patient.sex} onChange={e=>setPatient({...patient, sex:e.target.value})}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <div style={{width:180}}>
          <label>Date</label>
          <input type="date" value={patient.date} onChange={e=>setPatient({...patient, date:e.target.value})} />
        </div>
      </div>

      <div style={{marginTop:12}}>
        <h3>Tests</h3>
        {rows.map(r=>(
          <div key={r.id} style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
            <select style={{flex:1}} value={r.test_name} onChange={e=>{
              const name = e.target.value
              const found = catalog.find(c=>c.name===name)
              updateRow(r.id,'test_name', name)
              if(found) updateRow(r.id,'price', found.price)
            }}>
              <option value="">-- select --</option>
              {catalog.map(c=> <option key={c.id} value={c.name}>{c.name} — ₹{c.price}</option>)}
            </select>
            <input style={{width:120}} value={r.price} onChange={e=>updateRow(r.id,'price', e.target.value)} />
            <button className="btn btn-ghost" onClick={()=>removeRow(r.id)}>Remove</button>
          </div>
        ))}
        <div style={{marginTop:8}}>
          <button className="btn btn-primary" onClick={addRow}>Add Test Row</button>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <label>Advance</label>
        <input value={patient.advance||0} onChange={e=>setPatient({...patient, advance: e.target.value})} />
      </div>

      <div style={{marginTop:12,display:'flex',gap:8}}>
        <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button className="btn btn-ghost" onClick={()=>nav(-1)}>Cancel</button>
        <div style={{marginLeft:'auto',alignSelf:'center'}}><strong>Total: ₹{total}</strong> <span className="muted">Due: ₹{due}</span></div>
      </div>
    </div>
  )
}
