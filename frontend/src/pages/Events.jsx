import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { upcomingEvents } from '../data/mock';

const Events = () => {
  return (
    <div className="bg-blue-950 text-white">
      <section className="pt-16 pb-10 px-6 lg:px-10 text-center border-b border-blue-900">
        <div className="text-xs tracking-[0.3em] text-white/60 mb-3">EVENTS</div>
        <h1 className="hero-title text-4xl md:text-6xl">Upcoming Events</h1>
        <p className="mt-5 text-white/70 max-w-[700px] mx-auto">
          Stay connected with what’s happening at The Better Life Church.
        </p>
      </section>

      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingEvents.map((e) => (
            <div key={e.id} className="border border-blue-800 card-hover overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={e.image} alt={e.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-7">
                <h3 className="serif-display text-2xl font-semibold">{e.title}</h3>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-2"><Calendar size={14} /> {e.date}</span>
                  <span className="flex items-center gap-2"><Clock size={14} /> {e.time}</span>
                </div>
                <p className="mt-4 text-white/75 leading-relaxed">{e.description}</p>
                <div className="mt-6">
                  <Link to="/myblc" className="btn-outline">Sign Up <ArrowRight size={14} /></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Events;
