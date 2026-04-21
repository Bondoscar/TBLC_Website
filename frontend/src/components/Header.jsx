import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin, Mic, Menu, X } from 'lucide-react';
import { navLinks, socialLinks } from '../data/mock';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-blue-950 text-white sticky top-0 z-50 border-b border-blue-900">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="https://customer-assets.emergentagent.com/job_community-site-clone/artifacts/0yn2y1tq_image.png"
              alt="The Better Life Church"
              className="h-14 md:h-16 w-auto bg-white rounded-sm p-1"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="serif-display text-lg md:text-xl font-semibold text-white tracking-wide">THE BETTER LIFE</span>
              <span className="serif-display text-lg md:text-xl font-semibold text-white tracking-wide">CHURCH</span>
            </div>
          </Link>

          {/* Social + Nav (desktop) */}
          <div className="hidden lg:flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Facebook"><Facebook size={16} /></a>
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Instagram"><Instagram size={16} /></a>
              <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Youtube"><Youtube size={16} /></a>
              <a href={socialLinks.map} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Location"><MapPin size={16} /></a>              
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
          <div className="lg:hidden mt-4 pb-3 border-t border-blue-800 pt-4">
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
