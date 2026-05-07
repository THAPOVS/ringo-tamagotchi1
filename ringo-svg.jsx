// Ringo — illustrated SVG dog with expressions and idle animation
// White fur, black left-eye patch, black ears (per repo)
// Mood-driven expressions: happy, neutral, sad, sick, sleeping

const { useEffect, useState } = React;

function Ringo({ mood = 'happy', sleeping = false, action = null, size = 240, accessory = 'none', wagSpeed = 1 }) {
  // action: 'eating' | 'bath' | 'walking' | null
  const [tick, setTick] = useState(0);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(id);
  }, []);

  // Blink every 3-5s
  useEffect(() => {
    let cancel = false;
    function loop() {
      if (cancel) return;
      const wait = 2200 + Math.random() * 2400;
      setTimeout(() => {
        if (cancel) return;
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        loop();
      }, wait);
    }
    loop();
    return () => { cancel = true; };
  }, []);

  // Wag (-1..1)
  const wag = Math.sin(tick * 0.32 * wagSpeed);
  // Breathe (subtle scale)
  const breathe = Math.sin(tick * 0.08) * 0.012 + 1;
  // Sleep zzz pulse
  const zPulse = (tick % 24) / 24;

  const isHappy = mood === 'happy';
  const isSad = mood === 'sad';
  const isSick = mood === 'sick';
  const showTongue = isHappy || action === 'eating' || action === 'walking';
  const eyesClosed = sleeping || blink || action === 'bath';

  // Body tilt for sleep
  const sleepTilt = sleeping ? 'rotate(-90 200 220)' : '';

  return (
    <svg viewBox="0 0 400 320" width={size} height={size * 320/400}
         style={{ display: 'block', overflow: 'visible' }}>

      <defs>
        {/* soft inner shadow on body */}
        <radialGradient id="ringoBody" cx="50%" cy="40%" r="65%">
          <stop offset="0%"  stopColor="#FFFFFF"/>
          <stop offset="70%" stopColor="#F4EFE6"/>
          <stop offset="100%" stopColor="#D9CFBF"/>
        </radialGradient>
        <radialGradient id="ringoBlack" cx="50%" cy="35%" r="60%">
          <stop offset="0%"  stopColor="#3A2D2A"/>
          <stop offset="100%" stopColor="#1A1310"/>
        </radialGradient>
        <radialGradient id="bellyShine" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
        </radialGradient>
        <filter id="ringoSoft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/>
        </filter>
      </defs>

      <g transform={sleepTilt}>
        <g style={{ transform: `scale(${breathe})`, transformOrigin: '200px 220px', transformBox: 'view-box' }}>

          {/* Sick green tint shadow */}
          {isSick && (
            <ellipse cx="200" cy="290" rx="120" ry="14" fill="#88CC66" opacity="0.35"/>
          )}

          {/* Ground shadow */}
          {!sleeping && (
            <ellipse cx="200" cy="295" rx="110" ry="12" fill="#1A1310" opacity="0.18"/>
          )}

          {/* Tail — long shape, mostly white with small black tip (inverted from original) */}
          <g transform={`rotate(${wag * (sleeping ? 0 : 25)} 295 195)`}>
            <path
              d="M295 195 Q330 175 348 150 Q360 138 350 128 Q340 122 332 132 Q318 152 295 175 Z"
              fill="url(#ringoBody)"
              stroke="#1A1310" strokeWidth="2.5"
            />
            {/* small black tip */}
            <ellipse cx="346" cy="138" rx="8" ry="8" fill="url(#ringoBlack)" stroke="#0A0605" strokeWidth="1.5"/>
          </g>

          {/* Back legs */}
          <ellipse cx="148" cy="270" rx="28" ry="34" fill="url(#ringoBody)"/>
          <ellipse cx="252" cy="270" rx="28" ry="34" fill="url(#ringoBody)"/>
          {/* paw pads */}
          <ellipse cx="148" cy="295" rx="22" ry="8" fill="#E8B89C"/>
          <ellipse cx="252" cy="295" rx="22" ry="8" fill="#E8B89C"/>

          {/* Body */}
          <ellipse cx="200" cy="225" rx="105" ry="78" fill="url(#ringoBody)"/>
          {/* belly highlight */}
          <ellipse cx="200" cy="220" rx="80" ry="60" fill="url(#bellyShine)"/>
          {/* body outline subtle */}
          <ellipse cx="200" cy="225" rx="105" ry="78" fill="none" stroke="#1A1310" strokeWidth="3" opacity="0.85"/>

          {/* Front paws */}
          <ellipse cx="170" cy="296" rx="26" ry="14" fill="url(#ringoBody)" stroke="#1A1310" strokeWidth="2.5"/>
          <ellipse cx="230" cy="296" rx="26" ry="14" fill="url(#ringoBody)" stroke="#1A1310" strokeWidth="2.5"/>
          {/* toe lines */}
          <path d="M158 297 Q160 305 164 305 M170 298 Q172 306 176 306 M182 297 Q184 305 188 305"
                stroke="#8B7560" strokeWidth="1.5" fill="none" opacity="0.6"/>
          <path d="M218 297 Q220 305 224 305 M230 298 Q232 306 236 306 M242 297 Q244 305 248 305"
                stroke="#8B7560" strokeWidth="1.5" fill="none" opacity="0.6"/>

          {/* Head */}
          <g style={{ transform: action === 'eating' ? `translateY(${Math.sin(tick * 0.6) * 3}px)` : 'none' }}>

            {/* Ears — black, floppy */}
            {/* Left ear (viewer left) */}
            <path
              d="M118 130 Q92 145 95 200 Q100 230 130 220 Q140 180 132 145 Z"
              fill="url(#ringoBlack)"
              stroke="#0A0605" strokeWidth="2"
            />
            {/* Right ear (viewer right, has the eye-patch on this side too) */}
            <path
              d="M282 130 Q308 145 305 200 Q300 230 270 220 Q260 180 268 145 Z"
              fill="url(#ringoBlack)"
              stroke="#0A0605" strokeWidth="2"
            />

            {/* Head shape */}
            <ellipse cx="200" cy="155" rx="80" ry="72" fill="url(#ringoBody)" stroke="#1A1310" strokeWidth="3"/>

            {/* BLACK EYE PATCH on viewer's right eye (Ringo's left) */}
            <path
              d="M225 110 Q260 105 265 145 Q268 175 245 180 Q215 178 210 150 Q210 115 225 110 Z"
              fill="url(#ringoBlack)"
            />

            {/* Cheeks blush when happy */}
            {isHappy && !sleeping && (
              <>
                <ellipse cx="148" cy="180" rx="14" ry="8" fill="#FF9EC4" opacity="0.55"/>
                <ellipse cx="252" cy="180" rx="14" ry="8" fill="#FF9EC4" opacity="0.55"/>
              </>
            )}

            {/* Eyes */}
            {eyesClosed ? (
              <>
                <path d="M155 152 Q165 148 175 152" stroke="#1A1310" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <path d="M225 152 Q235 148 245 152" stroke="#1A1310" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              </>
            ) : isSad ? (
              <>
                {/* sad droopy eyes */}
                <ellipse cx="165" cy="158" rx="6" ry="7" fill="#1A1310"/>
                <ellipse cx="235" cy="158" rx="6" ry="7" fill="#1A1310"/>
                <path d="M155 145 Q165 150 175 145" stroke="#1A1310" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <path d="M225 145 Q235 150 245 145" stroke="#1A1310" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                {/* tear */}
                <ellipse cx="160" cy="170" rx="3" ry="5" fill="#88BFFF"/>
              </>
            ) : isSick ? (
              <>
                {/* X eyes */}
                <path d="M158 148 L172 162 M172 148 L158 162" stroke="#1A1310" strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M228 148 L242 162 M242 148 L228 162" stroke="#1A1310" strokeWidth="3.5" strokeLinecap="round"/>
              </>
            ) : (
              <>
                {/* happy/neutral eyes */}
                <ellipse cx="165" cy="155" rx="7" ry="9" fill="#1A1310"/>
                <ellipse cx="235" cy="155" rx="7" ry="9" fill="#1A1310"/>
                {/* glints */}
                <ellipse cx="167" cy="151" rx="2.5" ry="3" fill="#FFFFFF"/>
                <ellipse cx="237" cy="151" rx="2.5" ry="3" fill="#FFFFFF"/>
                {/* tiny secondary glint */}
                <circle cx="163" cy="158" r="1" fill="#FFFFFF" opacity="0.7"/>
                <circle cx="233" cy="158" r="1" fill="#FFFFFF" opacity="0.7"/>
              </>
            )}

            {/* Nose */}
            <ellipse cx="200" cy="190" rx="14" ry="10" fill="#1A1310"/>
            <ellipse cx="196" cy="186" rx="3" ry="2" fill="#FFFFFF" opacity="0.8"/>

            {/* Mouth */}
            {isSad ? (
              <path d="M180 215 Q200 205 220 215" stroke="#1A1310" strokeWidth="3" fill="none" strokeLinecap="round"/>
            ) : action === 'eating' ? (
              <ellipse cx="200" cy="215" rx="12" ry="8" fill="#3D1F1F"/>
            ) : (
              <path
                d={showTongue ? "M186 205 Q200 220 214 205 Q214 218 200 220 Q186 218 186 205 Z" : "M188 205 Q200 215 212 205"}
                fill={showTongue ? "#FF8AA8" : "none"}
                stroke="#1A1310"
                strokeWidth={showTongue ? "2" : "3"}
                strokeLinecap="round"
              />
            )}
            {/* tongue mid-line */}
            {showTongue && <path d="M200 207 L200 218" stroke="#D85A7A" strokeWidth="1.5"/>}

            {/* Accessory: bow tie / bandana / etc */}
            {accessory === 'bow_tie' && (
              <g transform="translate(200 232)">
                <path d="M-22 -8 L-8 0 L-22 8 Z" fill="#E8424E" stroke="#1A1310" strokeWidth="1.5"/>
                <path d="M22 -8 L8 0 L22 8 Z" fill="#E8424E" stroke="#1A1310" strokeWidth="1.5"/>
                <rect x="-6" y="-7" width="12" height="14" rx="2" fill="#C82F3A" stroke="#1A1310" strokeWidth="1.5"/>
              </g>
            )}
            {accessory === 'sunglasses' && (
              <g>
                <rect x="138" y="148" width="44" height="22" rx="6" fill="#1A1310"/>
                <rect x="218" y="148" width="44" height="22" rx="6" fill="#1A1310"/>
                <rect x="178" y="156" width="44" height="5" fill="#1A1310"/>
                <ellipse cx="148" cy="154" rx="6" ry="3" fill="#FFFFFF" opacity="0.5"/>
                <ellipse cx="228" cy="154" rx="6" ry="3" fill="#FFFFFF" opacity="0.5"/>
              </g>
            )}
            {accessory === 'birthday_hat' && (
              <g transform="translate(200 88)">
                <path d="M0 0 L-26 -2 L0 -56 Z" fill="#FF6B9D" stroke="#1A1310" strokeWidth="2"/>
                <path d="M0 0 L26 -2 L0 -56 Z" fill="#E8588A" stroke="#1A1310" strokeWidth="2"/>
                <ellipse cx="0" cy="0" rx="28" ry="5" fill="#FFD86B" stroke="#1A1310" strokeWidth="2"/>
                <circle cx="0" cy="-58" r="5" fill="#FFD86B" stroke="#1A1310" strokeWidth="1.5"/>
              </g>
            )}
            {accessory === 'cowboy_hat' && (
              <g transform="translate(200 90)">
                <ellipse cx="0" cy="0" rx="68" ry="9" fill="#8B5E3C" stroke="#1A1310" strokeWidth="2"/>
                <path d="M-30 0 Q-30 -38 0 -42 Q30 -38 30 0 Z" fill="#A06B42" stroke="#1A1310" strokeWidth="2"/>
                <ellipse cx="0" cy="0" rx="30" ry="3" fill="#3D2817"/>
              </g>
            )}
            {accessory === 'santa_hat' && (
              <g transform="translate(200 90)">
                <ellipse cx="0" cy="0" rx="46" ry="7" fill="#FFFFFF" stroke="#1A1310" strokeWidth="2"/>
                <path d="M-28 0 Q-28 -38 0 -52 Q30 -42 22 0 Z" fill="#D62F2F" stroke="#1A1310" strokeWidth="2"/>
                <circle cx="22" cy="-50" r="9" fill="#FFFFFF" stroke="#1A1310" strokeWidth="2"/>
              </g>
            )}
            {accessory === 'bandana' && (
              <g>
                <path d="M148 232 Q200 224 252 232 Q252 246 200 248 Q148 246 148 232 Z" fill="#E8424E" stroke="#1A1310" strokeWidth="2"/>
                <path d="M180 246 L200 264 L220 246 Z" fill="#E8424E" stroke="#1A1310" strokeWidth="2"/>
                <circle cx="172" cy="236" r="1.8" fill="#FFFFFF"/>
                <circle cx="200" cy="234" r="1.8" fill="#FFFFFF"/>
                <circle cx="228" cy="236" r="1.8" fill="#FFFFFF"/>
              </g>
            )}
            {accessory === 'raincoat' && (
              <g>
                <path d="M120 240 L120 320 L280 320 L280 240 Q200 232 120 240 Z" fill="#FFCC33" stroke="#C89829" strokeWidth="2.5"/>
                <circle cx="200" cy="270" r="4" fill="#FFFFFF"/>
                <circle cx="200" cy="290" r="4" fill="#FFFFFF"/>
              </g>
            )}
          </g>

          {/* Sleep Z's */}
          {sleeping && (
            <g style={{ transform: `translate(${zPulse * 30}px, ${-zPulse * 30}px)`, opacity: 1 - zPulse }}>
              <text x="280" y="100" fontSize="36" fontFamily="serif" fontWeight="bold" fill="#88BFFF">z</text>
              <text x="305" y="80" fontSize="48" fontFamily="serif" fontWeight="bold" fill="#88BFFF">Z</text>
            </g>
          )}
        </g>
      </g>

      {/* Bath bubbles overlay */}
      {action === 'bath' && (
        <g>
          {[0,1,2,3,4,5].map(i => {
            const ph = (tick * 2 + i * 14) % 60;
            return <circle key={i}
              cx={120 + i * 32}
              cy={250 - ph * 3}
              r={6 + (i % 2) * 3}
              fill="#AEDFF7" opacity={1 - ph/60}
              stroke="#FFFFFF" strokeWidth="1.5"
            />;
          })}
        </g>
      )}
    </svg>
  );
}

window.Ringo = Ringo;
