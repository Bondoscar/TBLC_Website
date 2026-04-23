import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Play } from 'lucide-react';
import { useSiteData, imgFrom } from '../context/SiteDataContext';

const Home = () => {
  const { events, settings } = useSiteData();
  const imgs = settings.site_images || {};
  const info = settings.church_info || {};
  const social = settings.social_links || {};

  const heroImage = imgs.hero_direct || imgs.hero || '';
  const worshipImage = imgs.worship_direct || imgs.worship || '';
  const bannerImage = imgs.banner_direct || imgs.banner || '';

  return (
    <div className="bg-blue-950 text-white" data-testid="home-page">
      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[70vh] md:h-[80vh] max-h-[780px] min-h-[420px]">
          {heroImage && <img src={heroImage} alt="Worship" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-blue-950/30 to-blue-950/70" />
          <div className="relative z-10 flex items-center justify-center h-full px-6">
            <div className="text-center fade-up">
              <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl">In HIS presence, there's fullness of Joy.</h1>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/about" className="btn-outline" data-testid="home-about-link">About Us <ArrowRight size={14} /></Link>
                <Link to="/myblc" className="btn-solid" data-testid="home-join-link">Join TBLC <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="section-title text-center mb-12">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="home-events-grid">
            {events.slice(0, 2).map((e) => (
              <Link to="/events" key={e.id} className="group card-hover overflow-hidden relative block" data-testid={`home-event-${e.id}`}>
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={imgFrom(e)} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent flex flex-col justify-end p-6">
                  <div className="text-xs tracking-[0.2em] text-white/70 mb-1">{e.date}{e.time && ` · ${e.time}`}</div>
                  <h3 className="serif-display text-xl md:text-2xl font-semibold">{e.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Worship with us split */}
      <section className="relative w-full">
        <div className="relative">
          {worshipImage && <img src={worshipImage} alt="Worship with us" className="w-full h-[70vh] md:h-[85vh] object-cover" />}
          <div className="absolute inset-0 bg-blue-950/55" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1200px] mx-auto w-full px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="fade-up">
                <h2 className="section-title">Worship With Us</h2>
                <div className="mt-6 space-y-2 text-white/85">
                  {info.sunday_service && <div className="flex items-center gap-2"><Calendar size={16} /> Sunday Worship Service <span className="text-white">{info.sunday_service}</span></div>}
                  {info.bible_study && <div className="flex items-center gap-2"><Calendar size={16} /> {info.bible_study}</div>}
                  {info.prayer && <div className="flex items-center gap-2"><Calendar size={16} /> {info.prayer}</div>}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/events" className="btn-outline">Upcoming Events</Link>
                  {social.map && <a href={social.map} target="_blank" rel="noreferrer" className="btn-outline"><MapPin size={14} /> Directions</a>}
                </div>
              </div>
              <div className="fade-up">
                <h2 className="section-title">Join Us Online</h2>
                <p className="mt-6 text-white/85">
                  Join us live on Sunday and Wednesday, or catch up on a service you missed.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="https://www.youtube.com/@tblccanada/streams" target="_blank" rel="noreferrer" className="btn-solid"><Play size={14} /> Live Services</a>
                  <Link to="/media" className="btn-outline">Archived Services</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - myBLC */}
      <section className="relative w-full">
        <div className="relative h-[40vh] min-h-[280px]">
          {bannerImage && <img src={bannerImage} alt="TBLC" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-blue-950/65" />
          <div className="relative h-full flex items-center justify-center text-center px-6">
            <div>
              <h2 className="section-title">Want to learn more about The Better Life Church?</h2>
              <div className="mt-6">
                <Link to="/myblc" className="btn-outline">Join The TBLC Family <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="py-20 px-6 lg:px-10">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="section-title">Welcome Home</h2>
          <p className="mt-6 text-white/80 text-lg leading-relaxed">
            {settings.about_content?.intro || ''}
          </p>
          <div className="mt-8">
            <Link to="/about" className="btn-outline">Learn More <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
