import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ImageIcon } from 'lucide-react';
import { useSiteData, imgFrom } from '../context/SiteDataContext';

const normalizeDriveFolderId = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const match = raw.match(/(?:\/folders\/|id=)([a-zA-Z0-9-_]+)/);
  return match ? match[1] : raw;
};

const buildFolderEmbedUrl = (folderId) =>
  `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;

const Gallery = () => {
  const { events } = useSiteData();
  const { eventId } = useParams();

  const galleryEvents = events.filter((event) => normalizeDriveFolderId(event.gallery_folder_id));
  const activeEvent = galleryEvents.find((event) => event.id === eventId) || galleryEvents[0] || null;

  return (
    <div className="bg-blue-950 text-white" data-testid="gallery-page">
      <section className="pt-16 pb-10 px-6 lg:px-10 text-center">
        <div className="text-xs tracking-[0.3em] text-white/60 mb-3">GALLERY</div>
        <h1 className="hero-title text-4xl md:text-6xl">Event Galleries</h1>
        <p className="mt-5 text-white/70 max-w-[760px] mx-auto">
          Browse photos from our church events.
        </p>
      </section>

      <section className="py-12 px-6 lg:px-10">
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8">
          <aside className="border-2 border-white/15 p-5 h-fit">
            <h2 className="serif-display text-xl font-semibold mb-4">Events with galleries</h2>
            <div className="space-y-3">
              {galleryEvents.length === 0 ? (
                <p className="text-sm text-white/60">No event galleries have been linked yet.</p>
              ) : (
                galleryEvents.map((event) => {
                  const isActive = activeEvent?.id === event.id;
                  return (
                    <Link
                      key={event.id}
                      to={`/gallery/${event.id}`}
                      className={`block border p-3 transition-colors ${isActive ? 'border-white bg-white/10' : 'border-white/15 hover:bg-white/10'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 shrink-0 overflow-hidden bg-white/10">
                          {event.image_direct_url || event.image_url ? (
                            <img src={imgFrom(event)} alt={event.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/60">
                              <ImageIcon size={18} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{event.title}</div>
                          <div className="text-xs text-white/60">{event.date || 'Gallery'}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
            <div className="mt-5">
              <Link to="/events" className="text-sm text-white/70 hover:text-white inline-flex items-center gap-2">
                Back to events <ArrowRight size={14} />
              </Link>
            </div>
          </aside>

          <div className="border-2 border-white/15 p-4 md:p-6">
            {activeEvent ? (
              <>
                <div className="mb-5">
                  <h2 className="serif-display text-3xl font-semibold">{activeEvent.title}</h2>
                  {activeEvent.description && <p className="mt-3 text-white/70">{activeEvent.description}</p>}
                </div>
                <div className="overflow-hidden border border-white/10 bg-black/20">
                  <iframe
                    src={buildFolderEmbedUrl(normalizeDriveFolderId(activeEvent.gallery_folder_id))}
                    title={`${activeEvent.title} gallery`}
                    className="w-full min-h-[560px]"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-xs text-white/50">
                  Images are loaded directly from the linked Google Drive folder. Share the folder publicly so guests can view it.
                </p>
              </>
            ) : (
              <div className="border border-dashed border-white/20 p-10 text-center text-white/60">
                Select an event from the list to view its gallery.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
