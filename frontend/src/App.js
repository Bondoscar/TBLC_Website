import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import Media from './pages/Media';
import Events from './pages/Events';
import Donate from './pages/Donate';
import Resources from './pages/Resources';
import MyBLC from './pages/MyBLC';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="App min-h-screen" style={{background: 'linear-gradient(135deg, #1a2a4a 0%, #1e3a5f 100%)'}}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/media" element={<Media />} />
          <Route path="/events" element={<Events />} />
          <Route path="/Donate" element={<Donate />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/myblc" element={<MyBLC />} />
          <Route path="/myccc" element={<Navigate to="/myblc" replace />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
