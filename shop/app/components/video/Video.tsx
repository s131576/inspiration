// components/video/Video.js
'use client';

export function Video() {
  return (
    <video
      className="absolute inset-0 object-cover w-full h-full"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      <source src="/video-landing.mp4" type="video/mp4" />
      <track
        src="video-landing.mp4"
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      Your browser does not support the video tag.
    </video>
  );
}
