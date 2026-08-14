import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useSiteData, imgFrom } from '../context/SiteDataContext';

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

  // Modal Lightbox state (null = closed, number = index of active image)
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [images, setImages] = useState([]);
  // Index used for the large in-page preview (hover or explicit selection)
  const [previewIndex, setPreviewIndex] = useState(0);
  const [iframeFolderId, setIframeFolderId] = useState(null);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const galleryEvents = events.filter((event) => String(event.gallery_folder_id || '').trim());
  const activeEvent = galleryEvents.find((event) => event.id === eventId) || galleryEvents[0] || null;

  const gallerySource = useMemo(
    () => (activeEvent ? getGallerySource(activeEvent.gallery_folder_id) : { type: 'none' }),
    [activeEvent]
  );

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

  // Reset in-page preview when the image set changes
  useEffect(() => {
    setPreviewIndex(0);
  }, [images]);

  // Navigation callbacks
  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));
  }, [images.length]);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation listener
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') handleClose();
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, handleNext, handlePrev, handleClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [lightboxIndex]);

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

          {/* Main Gallery Area */}
          <div className="border-2 border-white/15 p-4 md:p-6">
            {activeEvent ? (
              <>
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="serif-display text-3xl font-semibold">{activeEvent.title}</h2>
                    {activeEvent.description && <p className="mt-2 text-white/70">{activeEvent.description}</p>}
                  </div>

                  {/* Primary Trigger Button to Open Lightbox directly */}
                  {images.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(0)}
                      className="shrink-0 inline-flex items-center gap-2 bg-white text-blue-950 px-5 py-2.5 font-semibold hover:bg-white/90 transition-colors"
                    >
                      <Maximize2 size={16} /> Open Lightbox ({images.length} Photos)
                    </button>
                  )}
                </div>

                {galleryLoading ? (
                  <div className="border border-dashed border-white/20 p-10 text-center text-white/60">
                    Loading images from source…
                  </div>
                ) : images.length > 0 ? (
                  <>
                    {/* Large in-page preview */}
                    <div className="mb-6">
                      <div className="w-full flex items-center justify-center bg-black/10 overflow-hidden border border-white/10 rounded p-4">
                        <img
                          src={images[previewIndex]}
                          alt={`${activeEvent.title} preview ${previewIndex + 1}`}
                          className="max-h-[60vh] w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="mt-2 text-center text-xs text-white/60">
                        Photo {previewIndex + 1} of {images.length}
                      </div>
                    </div>

                    {/* Thumbnail strip (hover to preview, click to open lightbox) */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                      {images.map((image, index) => (
                        <div key={`${image}-${index}`} className="overflow-hidden border border-white/10 bg-black/20 group">
                          <button
                            type="button"
                            onClick={() => setLightboxIndex(index)}
                            onMouseEnter={() => setPreviewIndex(index)}
                            onFocus={() => setPreviewIndex(index)}
                            className="block w-full text-left relative overflow-hidden"
                            aria-label={`Preview photo ${index + 1}`}
                          >
                            <img
                              src={image}
                              alt={`${activeEvent.title} thumb ${index + 1}`}
                              className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-sm font-semibold text-white">
                              <Maximize2 size={16} /> Open
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
                    No gallery is linked for this event yet.
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

      {/* FULLSCREEN LIGHTBOX POPUP MODAL */}
      {lightboxIndex !== null && images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-4 md:p-8"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          {/* Lightbox Header Bar */}
          <div
            className="flex items-center justify-between w-full max-w-6xl mx-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-semibold text-white/80 tracking-wider">
              {activeEvent?.title} — <span className="text-white">Photo {lightboxIndex + 1} of {images.length}</span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-2 text-sm tracking-[0.2em] bg-white/10 hover:bg-white/20 text-white px-4 py-2 border border-white/20 transition-colors"
            >
              CLOSE <X size={18} />
            </button>
          </div>

          {/* Main Content Area (Image + Big Floating Next/Back Buttons) */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 max-w-6xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 md:left-4 z-20 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-950/80 hover:bg-blue-900 text-white border border-white/30 transition-all hover:scale-110 shadow-lg"
                aria-label="Previous photo"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Displayed Image */}
            <div className="relative max-h-[75vh] w-full flex items-center justify-center overflow-hidden">
              <img
                src={images[lightboxIndex]}
                alt={`Photo ${lightboxIndex + 1} of ${images.length}`}
                className="max-h-[75vh] max-w-full object-contain select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 md:right-4 z-20 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-950/80 hover:bg-blue-900 text-white border border-white/30 transition-all hover:scale-110 shadow-lg"
                aria-label="Next photo"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>

          {/* Lightbox Footer Navigation Controls */}
          <div
            className="w-full max-w-md mx-auto flex items-center justify-center gap-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-xs text-white/60 shrink-0">
                  {lightboxIndex + 1} / {images.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  Next <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;