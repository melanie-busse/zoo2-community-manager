import React from 'react';

export const CollegeBlockPaper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '850px', margin: '0 auto' }}>
      <svg
        viewBox="0 0 800 1000"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: 'auto',
          filter: 'drop-shadow(2px 4px 10px rgba(0,0,0,0.15))',
          backgroundColor: '#fffdfa',
          borderRadius: '4px',
        }}
      >
        <defs>
          {/* Karomuster (Klassisch bläulich/grau) */}
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
          </pattern>

          {/* Loches-Schatten für Tiefe */}
          <radialGradient id="hole-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#9ca3af" />
          </radialGradient>
        </defs>

        {/* Papier-Hintergrund */}
        <rect width="800" height="1000" fill="#fffdfa" />

        {/* Karo-Gitter über das gesamte Blatt */}
        <rect width="800" height="1000" fill="url(#grid)" />

        {/* Rote Vertikallinie links (Sicherheitsrand) */}
        <line x1="90" y1="0" x2="90" y2="1000" stroke="#f87171" strokeWidth="1.5" />

        {/* Rote Vertikallinie rechts */}
        <line x1="710" y1="0" x2="710" y2="1000" stroke="#f87171" strokeWidth="1.5" />

        {/* Kopfzeile / Obere Begrenzungslinie */}
        <line x1="0" y1="60" x2="800" y2="60" stroke="#94a3b8" strokeWidth="1" />

        {/* Lochung auf der linken Seite */}
        <circle cx="35" cy="150" r="14" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
        <circle cx="35" cy="500" r="14" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
        <circle cx="35" cy="850" r="14" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
      </svg>

      {/* Inhaltsbereich (relativ über dem SVG positioniert) */}
      <div
        style={{
          position: 'absolute',
          top: '70px',
          left: '100px',
          right: '100px',
          bottom: '40px',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};