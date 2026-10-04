import React from 'react';

interface OmGioVisualAvatarProps {
  viewMode?: 'front' | 'threeQuarter' | 'leftProfile' | 'rightProfile' | 'fullBody' | 'smile' | 'neutral' | 'serious' | 'glasses' | 'mustache' | 'watch';
  className?: string;
  showHud?: boolean;
  identityLockStrength?: string;
}

export const OmGioVisualAvatar: React.FC<OmGioVisualAvatarProps> = ({
  viewMode = 'front',
  className = 'w-full h-full',
  showHud = true,
  identityLockStrength = '95%',
}) => {
  // Angle rotations and camera visual variations
  const isProfile = viewMode === 'leftProfile' || viewMode === 'rightProfile';
  const isThreeQuarter = viewMode === 'threeQuarter';
  const isSmile = viewMode === 'smile';
  const isSerious = viewMode === 'serious';
  const isCloseupGlasses = viewMode === 'glasses';
  const isCloseupMustache = viewMode === 'mustache';
  const isCloseupWatch = viewMode === 'watch';
  const isFullBody = viewMode === 'fullBody';

  const flipX = viewMode === 'rightProfile' ? -1 : 1;

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#03060c] border border-cyan-500/20 group ${className}`}>
      {/* Background Studio Light Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(6,182,212,0.18),transparent_70%)]" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Cybernetic Studio Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:16px_16px]" />

      {/* Biometric Scan HUD Overlay */}
      {showHud && (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              ID_LOCK: {identityLockStrength}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-slate-400 uppercase">
              {viewMode}
            </span>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400/70 border-t border-cyan-500/20 pt-1">
            <span>BIO_AGE: 28</span>
            <span>SPEC: INDONESIAN_MALE</span>
            <span>MATCH: 99.8%</span>
          </div>
        </div>
      )}

      {/* SVG Character Representation */}
      <svg
        viewBox="0 0 400 440"
        className="w-full h-full object-contain relative z-0 transition-transform duration-500"
        style={{
          transform: `${flipX === -1 ? 'scaleX(-1)' : ''} ${isCloseupGlasses ? 'scale(1.8) translateY(20px)' : isCloseupMustache ? 'scale(2.2) translateY(-25px)' : isFullBody ? 'scale(0.85) translateY(10px)' : ''}`,
        }}
      >
        <defs>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d59a72" />
            <stop offset="50%" stopColor="#c5855c" />
            <stop offset="100%" stopColor="#a3653f" />
          </linearGradient>

          <linearGradient id="skinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a3653f" stopOpacity="0" />
            <stop offset="100%" stopColor="#6e4024" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e242b" />
            <stop offset="60%" stopColor="#11161d" />
            <stop offset="100%" stopColor="#070a0e" />
          </linearGradient>

          <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f293d" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="35%" stopColor="rgba(6,182,212,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>

          <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.3" />
          </filter>
        </defs>

        {isCloseupWatch ? (
          /* Specialized Closeup for Chronograph Watch */
          <g transform="translate(100, 100)">
            <rect x="50" y="-30" width="100" height="260" rx="8" fill="#1e293b" />
            <circle cx="100" cy="100" r="85" fill="#0f172a" stroke="#94a3b8" strokeWidth="8" />
            <circle cx="100" cy="100" r="72" fill="#020617" stroke="#06b6d4" strokeWidth="2" />
            {/* Watch Dials */}
            <circle cx="100" cy="75" r="18" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <circle cx="75" cy="115" r="18" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            <circle cx="125" cy="115" r="18" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            {/* Hands */}
            <line x1="100" y1="100" x2="100" y2="45" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
            <line x1="100" y1="100" x2="135" y2="100" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="100" cy="100" r="4" fill="#38bdf8" />
            <text x="100" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">CHRONOGRAPH 28J</text>
          </g>
        ) : (
          /* Human Portrait: Om Gio */
          <g>
            {/* Studio Lighting Rim Glow around Shoulders */}
            <path
              d="M 60 380 Q 200 350 340 380 L 350 440 L 50 440 Z"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
              opacity="0.3"
            />

            {/* Torso & Wardrobe */}
            <path
              d="M 70 360 C 90 320 130 305 160 300 L 240 300 C 270 305 310 320 330 360 L 360 440 L 40 440 Z"
              fill="url(#jacketGrad)"
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Inner Dark T-shirt collar */}
            <path
              d="M 160 300 C 180 340 220 340 240 300 Z"
              fill="#0b0f19"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Lavalier Mic on Collar */}
            <rect x="225" y="325" width="4" height="12" rx="2" fill="#020617" stroke="#475569" strokeWidth="0.8" />

            {/* Neck (Slim / Fit) */}
            <path
              d="M 172 250 L 172 315 C 185 325 215 325 228 315 L 228 250 Z"
              fill="url(#skinGrad)"
            />
            {/* Neck shadow under jaw */}
            <path
              d="M 172 250 C 185 275 215 275 228 250 L 228 270 C 215 295 185 295 172 270 Z"
              fill="url(#skinShadow)"
            />

            {/* Face Shape: Oval */}
            <path
              d={
                isProfile
                  ? "M 200 110 C 240 110 260 140 265 180 C 270 210 255 240 230 255 C 210 265 190 265 175 255 C 150 240 145 190 155 140 C 165 115 180 110 200 110 Z"
                  : isThreeQuarter
                  ? "M 195 105 C 250 105 268 140 266 185 C 263 225 245 255 215 262 C 190 268 165 255 145 240 C 130 200 135 140 155 115 C 170 105 185 105 195 105 Z"
                  : "M 200 105 C 255 105 265 145 262 190 C 258 230 238 260 200 262 C 162 260 142 230 138 190 C 135 145 145 105 200 105 Z"
              }
              fill="url(#skinGrad)"
            />

            {/* Ears */}
            <path d="M 134 175 C 122 180 120 205 135 215 Z" fill="url(#skinGrad)" stroke="#a3653f" strokeWidth="1" />
            <path d="M 266 175 C 278 180 280 205 265 215 Z" fill="url(#skinGrad)" stroke="#a3653f" strokeWidth="1" />

            {/* Hair: Short black hair, neatly styled with modern side taper */}
            <path
              d="M 132 170 C 128 135 142 95 180 82 C 215 72 250 82 268 105 C 278 120 274 150 270 170 C 265 150 258 125 240 118 C 215 110 170 115 140 140 C 135 152 133 162 132 170 Z"
              fill="url(#hairGrad)"
            />
            {/* Hair styling tufts */}
            <path
              d="M 170 85 C 190 75 225 80 245 92 C 235 90 205 92 185 100 Z"
              fill="#2d3748"
              opacity="0.6"
            />

            {/* Eyebrows: Clean, masculine, natural */}
            <path
              d="M 152 162 C 165 158 180 160 188 165"
              stroke="#111827"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 212 165 C 220 160 235 158 248 162"
              stroke="#111827"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Eyes: Natural Indonesian brown eyes with subtle glint */}
            <ellipse cx="170" cy="178" rx="10" ry="6" fill="#f8fafc" />
            <circle cx="170" cy="178" r="4.5" fill="#2d1c12" />
            <circle cx="171.5" cy="176.5" r="1.5" fill="#ffffff" />

            <ellipse cx="230" cy="178" rx="10" ry="6" fill="#f8fafc" />
            <circle cx="230" cy="178" r="4.5" fill="#2d1c12" />
            <circle cx="231.5" cy="176.5" r="1.5" fill="#ffffff" />

            {/* Nose: Well defined, natural Indonesian profile */}
            <path
              d="M 200 168 L 198 202 C 193 205 197 210 200 210 C 203 210 207 205 202 202 Z"
              fill="#995831"
              opacity="0.8"
            />

            {/* Eyewear: Modern Rectangular Titanium Eyeglasses */}
            <g filter="url(#subtleGlow)">
              {/* Left Lens Frame */}
              <rect
                x="150"
                y="164"
                width="38"
                height="26"
                rx="4"
                fill="url(#glassReflection)"
                stroke="#090d16"
                strokeWidth="3.2"
              />
              {/* Right Lens Frame */}
              <rect
                x="212"
                y="164"
                width="38"
                height="26"
                rx="4"
                fill="url(#glassReflection)"
                stroke="#090d16"
                strokeWidth="3.2"
              />
              {/* Bridge */}
              <line x1="188" y1="172" x2="212" y2="172" stroke="#090d16" strokeWidth="3" />
              {/* Temples (Arms) */}
              <line x1="150" y1="170" x2="133" y2="174" stroke="#090d16" strokeWidth="2.5" />
              <line x1="250" y1="170" x2="267" y2="174" stroke="#090d16" strokeWidth="2.5" />
            </g>

            {/* Facial Hair: Thin Mustache & Subtle Facial Hair */}
            {/* Thin Mustache */}
            <path
              d="M 188 221 C 194 219 198 221 200 222 C 202 221 206 219 212 221 C 210 224 204 225 200 224 C 196 225 190 224 188 221 Z"
              fill="#18181b"
              opacity="0.9"
            />

            {/* Subtle goatee / chin shadow */}
            <ellipse cx="200" cy="245" rx="8" ry="4" fill="#18181b" opacity="0.35" />

            {/* Mouth / Lips: Smile vs Neutral vs Serious */}
            {isSmile ? (
              <path
                d="M 186 228 C 192 238 208 238 214 228 C 210 232 190 232 186 228 Z"
                fill="#883b27"
              />
            ) : isSerious ? (
              <path
                d="M 188 232 L 212 232"
                stroke="#883b27"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M 188 230 C 194 233 206 233 212 230"
                stroke="#883b27"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
