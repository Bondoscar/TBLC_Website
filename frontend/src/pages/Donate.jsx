import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

const resolveDriveImageUrl = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const match = raw.match(/(?:\/d\/|id=)([a-zA-Z0-9-_]+)/);
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w2000`;
  }
  return raw;
};

const Give = () => {
  const { settings } = useSiteData();
  const imgs = settings.site_images || {};
  const donateContent = settings.donate_content || {};
  const bannerImage = resolveDriveImageUrl(donateContent.hero_image_direct || donateContent.hero_image || imgs.banner_direct || imgs.banner || '');
  const rawCards = Array.isArray(donateContent.cards)
    ? donateContent.cards
    : Array.isArray(donateContent.payment_options)
      ? donateContent.payment_options
      : Array.isArray(donateContent.options)
        ? donateContent.options
        : [];
  const cards = rawCards.filter((card) => card && (card.title || card.description || card.button_label || card.link || card.payment_link || card.url || card.image_url || card.image_direct_url));

  return (
    <div className="bg-blue-950 text-white" data-testid="donate-page">
      <section className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
        {bannerImage && <img src={bannerImage} alt="Give" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-blue-950/65" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div>
            <div className="text-xs tracking-[0.3em] text-white/70 mb-3">Donate</div>
            <h1 className="hero-title text-4xl md:text-6xl">{donateContent.hero_title || 'Donation'}</h1>
            {donateContent.hero_subtitle && <p className="mt-4 text-white/75 max-w-[700px] mx-auto">{donateContent.hero_subtitle}</p>}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[900px] mx-auto">
          <blockquote className="serif-display text-xl md:text-2xl italic text-white/85 text-center leading-relaxed">
            “God Loves a cheerful giver”
            <footer className="text-sm not-italic tracking-[0.2em] text-white/60 mt-4">— 2 Corinthians 9:7</footer>
          </blockquote>
        </div>
      </section>

      <section className="pb-20 px-6 lg:px-10">
        {cards.length > 0 ? (
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {cards.map((card, index) => (
              <div key={`${card.title}-${index}`} className="border-2 border-white/20 card-hover overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-white/10">
                  {card.image_url || card.image_direct_url ? (
                    <img src={resolveDriveImageUrl(card.image_direct_url || card.image_url)} alt={card.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60">
                      <Mail size={28} />
                    </div>
                  )}
                </div>
                <div className="p-7">
                  <h3 className="serif-display text-2xl font-semibold">{card.title}</h3>
                  {card.description && <p className="mt-4 text-white/75 leading-relaxed">{card.description}</p>}
                  {/* <div className="mt-6">
                    <a
                      href={card.link || card.payment_link || card.url || '#'}
                      className="btn-outline inline-flex items-center gap-2"
                      target={card.link || card.payment_link || card.url ? '_blank' : undefined}
                      rel={card.link || card.payment_link || card.url ? 'noreferrer' : undefined}
                    >
                      {card.button_label || 'Learn More'} <ArrowRight size={14} />
                    </a>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-[900px] mx-auto border border-dashed border-white/20 p-10 text-center text-white/60">
            Donation options will appear here once they have been set up in the admin panel.
          </div>
        )}
        <p className="text-center text-white/70 mt-12 max-w-[780px] mx-auto leading-relaxed">
          Thank you for your faithful support of The Better Life Church. It is because of your regular donations that we can reach out locally and online in proclaiming the gospel of Jesus Christ!
        </p>
      </section>
    </div>
  );
};

export default Give;
