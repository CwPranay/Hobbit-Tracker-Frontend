import { useState } from 'react'
import Login from "./pages/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Dashboard from './pages/Dashboard';
import Home from "./pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from './components/Navbar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
