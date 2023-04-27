import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import './style.css'
import Home from './Home'
import Ditails from './Ditails';

function App() {

  return (
      <HashRouter>
        
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details" element={<Ditails/>} />
        </Routes>

      </HashRouter>
  )
}

export default App
