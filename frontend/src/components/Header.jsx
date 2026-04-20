import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin, Mic, Menu, X } from 'lucide-react';
import { navLinks, socialLinks } from '../data/mock';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-black text-white sticky top-0 z-50 border-b border-neutral-900">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-end leading-tight">
              <span className="ccc-script text-[32px] md:text-[40px] text-white leading-[0.85]">capital</span>
              <span className="text-[8px] md:text-[9px] tracking-[0.38em] text-white/90 mt-0.5">COMMUNITY</span>
              <span className="text-[8px] md:text-[9px] tracking-[0.38em] text-white/90">CHURCH</span>
            </div>
            <div className="ccc-script text-5xl md:text-6xl text-white leading-none">CCC</div>
          </Link>

          {/* Social + Nav (desktop) */}
          <div className="hidden lg:flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Facebook"><Facebook size={16} /></a>
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Instagram"><Instagram size={16} /></a>
              <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Youtube"><Youtube size={16} /></a>
              <a href={socialLinks.map} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Location"><MapPin size={16} /></a>
              <a href={socialLinks.podcast} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Podcast"><Mic size={16} /></a>
            </div>
            <nav className="flex items-center gap-7">
              {navLinks.map((l) => (
                <NavLink
                  key={l.name}
                  to={l.path}
                  end={l.path === '/'}
                  className={({ isActive }) =>
                    `text-[13px] tracking-[0.18em] font-medium transition-colors duration-200 hover:text-white ${
                      isActive ? 'text-white' : 'text-white/75'
                    }`
                  }
                >
                  {l.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden mt-4 pb-3 border-t border-neutral-800 pt-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <NavLink
                  key={l.name}
                  to={l.path}
                  end={l.path === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-sm tracking-[0.2em] py-1 ${isActive ? 'text-white' : 'text-white/75'}`
                  }
                >
                  {l.name}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-3 mt-4">
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="icon-btn"><Facebook size={16} /></a>
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="icon-btn"><Instagram size={16} /></a>
              <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="icon-btn"><Youtube size={16} /></a>
              <a href={socialLinks.map} target="_blank" rel="noreferrer" className="icon-btn"><MapPin size={16} /></a>
              <a href={socialLinks.podcast} target="_blank" rel="noreferrer" className="icon-btn"><Mic size={16} /></a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
