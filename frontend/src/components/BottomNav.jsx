import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <div className="bottom-nav">
      <NavLink to="/dashboard">Home</NavLink>
      <NavLink to="/tests">Tests</NavLink>
      <NavLink to="/reports">Reports</NavLink>
      <NavLink to="/patients">Patients</NavLink>
    </div>
  );
}
