// Shared site-data context. A single /api/bootstrap call populates every
// public page, avoiding N requests on each route change.
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchBootstrap } from '../lib/api';

const SiteDataContext = createContext(null);

const EMPTY = {
  events: [],
  ministries: [],
  sermons: [],
  pastors: [],
  newsletters: [],
  settings: {
    church_info: {},
    social_links: {},
    about_content: { beliefs: [] },
    site_images: {},
  },
};

export const SiteDataProvider = ({ children }) => {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchBootstrap();
      setData({
        events: res.events || [],
        ministries: res.ministries || [],
        sermons: res.sermons || [],
        pastors: res.pastors || [],
        newsletters: res.newsletters || [],
        settings: {
          church_info: res.settings?.church_info || {},
          social_links: res.settings?.social_links || {},
          about_content: res.settings?.about_content || { beliefs: [] },
          site_images: res.settings?.site_images || {},
        },
      });
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SiteDataContext.Provider value={{ ...data, loading, error, reload: load }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used inside SiteDataProvider');
  return ctx;
};

// Helpers that map backend doc shape → what the old mock objects exposed
export const imgFrom = (doc, key = 'image_url', fallbackKey = 'image_direct_url') =>
  doc?.[fallbackKey] || doc?.[key] || '';
