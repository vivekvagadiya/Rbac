import './App.css'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/" element={<div>hello</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
