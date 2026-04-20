import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import Media from './pages/Media';
import Events from './pages/Events';
import Give from './pages/Give';
import Resources from './pages/Resources';
import MyCCC from './pages/MyCCC';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="App min-h-screen bg-black">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/media" element={<Media />} />
          <Route path="/events" element={<Events />} />
          <Route path="/give" element={<Give />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/myccc" element={<MyCCC />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
