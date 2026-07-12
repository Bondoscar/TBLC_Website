import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteData, imgFrom } from '../context/SiteDataContext';

// Optional Google Drive API key. If set, folder-based galleries render as a
// real image grid (with the in-page modal + next/prev). If NOT set, folder
// galleries fall back to Google's embedded folder view (an iframe) — no key
// required, but no custom modal/next-prev since it's cross-origin content.
// Create React App convention shown below. If you're on Vite, swap this line
// for: const DRIVE_API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY || '';
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

// Only allow http(s) URLs through, and always upgrade to https — blocks
// unsafe schemes (javascript:, data:, etc.) an admin might accidentally
// paste, and guarantees every image is fetched over a secured connection.
const toSecureUrl = (value = '') => {
  const raw = String(value || '').trim();
  if (!/^https?:\/\//i.test(raw)) return '';
  return raw.replace(/^http:\/\//i, 'https://');
};

const buildFolderEmbedUrl = (folderId) => `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;

// Figures out what an event's gallery field points to:
// - "images": one or more individual image links, ready to render as-is
// - "folder": a single Google Drive folder link/ID
// - "none": nothing usable
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

  // A bare alphanumeric string with no URL around it — admins typically
  // paste this when linking a whole Drive folder, so treat it as a folder ID.
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
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
        // No API key configured — go straight to the keyless iframe embed.
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
            // Folder returned nothing (could be genuinely empty, or a
            // permissions issue) — fall back to the iframe so it's still
            // viewable one way or another.
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

                {galleryLoading ? (
                  <div className="border border-dashed border-white/20 p-10 text-center text-white/60">
                    Loading images from Google Drive…
                  </div>
                ) : images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={`${image}-${index}`} className="overflow-hidden border border-white/10 bg-black/20">
                        <button
                          type="button"
                          onClick={() => setSelectedImage({ src: image, index })}
                          className="group block w-full text-left"
                        >
                          <img
                            src={image}
                            alt={`${activeEvent.title} gallery ${index + 1}`}
                            className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
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
                ) : iframeFolderId ? (
                  <>
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
                    <p className="mt-3 text-xs text-white/50">
                      Images are loaded directly from the linked Google Drive folder. Share the folder as "Anyone with the link" so visitors can view it.
                    </p>
                  </>
                ) : (
                  <div className="border border-dashed border-white/20 p-10 text-center text-white/60">
                    No gallery is linked for this event yet. In Admin, paste a Google Drive folder link (shared as "Anyone with the link"), or a list of individual image links, one per line.
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
              <img
                src={selectedImage.src}
                alt="Selected gallery image"
                className="w-full max-h-[75vh] object-contain"
                referrerPolicy="no-referrer"
              />
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
