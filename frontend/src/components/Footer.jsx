import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin, Mic, Mail, Phone } from 'lucide-react';
import { socialLinks, churchInfo } from '../data/mock';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-neutral-900">
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
              {/* <span className="text-[9px] tracking-[0.38em] text-white/80 mt-0.5">CHURCH</span> */}
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
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-1 shrink-0" /> {churchInfo.address}</li>
            <li className="flex items-center gap-2"><Phone size={14} /> {churchInfo.phone}</li>
            <li className="flex items-center gap-2"><Mail size={14} /> {churchInfo.email}</li>
          </ul>
          <div className="mt-5 text-white/70 text-sm space-y-1">
            <div>Sunday Service: <span className="text-white">{churchInfo.sundayService}</span></div>
            <div>Bible Study: <span className="text-white">{churchInfo.bibleStudy}</span></div>
            <div>Prayer: <span className="text-white">{churchInfo.prayer}</span></div>
          </div>
        </div>

        <div>
          <h4 className="text-sm tracking-[0.25em] mb-5 text-white">CONNECT</h4>
          <div className="flex items-center gap-3 mb-5">
            <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="icon-btn"><Facebook size={16} /></a>
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="icon-btn"><Instagram size={16} /></a>
            <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="icon-btn"><Youtube size={16} /></a>
            <a href={socialLinks.map} target="_blank" rel="noreferrer" className="icon-btn"><MapPin size={16} /></a>            
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/Donate" className="text-white/70 hover:text-white">Donate</Link></li>
            <li><Link to="/myblc" className="text-white/70 hover:text-white">TBLC</Link></li>
            {/* <li><Link to="/resources" className="text-white/70 hover:text-white">Resources</Link></li> */}
            <li><Link to="/events" className="text-white/70 hover:text-white">Events</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 text-xs text-white/50 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} The Better Life Church. All rights reserved.</span>
          <span>The Better Life Church</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
