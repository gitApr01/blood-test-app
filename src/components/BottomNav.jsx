import React from 'react'
import { Link } from 'react-router-dom'

export default function BottomNav(){
  return (
    <div style={{position:'fixed',right:16,bottom:16}}>
      <Link to="/add-test"><button className="fab" title="Add Test">+</button></Link>
    </div>
  )
}
