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

const resolveDriveImageUrl = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const match = raw.match(/(?:\/d\/|id=)([a-zA-Z0-9-_]+)/);
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w2000`;
  }
  return raw;
};

const parseGallerySources = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return { folderId: '', images: [] };

  const pieces = raw
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (pieces.length <= 1) {
    const folderId = normalizeDriveFolderId(raw);
    if (folderId && /^[a-zA-Z0-9-_]{10,}$/.test(folderId)) {
      return { folderId, images: [] };
    }
    return { folderId: '', images: [resolveDriveImageUrl(raw)] };
  }

  const images = pieces
    .filter((piece) => /https?:\/\//i.test(piece) || /drive\.google\.com/i.test(piece))
    .map((piece) => resolveDriveImageUrl(piece));

  return { folderId: '', images };
};

const buildFolderEmbedUrl = (folderId) =>
  `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;

const Gallery = () => {
  const { events } = useSiteData();
  const { eventId } = useParams();

  const galleryEvents = events.filter((event) => normalizeDriveFolderId(event.gallery_folder_id));
  const activeEvent = galleryEvents.find((event) => event.id === eventId) || galleryEvents[0] || null;
  const galleryData = activeEvent ? parseGallerySources(activeEvent.gallery_folder_id) : { folderId: '', images: [] };

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
                {galleryData.images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {galleryData.images.map((image, index) => (
                      <a
                        key={`${image}-${index}`}
                        href={image}
                        target="_blank"
                        rel="noreferrer"
                        className="group overflow-hidden border border-white/10 bg-black/20"
                      >
                        <img src={image} alt={`${activeEvent.title} gallery ${index + 1}`} className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500" />
                      </a>
                    ))}
                  </div>
                ) : galleryData.folderId ? (
                  <>
                    <div className="overflow-hidden border border-white/10 bg-black/20">
                      <iframe
                        src={buildFolderEmbedUrl(galleryData.folderId)}
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
                    No gallery images are linked for this event yet.
                  </div>
                )}
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
