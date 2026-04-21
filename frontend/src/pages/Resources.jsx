import React, { useState } from 'react';
import { FileDown, UserPlus, CheckCircle2 } from 'lucide-react';
import { newsletters } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const Resources = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ first: '', last: '', email: '' });
  const [subscribed, setSubscribed] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.first || !form.email) {
      toast({ title: 'Missing info', description: 'Please provide your first name and email.' });
      return;
    }
    setSubscribed(true);
    toast({ title: 'Thanks for subscribing!', description: 'You\'ll now receive our weekly newsletter.' });
  };

  return (
    <div className="bg-blue-950 text-white">
      <section className="pt-16 pb-10 px-6 lg:px-10 text-center">
        <div className="text-xs tracking-[0.3em] text-white/60 mb-3">RESOURCES</div>
        <h1 className="hero-title text-4xl md:text-6xl">Resources</h1>
      </section>

      {/* Newsletter signup */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[900px] mx-auto">
          <h2 className="section-title text-center mb-3">Sign up for our weekly newsletter</h2>
          <p className="text-white/65 text-center mb-8">Stay connected with everything happening at The Better Life Church.</p>
          {subscribed ? (
            <div className="p-8 text-center border-2 border-white/20">
              <CheckCircle2 size={36} className="mx-auto text-white mb-3" />
              <div className="serif-display text-2xl font-semibold">Thanks for subscribing!</div>
              <p className="text-white/70 mt-2">We’ll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input className="dark-input" placeholder="First name" value={form.first} onChange={(e) => setForm({ ...form, first: e.target.value })} />
              <input className="dark-input" placeholder="Last name" value={form.last} onChange={(e) => setForm({ ...form, last: e.target.value })} />
              <input className="dark-input" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <div className="md:col-span-3 flex justify-center">
                <button type="submit" className="btn-solid">Subscribe</button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Newsletters */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="section-title text-center mb-10">Monthly Newsletters</h2>
          <p className="text-center text-white/70 mb-10">View our recent monthly newsletters in PDF.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newsletters.map((n, i) => (
              <a key={i} href={n.url} className="border-2 border-white/20 px-5 py-4 flex items-center justify-between hover:bg-white hover:text-blue-950 transition-colors group">
                <span className="text-sm tracking-[0.15em]">{n.month}</span>
                <FileDown size={16} className="opacity-70 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Other resources */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="section-title text-center mb-10">Other Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 card-hover border-2 border-white/20">
              <UserPlus size={24} className="text-white mb-4" />
              <h3 className="serif-display text-xl font-semibold mb-3">Members Area</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-5">
                Only available for local members with an existing profile. Access donation & pledge management, group management, member directory, membership, emails & notes, and volunteer scheduling.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://capitalcommunity.ccbchurch.com/" target="_blank" rel="noreferrer" className="btn-outline">Log in</a>
                <a href="https://capitalcommunity.ccbchurch.com/w_sign_up.php" target="_blank" rel="noreferrer" className="btn-outline">Request log-in</a>
              </div>
            </div>
            <div className="p-8 card-hover border-2 border-white/20">
              <FileDown size={24} className="text-white mb-4" />
              <h3 className="serif-display text-xl font-semibold mb-3">Forms & Documents</h3>
              <ul className="space-y-3 text-white/80 text-sm">
                <li><a href="#" className="hover:text-white underline underline-offset-4">Ministry Finder</a></li>
                <li><a href="#" className="hover:text-white underline underline-offset-4">Ministry Finder Application Form</a></li>
                <li><a href="#" className="hover:text-white underline underline-offset-4">Child Dedication Information</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
