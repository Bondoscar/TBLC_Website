import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteData, imgFrom } from '../context/SiteDataContext';

// Optional Google Drive API key. If set, folder-based galleries render as a
// real image grid (with the in-page modal + next/prev). If NOT set, folder
// galleries fall back to Google's embedded folder view (an iframe).
const DRIVE_API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY || '';

const resolveDriveImageUrl = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const match = raw.match(/(?:\/d\/|id=)([a-zA-Z0-9-_]+)/);
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w2000`;
  }
  return toSecureUrl(raw);
};

// Block unsafe schemes (javascript:, data:, etc.) and upgrade http to https
const toSecureUrl = (value = '') => {
  const raw = String(value || '').trim();
  if (!/^https?:\/\//i.test(raw)) return '';
  return raw.replace(/^http:\/\//i, 'https://');
};

const buildFolderEmbedUrl = (folderId) => `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;

const getGallerySource = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return { type: 'none' };

  const pieces = raw.split(/\r?\n|,|;/).map((s) => s.trim()).filter(Boolean);

  if (pieces.length > 1) {
    const images = pieces
      .filter((p) => !/\/folders\//i.test(p))
      .map(resolveDriveImageUrl)
      .filter(Boolean);
    return { type: 'images', images };
  }

  const single = pieces[0];

  const folderMatch = single.match(/\/folders\/([a-zA-Z0-9-_]+)/);
  if (folderMatch) return { type: 'folder', folderId: folderMatch[1] };

  if (/https?:\/\//i.test(single)) {
    const resolved = resolveDriveImageUrl(single);
    return resolved ? { type: 'images', images: [resolved] } : { type: 'none' };
  }

  if (/^[a-zA-Z0-9-_]{15,}$/.test(single)) {
    return { type: 'folder', folderId: single };
  }

  return { type: 'none' };
};

const fetchDriveFolderImages = async (folderId) => {
  const query = encodeURIComponent(`'${folderId}' in parents and mimeType contains 'image/' and trashed = false`);
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${DRIVE_API_KEY}&fields=files(id,name)&orderBy=name&pageSize=1000`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Drive API request failed (${res.status})`);
  const data = await res.json();
  return (data.files || []).map((file) => `https://drive.google.com/thumbnail?id=${file.id}&sz=w2000`);
};

const Gallery = () => {
  const { events } = useSiteData();
  const { eventId } = useParams();
  
  // Index-based modal state for cleaner navigation state management
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [images, setImages] = useState([]);
  const [iframeFolderId, setIframeFolderId] = useState(null);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const galleryEvents = events.filter((event) => String(event.gallery_folder_id || '').trim());
  const activeEvent = galleryEvents.find((event) => event.id === eventId) || galleryEvents[0] || null;

  const gallerySource = useMemo(
    () => (activeEvent ? getGallerySource(activeEvent.gallery_folder_id) : { type: 'none' }),
    [activeEvent]
  );

  // Reset selected image pop-up when switching active events
  useEffect(() => {
    setSelectedIndex(null);
  }, [activeEvent?.id]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (gallerySource.type === 'images') {
        setImages(gallerySource.images);
        setIframeFolderId(null);
        setGalleryLoading(false);
        return;
      }

      if (gallerySource.type === 'folder') {
        if (!DRIVE_API_KEY) {
          setImages([]);
          setIframeFolderId(gallerySource.folderId);
          setGalleryLoading(false);
          return;
        }

        setGalleryLoading(true);
        try {
          const fetched = await fetchDriveFolderImages(gallerySource.folderId);
          if (cancelled) return;
          if (fetched.length > 0) {
            setImages(fetched);
            setIframeFolderId(null);
          } else {
            setImages([]);
            setIframeFolderId(gallerySource.folderId);
          }
        } catch (_err) {
          if (!cancelled) {
            setImages([]);
            setIframeFolderId(gallerySource.folderId);
          }
        } finally {
          if (!cancelled) setGalleryLoading(false);
        }
        return;
      }

      setImages([]);
      setIframeFolderId(null);
      setGalleryLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [gallerySource]);

  // Handle pop-up navigation helpers
  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % images.length));
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    setSelectedIndex((prev) => (prev === null ? 0 : (prev - 1 + images.length) % images.length));
  }, [images.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard controls for the pop-up modal
  useEffect(() => {
    const onKeyDown = (event) => {
      if (selectedIndex === null) return;
      if (event.key === 'Escape') handleClose();
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, handleNext, handlePrev, handleClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [selectedIndex]);

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
          {/* Sidebar */}
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
                      className={`block border p-3 transition-colors ${
                        isActive ? 'border-white bg-white/10' : 'border-white/15 hover:bg-white/10'
                      }`}
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

          {/* Main Content Pane */}
          <div className="border-2 border-white/15 p-4 md:p-6">
            {activeEvent ? (
              <>
                <div className="mb-5">
                  <h2 className="serif-display text-3xl font-semibold">{activeEvent.title}</h2>
                  {activeEvent.description && <p className="mt-3 text-white/70">{activeEvent.description}</p>}
                </div>

                {galleryLoading ? (
                  <div className="border border-dashed border-white/20 p-10 text-center text-white/60">
                    Loading images from source…
                  </div>
                ) : images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={`${image}-${index}`} className="overflow-hidden border border-white/10 bg-black/20 group">
                        <button
                          type="button"
                          onClick={() => setSelectedIndex(index)}
                          className="block w-full text-left focus:outline-none"
                        >
                          <div className="overflow-hidden">
                            <img
                              src={image}
                              alt={`${activeEvent.title} photo ${index + 1}`}
                              className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-3 flex items-center justify-between border-t border-white/5 bg-white/5">
                            <span className="text-xs text-white/60">Photo {index + 1} of {images.length}</span>
                            <span className="inline-flex items-center gap-1 text-sm text-white/80 group-hover:text-white transition-colors">
                              Enlarge <ArrowRight size={14} />
                            </span>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : iframeFolderId ? (
                  <div className="overflow-hidden border border-white/10 bg-black/20">
                    <iframe
                      src={buildFolderEmbedUrl(iframeFolderId)}
                      title={`${activeEvent.title} gallery`}
                      className="w-full min-h-[560px]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                  </div>
                ) : (
                  <div className="border border-dashed border-white/20 p-10 text-center text-white/60">
                    No gallery is linked for this event yet. Please check back later or contact the site administrator.
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

      {/* FULLSCREEN POP-UP MODAL LIGHTBOX */}
      {selectedIndex !== null && images[selectedIndex] && (
        <div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-sm p-4 md:p-6"
          onClick={handleClose}
        >
          {/* Top Bar: Title, Counter, Close */}
          <div
            className="flex items-center justify-between text-white border-b border-white/10 pb-4 max-w-7xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-lg font-semibold">{activeEvent?.title || 'Gallery'}</h3>
              <p className="text-xs text-white/60">
                Image {selectedIndex + 1} of {images.length}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/20 bg-white/10 hover:bg-white/20 text-xs tracking-widest transition-colors"
              aria-label="Close modal"
            >
              CLOSE <X size={16} />
            </button>
          </div>

          {/* Main Stage: Prev Button + Image + Next Button */}
          <div
            className="relative flex-1 flex items-center justify-between max-w-7xl w-full mx-auto my-4 gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Back Button (Outside thumbnail/image frame) */}
            {images.length > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="shrink-0 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
            ) : <div className="w-12" />}

            {/* Displayed Image */}
            <div className="flex-1 flex items-center justify-center h-full max-h-[75vh] overflow-hidden">
              <img
                src={images[selectedIndex]}
                alt={`${activeEvent?.title || 'Gallery'} enlarged ${selectedIndex + 1}`}
                className="max-h-[75vh] max-w-full object-contain rounded shadow-2xl select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Next Button (Outside thumbnail/image frame) */}
            {images.length > 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="shrink-0 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
            ) : <div className="w-12" />}
          </div>

          {/* Bottom Bar Hints */}
          <div className="text-center text-xs text-white/40 pt-2">
            Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">←</kbd> <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">→</kbd> keys to navigate, <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">ESC</kbd> to close.
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;