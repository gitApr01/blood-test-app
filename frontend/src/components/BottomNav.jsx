import React from "react";
import { useNavigate } from "react-router-dom";
export default function BottomNav(){
  const nav = useNavigate();
  return (
    <div className="bottomNav">
      <button onClick={()=>nav("/dashboard")}>Home</button>
      <button onClick={()=>nav("/add")}>Add</button>
      <button onClick={()=>nav("/tests")}>Tests</button>
      <button onClick={()=>nav("/reports")}>Reports</button>
    </div>
  );
}
