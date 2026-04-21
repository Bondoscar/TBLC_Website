import React from 'react';
import { CreditCard, Mail, Heart } from 'lucide-react';
import { bannerImage } from '../data/mock';

const Give = () => {
  return (
    <div className="bg-black text-white">
      <section className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
        <img src={bannerImage} alt="Give" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div>
            <div className="text-xs tracking-[0.3em] text-white/70 mb-3">Donate</div>
            <h1 className="hero-title text-4xl md:text-6xl">Donation</h1>
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
        <div className="max-w-[1100px] mx-auto">
          <h2 className="section-title text-center mb-10">How to Donate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/*     <a href="https://tithe.ly/give?c=674912" target="_blank" rel="noreferrer" className="border border-neutral-800 p-8 card-hover block">
              <CreditCard size={28} className="text-white mb-4" />
              <h3 className="serif-display text-xl font-semibold mb-2">Online Giving via Tithely</h3>
              <p className="text-white/70 text-sm leading-relaxed">A safe and easy way to support the ministries of The Better Life Church either with a one-time or recurring donation.</p>
            </a>
            <a href="https://www.paypal.com" target="_blank" rel="noreferrer" className="border border-neutral-800 p-8 card-hover block">
              <Heart size={28} className="text-white mb-4" />
              <h3 className="serif-display text-xl font-semibold mb-2">PayPal Donations</h3>
              <p className="text-white/70 text-sm leading-relaxed">Support the church by making a one-time contribution or establishing a recurring contribution through PayPal.</p>
            </a> */}
            <a href="mailto:tblccanada@gmail.com" className="border border-neutral-800 p-8 card-hover block">
              <Mail size={28} className="text-white mb-4" />
              <h3 className="serif-display text-xl font-semibold mb-2">Interac E-Transfer</h3>
              <p className="text-white/70 text-sm leading-relaxed">Available by sending to email: tblccanada@gmail.com</p>
            </a>
          </div>
          <p className="text-center text-white/70 mt-12 max-w-[780px] mx-auto leading-relaxed">
            Thank you for your faithful support of The Better Life Church. It is because of your regular donations that we can reach out locally and online in proclaiming the gospel of Jesus Christ!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Give;
