"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out";

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

function youtubeEmbedToThumbnail(embedUrl: string): string | null {
  const m = embedUrl.match(/youtube\.com\/embed\/([^?&]+)/);
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : null;
}

interface HeroVideoDialogProps {
  animationStyle?: AnimationStyle;
  /** YouTube embed URL — used for iframe modal if mp4Src is not set; also drives thumbnail fallback */
  videoSrc?: string;
  /** Optional poster; falls back to YouTube thumbnail from videoSrc, then gradient */
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  className?: string;
  /** Direct MP4 — preferred for reliability (no embed blocks). Opens in native video modal. */
  mp4Src?: string;
}

/** Keep player fully in view with a bit of edge padding */
const VIEW_PAD = "1.25rem";

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
  mp4Src,
}: HeroVideoDialogProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const selectedAnimation = animationVariants[animationStyle];

  const ytThumb = videoSrc ? youtubeEmbedToThumbnail(videoSrc) : null;
  const primaryThumb = thumbnailSrc || ytThumb;

  const handleThumbError = useCallback(() => {
    setThumbnailFailed(true);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isVideoOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsVideoOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isVideoOpen]);

  const modal = (
    <AnimatePresence>
      {isVideoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsVideoOpen(false)}
          className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
          style={{ zIndex: 100000 }}
          role="dialog"
          aria-modal="true"
          aria-label="Video player"
        >
          <motion.div
            {...selectedAnimation}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-5xl flex flex-col"
            style={{
              maxHeight: `calc(100dvh - 2 * ${VIEW_PAD})`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-video max-h-[calc(100dvh-2.5rem)] rounded-xl sm:rounded-2xl overflow-hidden bg-black ring-1 ring-white/10">
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-2.5 right-2.5 z-20 text-white transition-colors rounded-full p-2 bg-black/55 hover:bg-black/75 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60"
                aria-label="Close video"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              {mp4Src ? (
                <video
                  src={mp4Src}
                  className="w-full h-full object-contain bg-black"
                  controls
                  autoPlay
                  playsInline
                >
                  <track kind="captions" />
                </video>
              ) : videoSrc ? (
                <iframe
                  title={thumbnailAlt}
                  src={`${videoSrc}${videoSrc.includes("?") ? "&" : "?"}autoplay=1`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              ) : (
                <p className="text-white p-8 text-center">No video configured</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative", className)}>
      <div
        className="relative cursor-pointer group aspect-video"
        onClick={() => setIsVideoOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsVideoOpen(true);
          }
        }}
        aria-label="Play video"
      >
        {!thumbnailFailed && primaryThumb ? (
          <Image
            src={primaryThumb}
            alt={thumbnailAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300"
            priority
            unoptimized={primaryThumb.includes("ytimg.com")}
            onError={handleThumbError}
          />
        ) : (
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-800 via-blue-900 to-cyan-900 border border-gray-700/50 flex items-center justify-center"
            aria-hidden
          >
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_30%_20%,rgba(56,189,248,0.35),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(59,130,246,0.25),transparent_45%)]" />
            <p className="relative z-0 text-white/90 text-sm font-medium tracking-wide px-6 text-center">
              Watch our story
            </p>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:scale-110 transition-transform duration-300 ring-4 ring-white/20">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
          </div>
        </div>
      </div>

      {mounted ? createPortal(modal, document.body) : null}
    </div>
  );
}

export default HeroVideoDialog;
