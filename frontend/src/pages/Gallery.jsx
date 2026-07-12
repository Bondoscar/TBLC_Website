import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
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

// Always resolves to a flat list of directly-renderable image URLs.
// Accepts one or more image URLs / Drive file links, separated by
// newlines, commas, or semicolons. A bare Drive *folder* link/ID can't be
// expanded into individual images client-side, so it's skipped rather than
// embedded — admins should list individual image links instead.
const parseGalleryImages = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return [];

  const pieces = raw
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);

  return pieces
    .filter((piece) => {
      // Skip bare Drive folder links — those can't be rendered as an image.
      if (/\/folders\//i.test(piece)) return false;
      const looksLikeUrl = /https?:\/\//i.test(piece) || /drive\.google\.com/i.test(piece);
      const looksLikeBareId = /^[a-zA-Z0-9-_]{15,}$/.test(piece);
      return looksLikeUrl || looksLikeBareId;
    })
    .map((piece) => resolveDriveImageUrl(piece));
};

const Gallery = () => {
  const { events } = useSiteData();
  const { eventId } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryEvents = events.filter((event) => normalizeDriveFolderId(event.gallery_folder_id));
  const activeEvent = galleryEvents.find((event) => event.id === eventId) || galleryEvents[0] || null;
  const images = activeEvent ? parseGalleryImages(activeEvent.gallery_folder_id) : [];

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!selectedImage) return;
      if (event.key === 'Escape') setSelectedImage(null);
      if (event.key === 'ArrowRight') {
        const nextIndex = (selectedImage.index + 1) % images.length;
        setSelectedImage({ src: images[nextIndex], index: nextIndex });
      }
      if (event.key === 'ArrowLeft') {
        const prevIndex = (selectedImage.index - 1 + images.length) % images.length;
        setSelectedImage({ src: images[prevIndex], index: prevIndex });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [images, selectedImage]);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [selectedImage]);

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
                {images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={`${image}-${index}`} className="overflow-hidden border border-white/10 bg-black/20">
                        <button
                          type="button"
                          onClick={() => setSelectedImage({ src: image, index })}
                          className="group block w-full text-left"
                        >
                          <img src={image} alt={`${activeEvent.title} gallery ${index + 1}`} className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500" />
                        </button>
                        <div className="p-3">
                          <button
                            type="button"
                            onClick={() => setSelectedImage({ src: image, index })}
                            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
                          >
                            View picture <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-white/20 p-10 text-center text-white/60">
                    No gallery images are linked for this event yet. Add individual image links (one per line, or comma/semicolon separated) in the event's gallery field to have them render here.
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

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/95 px-4 py-6" onClick={() => setSelectedImage(null)}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-0 -top-12 flex items-center gap-2 text-sm tracking-[0.2em] text-white/80 hover:text-white"
            >
              CLOSE <X size={18} />
            </button>
            <div className="relative overflow-hidden border border-white/10 bg-black/30">
              <img src={selectedImage.src} alt="Selected gallery image" className="w-full max-h-[75vh] object-contain" />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const prevIndex = (selectedImage.index - 1 + images.length) % images.length;
                      setSelectedImage({ src: images[prevIndex], index: prevIndex });
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-blue-950/70 p-3 text-white hover:bg-blue-950"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextIndex = (selectedImage.index + 1) % images.length;
                      setSelectedImage({ src: images[nextIndex], index: nextIndex });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-blue-950/70 p-3 text-white hover:bg-blue-950"
                    aria-label="Next image"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
