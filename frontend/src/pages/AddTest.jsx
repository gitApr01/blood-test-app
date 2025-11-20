import React, {useState} from 'react'
export default function AddTest(){
  const [patient_name,setPatientName]=useState('')
  const [age,setAge]=useState('')
  const [sex,setSex]=useState('M')
  async function submit(){
    const payload = {patient_name,age,sex,tests:[],advance:0}
    const res = await fetch('https://blood-test-app.onrender.com/add_test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    const data = await res.json()
    if(data.success){ alert('Saved') ; setPatientName(''); setAge('') }
    else alert('Error')
  }
  return (
    <div className="container">
      <div className="card"><h2>Add Test</h2>
        <label className="label">Patient name</label><input value={patient_name} onChange={e=>setPatientName(e.target.value)}/>
        <label className="label">Age</label><input value={age} onChange={e=>setAge(e.target.value)}/>
        <label className="label">Sex</label>
        <select value={sex} onChange={e=>setSex(e.target.value)}><option value='M'>Male</option><option value='F'>Female</option></select>
        <div style={{marginTop:10}}><button className="btn-primary" onClick={submit}>Save</button></div>
      </div>
    </div>
  )
}
