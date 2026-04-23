// Static layout config for TBLC. All content (events, ministries, sermons,
// pastors, newsletters, site images, church info, social links, about page)
// now comes from MongoDB via the `/api/bootstrap` endpoint — see
// `src/context/SiteDataContext.jsx` and `src/lib/api.js`.
//
// Manage live content at `/admin`.

export const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'ABOUT', path: '/about' },
  // { name: 'MINISTRIES', path: '/ministries' },
  { name: 'MEDIA', path: '/media' },
  { name: 'EVENTS', path: '/events' },
  { name: 'DONATE', path: '/Donate' },
  // { name: 'RESOURCES', path: '/resources' },
];
