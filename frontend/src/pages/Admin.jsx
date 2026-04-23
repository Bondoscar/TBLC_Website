import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import ImagePreview from '../components/ImagePreview';
import {
  adminLogin,
  adminMe,
  eventsApi,
  ministriesApi,
  sermonsApi,
  pastorsApi,
  newslettersApi,
  settingsApi,
  setToken,
  getToken,
} from '../lib/api';
import { useSiteData } from '../context/SiteDataContext';

// ---------------------------------------------------------------------------
// Small shared styles/components
// ---------------------------------------------------------------------------
const inputCls =
  'w-full bg-blue-950/60 border-2 border-white/20 text-white px-3 py-2 text-sm outline-none focus:border-white/60 placeholder-white/40';
const labelCls = 'text-[11px] tracking-[0.2em] text-white/70';

const Field = ({ label, children }) => (
  <label className="block">
    <div className={labelCls}>{label}</div>
    <div className="mt-1">{children}</div>
  </label>
);

const Btn = ({ children, variant = 'solid', className = '', ...rest }) => (
  <button
    {...rest}
    className={`inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.2em] font-medium transition-colors ${
      variant === 'solid'
        ? 'bg-white text-blue-950 hover:bg-white/90 disabled:opacity-60'
        : variant === 'danger'
          ? 'border-2 border-red-400/60 text-red-200 hover:bg-red-500/20'
          : 'border-2 border-white/30 text-white hover:bg-white/10'
    } ${className}`}
  >
    {children}
  </button>
);

// ---------------------------------------------------------------------------
// Login view
// ---------------------------------------------------------------------------
const Login = ({ onSuccess }) => {
  const { toast } = useToast();
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await adminLogin(pw);
      setToken(res.token);
      toast({ title: 'Signed in' });
      onSuccess();
    } catch (err) {
      toast({ title: 'Login failed', description: err?.response?.data?.detail || err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 text-white flex items-center justify-center px-6" data-testid="admin-login-page">
      <form onSubmit={submit} className="w-full max-w-md border-2 border-white/20 p-8">
        <div className="text-xs tracking-[0.3em] text-white/60 mb-3">TBLC ADMIN</div>
        <h1 className="serif-display text-3xl font-semibold mb-6">Sign in</h1>
        <Field label="ADMIN PASSWORD">
          <input
            className={inputCls}
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            data-testid="admin-login-password"
          />
        </Field>
        <div className="mt-6">
          <Btn type="submit" disabled={busy} data-testid="admin-login-submit">
            {busy ? 'Signing in…' : 'Sign in'}
          </Btn>
        </div>
        <div className="mt-6 text-xs text-white/50">
          <Link to="/" className="underline underline-offset-4 hover:text-white">← Back to site</Link>
        </div>
      </form>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Generic resource table (shared by Events/Ministries/Sermons/Pastors/Newsletters)
// ---------------------------------------------------------------------------
const ResourceTable = ({
  title,
  api,
  columns,
  emptyDefaults,
  renderForm,
  imageField,
  tabKey,
  onAfterChange,
}) => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // the doc being edited (or {} for new)

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      toast({ title: 'Failed to load', description: e?.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNew = () => setEditing({ ...emptyDefaults });
  const startEdit = (doc) => setEditing({ ...doc });

  const save = async () => {
    try {
      const { id, created_at, updated_at, image_direct_url, file_direct_url, ...payload } = editing;
      if (id) await api.update(id, payload);
      else await api.create(payload);
      toast({ title: 'Saved' });
      setEditing(null);
      await load();
      onAfterChange?.();
    } catch (e) {
      toast({ title: 'Save failed', description: e?.response?.data?.detail || e?.message });
    }
  };

  const remove = async (doc) => {
    if (!window.confirm(`Delete "${doc.title || doc.name || doc.month || doc.id}"?`)) return;
    try {
      await api.remove(doc.id);
      toast({ title: 'Deleted' });
      await load();
      onAfterChange?.();
    } catch (e) {
      toast({ title: 'Delete failed', description: e?.message });
    }
  };

  return (
    <div data-testid={`${tabKey}-panel`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="serif-display text-2xl font-semibold">{title}</h2>
        <Btn onClick={startNew} data-testid={`${tabKey}-new-btn`}>+ New</Btn>
      </div>

      <div className="border border-white/15 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              {imageField && <th className="text-left px-3 py-2 w-20">Image</th>}
              {columns.map((c) => (
                <th key={c.key} className="text-left px-3 py-2">{c.label}</th>
              ))}
              <th className="text-right px-3 py-2 w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + 2} className="px-3 py-6 text-center text-white/50">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={columns.length + 2} className="px-3 py-6 text-center text-white/50">No items yet.</td></tr>
            ) : items.map((it) => (
              <tr key={it.id} className="border-t border-white/10" data-testid={`${tabKey}-row-${it.id}`}>
                {imageField && (
                  <td className="px-3 py-2">
                    <ImagePreview url={it[imageField]} className="w-14 h-14" />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2 align-top">
                    {c.render ? c.render(it) : <span className="text-white/80">{String(it[c.key] ?? '')}</span>}
                  </td>
                ))}
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  <Btn variant="outline" onClick={() => startEdit(it)} data-testid={`${tabKey}-edit-${it.id}`}>Edit</Btn>{' '}
                  <Btn variant="danger" onClick={() => remove(it)} data-testid={`${tabKey}-delete-${it.id}`}>Delete</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[200] bg-blue-950/80 flex items-start justify-center overflow-y-auto p-6" onClick={() => setEditing(null)}>
          <div className="bg-blue-950 border-2 border-white/20 max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()} data-testid={`${tabKey}-form`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="serif-display text-xl font-semibold">{editing.id ? 'Edit' : 'New'} {title.replace(/s$/, '')}</h3>
              <button className="text-white/60 hover:text-white" onClick={() => setEditing(null)}>✕</button>
            </div>
            <div className="space-y-4">
              {renderForm(editing, setEditing)}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Btn variant="outline" onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn onClick={save} data-testid={`${tabKey}-form-save`}>Save</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Settings (Church info, Social links, About, Site images)
// ---------------------------------------------------------------------------
const SettingsPanel = ({ onAfterChange }) => {
  const { toast } = useToast();
  const [data, setData] = useState({
    church_info: {},
    social_links: {},
    about_content: { beliefs: [] },
    site_images: {},
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const d = await settingsApi.getAll();
      setData({
        church_info: d.church_info || {},
        social_links: d.social_links || {},
        about_content: { beliefs: [], ...(d.about_content || {}) },
        site_images: d.site_images || {},
      });
    } catch (e) {
      toast({ title: 'Failed to load settings', description: e?.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (key, value) => {
    try {
      await settingsApi.put(key, value);
      toast({ title: 'Saved', description: key });
      await load();
      onAfterChange?.();
    } catch (e) {
      toast({ title: 'Save failed', description: e?.response?.data?.detail || e?.message });
    }
  };

  if (loading) return <div className="text-white/60">Loading…</div>;

  return (
    <div className="space-y-10" data-testid="settings-panel">
      {/* Church info */}
      <section className="border border-white/15 p-5">
        <h3 className="serif-display text-xl font-semibold mb-4">Church Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['address', 'phone', 'email', 'sunday_service', 'bible_study', 'prayer'].map((k) => (
            <Field key={k} label={k.replace(/_/g, ' ').toUpperCase()}>
              <input
                className={inputCls}
                value={data.church_info?.[k] ?? ''}
                data-testid={`church-info-${k}`}
                onChange={(e) => setData({ ...data, church_info: { ...data.church_info, [k]: e.target.value } })}
              />
            </Field>
          ))}
        </div>
        <div className="mt-4"><Btn onClick={() => save('church_info', data.church_info)} data-testid="save-church-info">Save Church Info</Btn></div>
      </section>

      {/* Social links */}
      <section className="border border-white/15 p-5">
        <h3 className="serif-display text-xl font-semibold mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['facebook', 'instagram', 'youtube', 'map', 'podcast'].map((k) => (
            <Field key={k} label={k.toUpperCase()}>
              <input
                className={inputCls}
                value={data.social_links?.[k] ?? ''}
                data-testid={`social-${k}`}
                onChange={(e) => setData({ ...data, social_links: { ...data.social_links, [k]: e.target.value } })}
              />
            </Field>
          ))}
        </div>
        <div className="mt-4"><Btn onClick={() => save('social_links', data.social_links)} data-testid="save-social-links">Save Social Links</Btn></div>
      </section>

      {/* About content */}
      <section className="border border-white/15 p-5">
        <h3 className="serif-display text-xl font-semibold mb-4">About Page Content</h3>
        <div className="grid grid-cols-1 gap-4">
          <Field label="HERO HEADLINE">
            <input className={inputCls} value={data.about_content.hero || ''}
              onChange={(e) => setData({ ...data, about_content: { ...data.about_content, hero: e.target.value } })}/>
          </Field>
          <Field label="INTRO">
            <textarea className={inputCls} rows={4} value={data.about_content.intro || ''}
              onChange={(e) => setData({ ...data, about_content: { ...data.about_content, intro: e.target.value } })}/>
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="MISSION">
              <textarea className={inputCls} rows={3} value={data.about_content.mission || ''}
                onChange={(e) => setData({ ...data, about_content: { ...data.about_content, mission: e.target.value } })}/>
            </Field>
            <Field label="VISION">
              <textarea className={inputCls} rows={3} value={data.about_content.vision || ''}
                onChange={(e) => setData({ ...data, about_content: { ...data.about_content, vision: e.target.value } })}/>
            </Field>
          </div>
          <Field label="BELIEFS (one per line)">
            <textarea
              className={inputCls}
              rows={6}
              value={(data.about_content.beliefs || []).join('\n')}
              onChange={(e) =>
                setData({
                  ...data,
                  about_content: {
                    ...data.about_content,
                    beliefs: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                  },
                })
              }
            />
          </Field>
        </div>
        <div className="mt-4"><Btn onClick={() => save('about_content', data.about_content)} data-testid="save-about-content">Save About Content</Btn></div>
      </section>

      {/* Site images */}
      <section className="border border-white/15 p-5">
        <h3 className="serif-display text-xl font-semibold mb-4">Site Images (Hero / Worship / Banner)</h3>
        <p className="text-white/60 text-xs mb-4">
          Paste a Google Drive share URL (or any image URL). The site auto-converts Drive URLs to displayable thumbnails.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['hero', 'worship', 'banner'].map((k) => (
            <div key={k} className="space-y-2">
              <Field label={`${k.toUpperCase()} IMAGE URL`}>
                <input
                  className={inputCls}
                  value={data.site_images?.[k] ?? ''}
                  data-testid={`site-image-${k}`}
                  onChange={(e) => setData({ ...data, site_images: { ...data.site_images, [k]: e.target.value } })}
                />
              </Field>
              <ImagePreview url={data.site_images?.[k]} className="w-full aspect-[16/9]" />
            </div>
          ))}
        </div>
        <div className="mt-4"><Btn onClick={() => save('site_images', data.site_images)} data-testid="save-site-images">Save Site Images</Btn></div>
      </section>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main admin dashboard
// ---------------------------------------------------------------------------
const Dashboard = ({ onSignOut }) => {
  const { reload } = useSiteData();

  // Refresh public site context whenever anything changes
  const refreshPublic = () => reload();

  return (
    <div className="min-h-screen bg-blue-950 text-white" data-testid="admin-dashboard">
      <header className="border-b-2 border-white/20 px-6 lg:px-10 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs tracking-[0.3em] text-white/60">TBLC</div>
          <div className="serif-display text-xl font-semibold">Admin Dashboard</div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs tracking-[0.2em] text-white/75 hover:text-white" data-testid="admin-view-site">VIEW SITE ↗</Link>
          <Btn variant="outline" onClick={onSignOut} data-testid="admin-sign-out">Sign out</Btn>
        </div>
      </header>

      <main className="max-w-[1300px] mx-auto px-6 lg:px-10 py-8">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="bg-blue-900/50 border border-white/10 mb-6 flex-wrap h-auto">
            {[
              ['events', 'Events'],
              ['ministries', 'Ministries'],
              ['sermons', 'Sermons'],
              ['pastors', 'Pastors'],
              ['newsletters', 'Newsletters'],
              ['settings', 'Site Settings'],
            ].map(([v, l]) => (
              <TabsTrigger key={v} value={v} data-testid={`admin-tab-${v}`} className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-950">
                {l}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="events">
            <ResourceTable
              tabKey="events"
              title="Events"
              api={eventsApi}
              imageField="image_direct_url"
              emptyDefaults={{ title: '', date: '', time: '', description: '', image_url: '', order: 0, published: true }}
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'date', label: 'Date' },
                { key: 'time', label: 'Time' },
                { key: 'order', label: '#' },
                { key: 'published', label: 'Pub', render: (r) => (r.published ? '✓' : '—') },
              ]}
              onAfterChange={refreshPublic}
              renderForm={(v, setV) => (
                <>
                  <Field label="TITLE"><input className={inputCls} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="DATE"><input className={inputCls} value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} /></Field>
                    <Field label="TIME"><input className={inputCls} value={v.time} onChange={(e) => setV({ ...v, time: e.target.value })} /></Field>
                  </div>
                  <Field label="DESCRIPTION"><textarea className={inputCls} rows={3} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} /></Field>
                  <Field label="IMAGE URL (Google Drive or external)">
                    <input className={inputCls} value={v.image_url} onChange={(e) => setV({ ...v, image_url: e.target.value })} />
                  </Field>
                  <ImagePreview url={v.image_url} className="w-full aspect-video" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="ORDER"><input className={inputCls} type="number" value={v.order} onChange={(e) => setV({ ...v, order: Number(e.target.value) })} /></Field>
                    <Field label="PUBLISHED">
                      <select className={inputCls} value={v.published ? '1' : '0'} onChange={(e) => setV({ ...v, published: e.target.value === '1' })}>
                        <option value="1">Yes</option><option value="0">No</option>
                      </select>
                    </Field>
                  </div>
                </>
              )}
            />
          </TabsContent>

          <TabsContent value="ministries">
            <ResourceTable
              tabKey="ministries"
              title="Ministries"
              api={ministriesApi}
              imageField="image_direct_url"
              emptyDefaults={{ slug: '', title: '', description: '', image_url: '', order: 0, published: true }}
              columns={[
                { key: 'slug', label: 'Slug' },
                { key: 'title', label: 'Title' },
                { key: 'order', label: '#' },
                { key: 'published', label: 'Pub', render: (r) => (r.published ? '✓' : '—') },
              ]}
              onAfterChange={refreshPublic}
              renderForm={(v, setV) => (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="SLUG"><input className={inputCls} value={v.slug} onChange={(e) => setV({ ...v, slug: e.target.value })} /></Field>
                    <Field label="TITLE"><input className={inputCls} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></Field>
                  </div>
                  <Field label="DESCRIPTION"><textarea className={inputCls} rows={4} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} /></Field>
                  <Field label="IMAGE URL (Google Drive or external)">
                    <input className={inputCls} value={v.image_url} onChange={(e) => setV({ ...v, image_url: e.target.value })} />
                  </Field>
                  <ImagePreview url={v.image_url} className="w-full aspect-video" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="ORDER"><input className={inputCls} type="number" value={v.order} onChange={(e) => setV({ ...v, order: Number(e.target.value) })} /></Field>
                    <Field label="PUBLISHED">
                      <select className={inputCls} value={v.published ? '1' : '0'} onChange={(e) => setV({ ...v, published: e.target.value === '1' })}>
                        <option value="1">Yes</option><option value="0">No</option>
                      </select>
                    </Field>
                  </div>
                </>
              )}
            />
          </TabsContent>

          <TabsContent value="sermons">
            <ResourceTable
              tabKey="sermons"
              title="Sermons"
              api={sermonsApi}
              emptyDefaults={{ title: '', speaker: '', duration: '', youtube_id: '', order: 0, published: true }}
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'speaker', label: 'Speaker' },
                { key: 'duration', label: 'Duration' },
                { key: 'youtube_id', label: 'YouTube ID' },
                { key: 'order', label: '#' },
                { key: 'published', label: 'Pub', render: (r) => (r.published ? '✓' : '—') },
              ]}
              onAfterChange={refreshPublic}
              renderForm={(v, setV) => (
                <>
                  <Field label="TITLE"><input className={inputCls} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="SPEAKER"><input className={inputCls} value={v.speaker} onChange={(e) => setV({ ...v, speaker: e.target.value })} /></Field>
                    <Field label="DURATION (e.g. 41:10)"><input className={inputCls} value={v.duration} onChange={(e) => setV({ ...v, duration: e.target.value })} /></Field>
                  </div>
                  <Field label="YOUTUBE VIDEO ID (e.g. n2Os6jgp8oI)">
                    <input className={inputCls} value={v.youtube_id} onChange={(e) => setV({ ...v, youtube_id: e.target.value })} />
                  </Field>
                  {v.youtube_id && (
                    <img src={`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`} alt="preview" className="w-full aspect-video object-cover border border-white/10" />
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="ORDER"><input className={inputCls} type="number" value={v.order} onChange={(e) => setV({ ...v, order: Number(e.target.value) })} /></Field>
                    <Field label="PUBLISHED">
                      <select className={inputCls} value={v.published ? '1' : '0'} onChange={(e) => setV({ ...v, published: e.target.value === '1' })}>
                        <option value="1">Yes</option><option value="0">No</option>
                      </select>
                    </Field>
                  </div>
                </>
              )}
            />
          </TabsContent>

          <TabsContent value="pastors">
            <ResourceTable
              tabKey="pastors"
              title="Pastors"
              api={pastorsApi}
              imageField="image_direct_url"
              emptyDefaults={{ name: '', role: '', image_url: '', order: 0, published: true }}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'role', label: 'Role' },
                { key: 'order', label: '#' },
                { key: 'published', label: 'Pub', render: (r) => (r.published ? '✓' : '—') },
              ]}
              onAfterChange={refreshPublic}
              renderForm={(v, setV) => (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="NAME"><input className={inputCls} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /></Field>
                    <Field label="ROLE"><input className={inputCls} value={v.role} onChange={(e) => setV({ ...v, role: e.target.value })} /></Field>
                  </div>
                  <Field label="IMAGE URL (Google Drive or external)">
                    <input className={inputCls} value={v.image_url} onChange={(e) => setV({ ...v, image_url: e.target.value })} />
                  </Field>
                  <ImagePreview url={v.image_url} className="w-full aspect-square max-w-[240px]" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="ORDER"><input className={inputCls} type="number" value={v.order} onChange={(e) => setV({ ...v, order: Number(e.target.value) })} /></Field>
                    <Field label="PUBLISHED">
                      <select className={inputCls} value={v.published ? '1' : '0'} onChange={(e) => setV({ ...v, published: e.target.value === '1' })}>
                        <option value="1">Yes</option><option value="0">No</option>
                      </select>
                    </Field>
                  </div>
                </>
              )}
            />
          </TabsContent>

          <TabsContent value="newsletters">
            <ResourceTable
              tabKey="newsletters"
              title="Newsletters"
              api={newslettersApi}
              emptyDefaults={{ month: '', file_url: '', order: 0, published: true }}
              columns={[
                { key: 'month', label: 'Month' },
                { key: 'file_url', label: 'File URL', render: (r) => <span className="text-white/60 text-xs break-all">{r.file_url || '—'}</span> },
                { key: 'order', label: '#' },
                { key: 'published', label: 'Pub', render: (r) => (r.published ? '✓' : '—') },
              ]}
              onAfterChange={refreshPublic}
              renderForm={(v, setV) => (
                <>
                  <Field label="MONTH (e.g. April 2026)"><input className={inputCls} value={v.month} onChange={(e) => setV({ ...v, month: e.target.value })} /></Field>
                  <Field label="FILE URL (Google Drive PDF or external)">
                    <input className={inputCls} value={v.file_url} onChange={(e) => setV({ ...v, file_url: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="ORDER"><input className={inputCls} type="number" value={v.order} onChange={(e) => setV({ ...v, order: Number(e.target.value) })} /></Field>
                    <Field label="PUBLISHED">
                      <select className={inputCls} value={v.published ? '1' : '0'} onChange={(e) => setV({ ...v, published: e.target.value === '1' })}>
                        <option value="1">Yes</option><option value="0">No</option>
                      </select>
                    </Field>
                  </div>
                </>
              )}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel onAfterChange={refreshPublic} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page entry – session check then renders Login or Dashboard
// ---------------------------------------------------------------------------
const Admin = () => {
  const [state, setState] = useState('loading'); // loading | auth | in

  useEffect(() => {
    (async () => {
      if (!getToken()) {
        setState('auth');
        return;
      }
      try {
        await adminMe();
        setState('in');
      } catch (_err) {
        setToken('');
        setState('auth');
      }
    })();
  }, []);

  if (state === 'loading') {
    return <div className="min-h-screen bg-blue-950 text-white flex items-center justify-center">Loading…</div>;
  }
  if (state === 'auth') {
    return <Login onSuccess={() => setState('in')} />;
  }
  return (
    <Dashboard
      onSignOut={() => {
        setToken('');
        setState('auth');
      }}
    />
  );
};

export default Admin;
