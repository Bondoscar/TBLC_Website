import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin, Mic, Menu, X } from 'lucide-react';
import { navLinks } from '../data/mock';
import { useSiteData } from '../context/SiteDataContext';

const Header = () => {
  const [open, setOpen] = useState(false);
  const { settings } = useSiteData();
  const social = settings.social_links || {};

  return (
    <header className="w-full bg-blue-950 text-white sticky top-0 z-50 border-b-2 border-white/20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" data-testid="header-home-link">
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
              {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Facebook" data-testid="social-facebook"><Facebook size={16} /></a>}
              {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Instagram" data-testid="social-instagram"><Instagram size={16} /></a>}
              {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Youtube" data-testid="social-youtube"><Youtube size={16} /></a>}
              {social.map && <a href={social.map} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Location" data-testid="social-map"><MapPin size={16} /></a>}
            </div>
            <nav className="flex items-center gap-7" data-testid="desktop-nav">
              {navLinks.map((l) => (
                <NavLink
                  key={l.name}
                  to={l.path}
                  end={l.path === '/'}
                  data-testid={`nav-${l.name.toLowerCase()}`}
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
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden mt-4 pb-3 pt-4" data-testid="mobile-nav">
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
              {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer" className="icon-btn"><Facebook size={16} /></a>}
              {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" className="icon-btn"><Instagram size={16} /></a>}
              {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer" className="icon-btn"><Youtube size={16} /></a>}
              {social.map && <a href={social.map} target="_blank" rel="noreferrer" className="icon-btn"><MapPin size={16} /></a>}
              {social.podcast && <a href={social.podcast} target="_blank" rel="noreferrer" className="icon-btn"><Mic size={16} /></a>}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
