import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { aboutContent, worshipImage } from '../data/mock';

const About = () => {
  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[320px] w-full overflow-hidden">
        <img src={worshipImage} alt="About" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex items-center justify-center h-full px-6">
          <div className="text-center fade-up">
            <div className="text-xs tracking-[0.3em] text-white/70 mb-3">ABOUT</div>
            <h1 className="hero-title text-4xl md:text-6xl">Welcome Home</h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 px-6 lg:px-10">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-white/85 text-lg leading-relaxed">{aboutContent.intro}</p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="px-6 lg:px-10 pb-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-neutral-800 p-10 card-hover">
            <div className="text-xs tracking-[0.3em] text-white/60 mb-3">OUR MISSION</div>
            <h3 className="serif-display text-2xl font-semibold mb-4">To know Christ and make Him known</h3>
            <p className="text-white/75 leading-relaxed">{aboutContent.mission}</p>
          </div>
          <div className="border border-neutral-800 p-10 card-hover">
            <div className="text-xs tracking-[0.3em] text-white/60 mb-3">OUR VISION</div>
            <h3 className="serif-display text-2xl font-semibold mb-4">A family of believers</h3>
            <p className="text-white/75 leading-relaxed">{aboutContent.vision}</p>
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section className="py-20 px-6 lg:px-10 border-t border-neutral-900">
        <div className="max-w-[900px] mx-auto">
          <h2 className="section-title text-center mb-12">What We Believe</h2>
          <ul className="space-y-4">
            {aboutContent.beliefs.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-white/85 text-lg">
                <CheckCircle2 size={20} className="mt-1 text-white shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pastors */}
      <section className="py-20 px-6 lg:px-10 border-t border-neutral-900">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="section-title text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutContent.pastors.map((p, i) => (
              <div key={i} className="text-center card-hover">
                <div className="aspect-square overflow-hidden mb-5 bg-neutral-900">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="serif-display text-xl font-semibold">{p.name}</h3>
                <p className="text-white/60 text-sm tracking-[0.15em] mt-1">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-10 text-center border-t border-neutral-900">
        <h2 className="section-title mb-5">Come Visit Us</h2>
        <p className="text-white/75 max-w-[600px] mx-auto mb-8">We’d love to meet you this Sunday. Our services are warm, welcoming, and designed to help you encounter God.</p>
        <Link to="/myccc" className="btn-outline">Join myCCC <ArrowRight size={14} /></Link>
      </section>
    </div>
  );
};

export default About;
