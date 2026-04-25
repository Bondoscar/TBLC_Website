import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

const Footer = () => {
  const { settings } = useSiteData();
  const info = settings.church_info || {};
  const social = settings.social_links || {};

  return (
    <footer className="bg-blue-950 text-white border-t-2 border-white/20" data-testid="footer">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://customer-assets.emergentagent.com/job_community-site-clone/artifacts/0yn2y1tq_image.png"
              alt="The Better Life Church"
              className="h-14 w-auto bg-white rounded-sm p-1"
            />
            <div className="flex flex-col leading-tight">
              <span className="serif-display text-lg font-semibold text-white tracking-wide">THE BETTER LIFE</span>
              <span className="serif-display text-lg font-semibold text-white tracking-wide">CHURCH</span>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            A progressive, visionary congregation with a passion for real spirituality, a love for family, a heart for community, and a zest for life.
          </p>
        </div>

        <div>
          <h4 className="text-sm tracking-[0.25em] mb-5 text-white">VISIT US</h4>
          <ul className="space-y-2 text-white/70 text-sm">
            {info.address && <li className="flex items-start gap-2" data-testid="footer-address"><MapPin size={14} className="mt-1 shrink-0" /> {info.address}</li>}
            {info.phone && <li className="flex items-center gap-2" data-testid="footer-phone"><Phone size={14} /> {info.phone}</li>}
            {info.email && <li className="flex items-center gap-2" data-testid="footer-email"><Mail size={14} /> {info.email}</li>}
          </ul>
          <div className="mt-5 text-white/70 text-sm space-y-1">
            {info.sunday_service && <div>Sunday Service: <span className="text-white">{info.sunday_service}</span></div>}
            {info.bible_study && <div>Bible Study: <span className="text-white">{info.bible_study}</span></div>}
            {info.prayer && <div>Special Program: <span className="text-white">{info.prayer}</span></div>}
          </div>
        </div>

        <div>
          <h4 className="text-sm tracking-[0.25em] mb-5 text-white">CONNECT</h4>
          <div className="flex items-center gap-3 mb-5">
            {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer" className="icon-btn"><Facebook size={16} /></a>}
            {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" className="icon-btn"><Instagram size={16} /></a>}
            {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer" className="icon-btn"><Youtube size={16} /></a>}
            {social.map && <a href={social.map} target="_blank" rel="noreferrer" className="icon-btn"><MapPin size={16} /></a>}
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/Donate" className="text-white/70 hover:text-white">Donate</Link></li>
            <li><Link to="/myblc" className="text-white/70 hover:text-white">TBLC</Link></li>
            <li><Link to="/events" className="text-white/70 hover:text-white">Events</Link></li>
          </ul>
        </div>
      </div>
      <div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 text-xs text-white/50 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} The Better Life Church. All rights reserved.</span>
          <span>The Better Life Church</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
