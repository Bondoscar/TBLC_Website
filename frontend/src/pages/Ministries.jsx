import React from 'react';
import { ministries } from '../data/mock';

const Ministries = () => {
  return (
    <div className="bg-black text-white">
      <section className="pt-16 pb-10 px-6 lg:px-10 text-center border-b border-neutral-900">
        <div className="text-xs tracking-[0.3em] text-white/60 mb-3">TBLC</div>
        <h1 className="hero-title text-4xl md:text-6xl">Ministries</h1>
        <p className="mt-5 text-white/70 max-w-[700px] mx-auto">
          There is a place for you at The Better Life Church. Explore our ministries and find your community.
        </p>
      </section>

      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto space-y-16">
          {ministries.map((m, idx) => (
            <div key={m.id} className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div className="aspect-[4/3] overflow-hidden card-hover">
                <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs tracking-[0.3em] text-white/60 mb-3">MINISTRY</div>
                <h2 className="section-title mb-5">{m.title}</h2>
                <p className="text-white/80 leading-relaxed">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Ministries;
