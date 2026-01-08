/**
 * FlagImage.tsx - Cross-browser flag rendering
 * 
 * WHY: Emoji flags don't work on Windows Chrome (shows 2-letter codes)
 * HOW: Uses local PNG flags from /flags/ folder (served by Next.js static files)
 * 
 * EXPORT FIX: Local images bypass CORS issues that prevented export from working
 * 
 * Usage: <FlagImage code="ng" name="Nigeria" size={40} />
 */

/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface FlagImageProps {
    code: string;       // ISO 3166-1 alpha-2 (e.g., 'ng', 'sn', 'ma')
    name: string;       // For alt text
    className?: string;
    size?: number;      // Width in pixels (default 40)
}

export const FlagImage = ({ code, name, className = "", size = 40 }: FlagImageProps) => {
    // Use local flags (bypasses CORS for export)
    // Fallback to flagcdn if code is empty or unknown
    const src = code
        ? `/flags/${code.toLowerCase()}.png`
        : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 1x1 transparent

    return (
        <img
            src={src}
            width={size}
            height={size * 0.67} // Standard flag ratio
            alt={`${name} flag`}
            className={`object-contain rounded-sm shadow-sm ${className}`}
            loading="eager" // Always load immediately (fixes off-screen loading issue)
            crossOrigin="anonymous" // Enable canvas export
        />
    );
};
