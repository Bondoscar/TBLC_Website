import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useToast } from '../hooks/use-toast';

const MyBLC = () => {
  const { settings } = useSiteData();
  const imgs = settings.site_images || {};
  const bannerImage = imgs.banner_direct || imgs.banner || '';
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', joining: 'no', names: '' });
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({ title: 'Missing info', description: 'Please provide your name and email.' });
      return;
    }
    setSubmitted(true);
    toast({ title: 'Thanks for your interest in myBLC!', description: 'We will be in touch soon.' });
  };

  return (
    <div className="bg-blue-950 text-white">
      <section className="pt-16 pb-10 px-6 lg:px-10 text-center">
        <div className="text-xs tracking-[0.3em] text-white/60 mb-3">NEW BELIEVERS CLASS</div>
        <h1 className="hero-title text-4xl md:text-6xl">TBLC</h1>
      </section>

      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[900px] mx-auto text-white/85 leading-relaxed">
          <p className="mb-5">
            Thank you for your interest in <span className="text-white">myBLC</span>! In our myBLC session we will talk about our church’s story thus far, how to grow in your personal relationship with Jesus, how to experience salvation and how you can get involved at The Better Life Church. Our desire is for Our Church to be Your Church.
          </p>
          <p className="mb-5">We believe that the time we spend together over these three weeks will help connect you to the vision of our church and the purpose God has for your life!</p>
          <p className="text-white">Our upcoming TBLC classes will be on <span className="font-semibold">April 19, April 26, May 3 at 10am</span>.</p>
        </div>
      </section>

      <section className="pb-20 px-6 lg:px-10">
        <div className="max-w-[760px] mx-auto p-8 md:p-10 border-2 border-white/20">
          <h2 className="section-title text-center mb-8">Register for TBLC</h2>
          {submitted ? (
            <div className="text-center">
              <CheckCircle2 size={40} className="mx-auto text-white mb-4" />
              <div className="serif-display text-2xl font-semibold">Thank you for your interest in TBLC!</div>
              <p className="text-white/75 mt-2">We will be in touch soon!</p>
              <Link to="/" className="btn-outline mt-6 inline-flex">Return to Website</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="text-xs tracking-[0.2em] text-white/70">NAME *</label>
                <input className="dark-input mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs tracking-[0.2em] text-white/70">EMAIL *</label>
                <input className="dark-input mt-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="text-xs tracking-[0.2em] text-white/70">PHONE</label>
                <input className="dark-input mt-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <div className="text-xs tracking-[0.2em] text-white/70 mb-3">WILL SOMEONE BE JOINING YOU FOR TBLC?</div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="join" checked={form.joining === 'yes'} onChange={() => setForm({ ...form, joining: 'yes' })} />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="join" checked={form.joining === 'no'} onChange={() => setForm({ ...form, joining: 'no' })} />
                    <span>No</span>
                  </label>
                </div>
              </div>
              {form.joining === 'yes' && (
                <div>
                  <label className="text-xs tracking-[0.2em] text-white/70">IF YES, PLEASE SPECIFY NAMES JOINING YOU</label>
                  <input className="dark-input mt-2" value={form.names} onChange={(e) => setForm({ ...form, names: e.target.value })} />
                </div>
              )}
              <div className="pt-2 text-center">
                <button type="submit" className="btn-solid">Submit</button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="relative w-full">
        <div className="relative h-[30vh] min-h-[220px]">
          {bannerImage && <img src={bannerImage} alt="myBLC" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative h-full flex items-center justify-center text-center px-6">
            <Link to="/" className="btn-outline">Return to Website</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyBLC;
