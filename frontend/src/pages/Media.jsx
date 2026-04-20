import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { sermons } from '../data/mock';

const Media = () => {
  const [current, setCurrent] = useState(null);

  return (
    <div className="bg-black text-white">
      <section className="pt-16 pb-10 px-6 lg:px-10 text-center border-b border-neutral-900">
        <div className="text-xs tracking-[0.3em] text-white/60 mb-3">MEDIA</div>
        <h1 className="hero-title text-4xl md:text-6xl">Archived Services</h1>
        <p className="mt-5 text-white/75 max-w-[760px] mx-auto">
          We pray that, wherever you are, you will worship, praise, sing, and pray right along with us. The presence and power of God are not confined to a building or a particular time; so as you watch our archived services, let God minister to you!
        </p>
      </section>

      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((s) => (
            <button
              key={s.id}
              onClick={() => setCurrent(s)}
              className="group text-left card-hover"
            >
              <div className="relative aspect-video overflow-hidden bg-neutral-900">
                <img
                  src={`https://i.ytimg.com/vi/${s.youtubeId}/hqdefault.jpg`}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={22} fill="#000" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1">{s.duration}</div>
              </div>
              <div className="pt-4">
                <h3 className="serif-display text-lg font-semibold">{s.title}</h3>
                <p className="text-white/60 text-sm mt-1">{s.speaker}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Video modal */}
      {current && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center px-4 py-6" onClick={() => setCurrent(null)}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setCurrent(null)}
              className="absolute -top-12 right-0 text-white hover:text-white/70 flex items-center gap-2 text-sm tracking-[0.2em]"
            >
              CLOSE <X size={18} />
            </button>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1`}
                title={current.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-4 text-white">
              <h3 className="serif-display text-2xl font-semibold">{current.title}</h3>
              <p className="text-white/60 mt-1">{current.speaker}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
