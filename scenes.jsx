// Scene backgrounds — illustrated SVG cards behind Ringo
// Each scene fills its container; Ringo sits on top.

function Scene({ id, time = 'day' }) {
  switch (id) {
    case 'home':    return <SceneHome time={time}/>;
    case 'park':    return <SceneParkk/>;
    case 'beach':   return <SceneBeach/>;
    case 'night':   return <SceneNight/>;
    case 'snow':    return <SceneSnow/>;
    case 'kitchen': return <SceneKitchen/>;
    default:        return <SceneHome/>;
  }
}

function SceneHome({ time = 'day' }) {
  const isDay = time === 'day';
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice"
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="homeWall" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor={isDay ? '#FBE7C9' : '#3D3461'}/>
          <stop offset="100%" stopColor={isDay ? '#F4D29A' : '#5A4D7E'}/>
        </linearGradient>
        <linearGradient id="homeFloor" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor={isDay ? '#C99466' : '#4A3B5C'}/>
          <stop offset="100%" stopColor={isDay ? '#A77548' : '#322640'}/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#homeWall)"/>
      <rect y="340" width="800" height="160" fill="url(#homeFloor)"/>
      {/* floor planks */}
      {[0,1,2,3,4,5,6].map(i => (
        <line key={i} x1={i * 120 + 40} y1="340" x2={i * 120 + 60} y2="500"
              stroke={isDay ? '#8B5E3C' : '#211833'} strokeWidth="2" opacity="0.5"/>
      ))}
      {/* window */}
      <rect x="540" y="60" width="180" height="160" rx="8" fill={isDay ? '#AEE0F5' : '#1A2540'} stroke="#6B4A2B" strokeWidth="6"/>
      <line x1="630" y1="60" x2="630" y2="220" stroke="#6B4A2B" strokeWidth="4"/>
      <line x1="540" y1="140" x2="720" y2="140" stroke="#6B4A2B" strokeWidth="4"/>
      {isDay ? (
        <>
          {/* sun */}
          <circle cx="690" cy="100" r="16" fill="#FFD86B"/>
          {/* clouds */}
          <ellipse cx="570" cy="95" rx="18" ry="8" fill="#FFFFFF" opacity="0.9"/>
          <ellipse cx="585" cy="92" rx="14" ry="7" fill="#FFFFFF" opacity="0.9"/>
        </>
      ) : (
        <>
          <circle cx="690" cy="100" r="14" fill="#F4E89C"/>
          <circle cx="685" cy="95" r="12" fill="#1A2540"/>
          <circle cx="565" cy="90" r="1.5" fill="#FFFFFF"/>
          <circle cx="610" cy="170" r="1.5" fill="#FFFFFF"/>
          <circle cx="700" cy="200" r="1.5" fill="#FFFFFF"/>
        </>
      )}
      {/* picture frame */}
      <rect x="80" y="80" width="120" height="90" rx="4" fill="#F4EAD5" stroke="#6B4A2B" strokeWidth="6"/>
      <path d="M100 150 L130 110 L155 130 L175 100 L185 150 Z" fill="#7BA88F"/>
      <circle cx="170" cy="105" r="8" fill="#FFD86B"/>
      {/* shelf with plant */}
      <rect x="260" y="200" width="130" height="8" fill="#6B4A2B"/>
      <ellipse cx="300" cy="195" rx="14" ry="6" fill="#3D2817"/>
      <path d="M286 198 Q286 165 295 168 M300 198 Q300 158 308 162 M314 198 Q314 168 322 172"
            stroke="#5A8B4F" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* book */}
      <rect x="340" y="188" width="40" height="12" fill="#C82F3A"/>
      <rect x="340" y="192" width="40" height="2" fill="#FFD86B"/>
      {/* bowl */}
      <ellipse cx="140" cy="395" rx="38" ry="10" fill="#C82F3A"/>
      <path d="M102 395 Q102 415 140 418 Q178 415 178 395" fill="#8B1F26"/>
      <ellipse cx="140" cy="395" rx="34" ry="6" fill="#3D1F1F"/>
    </svg>
  );
}

function SceneParkk() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice"
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="parkSky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="#A8D8F0"/>
          <stop offset="100%" stopColor="#E4F2FA"/>
        </linearGradient>
        <linearGradient id="parkGrass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="#7BC15E"/>
          <stop offset="100%" stopColor="#4F8F3A"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#parkSky)"/>
      {/* hills */}
      <ellipse cx="200" cy="380" rx="280" ry="80" fill="#5FA84A"/>
      <ellipse cx="640" cy="370" rx="240" ry="70" fill="#5FA84A"/>
      <rect y="350" width="800" height="150" fill="url(#parkGrass)"/>
      {/* sun */}
      <circle cx="660" cy="90" r="36" fill="#FFD86B"/>
      <circle cx="660" cy="90" r="46" fill="#FFD86B" opacity="0.3"/>
      {/* clouds */}
      <g fill="#FFFFFF">
        <ellipse cx="140" cy="100" rx="40" ry="14"/>
        <ellipse cx="170" cy="92" rx="28" ry="12"/>
        <ellipse cx="115" cy="105" rx="22" ry="10"/>
        <ellipse cx="420" cy="70" rx="34" ry="12"/>
        <ellipse cx="445" cy="64" rx="22" ry="10"/>
      </g>
      {/* tree left */}
      <rect x="60" y="240" width="22" height="120" fill="#6B4A2B"/>
      <circle cx="71" cy="240" r="56" fill="#3F8B3A"/>
      <circle cx="50" cy="220" r="38" fill="#4FA84A"/>
      <circle cx="95" cy="225" r="40" fill="#4FA84A"/>
      {/* tree right */}
      <rect x="710" y="260" width="20" height="100" fill="#6B4A2B"/>
      <circle cx="720" cy="265" r="44" fill="#3F8B3A"/>
      <circle cx="745" cy="248" r="32" fill="#4FA84A"/>
      {/* flowers */}
      {[120, 240, 380, 520, 640].map((x, i) => (
        <g key={i} transform={`translate(${x} ${430 + (i%2)*15})`}>
          <line x1="0" y1="0" x2="0" y2="-16" stroke="#3F8B3A" strokeWidth="2"/>
          <circle cx="0" cy="-18" r="5" fill={['#FF9EC4','#FFD86B','#A88BD4','#FF9EC4','#FFD86B'][i]}/>
          <circle cx="0" cy="-18" r="2" fill="#FFD86B"/>
        </g>
      ))}
      {/* path */}
      <path d="M0 480 Q400 440 800 470" stroke="#D9B47A" strokeWidth="36" fill="none" opacity="0.85"/>
    </svg>
  );
}

function SceneBeach() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice"
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="beachSky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="#FFC59E"/>
          <stop offset="50%" stopColor="#FFD9B0"/>
          <stop offset="100%" stopColor="#FFE7C2"/>
        </linearGradient>
        <linearGradient id="beachSea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="#3FA0BF"/>
          <stop offset="100%" stopColor="#7BD0E0"/>
        </linearGradient>
        <linearGradient id="beachSand" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="#F4D29A"/>
          <stop offset="100%" stopColor="#D9B47A"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#beachSky)"/>
      <circle cx="600" cy="180" r="60" fill="#FFB07A"/>
      <circle cx="600" cy="180" r="74" fill="#FFB07A" opacity="0.3"/>
      <rect y="280" width="800" height="80" fill="url(#beachSea)"/>
      {/* waves */}
      <path d="M0 285 Q100 278 200 285 T400 285 T600 285 T800 285" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M0 305 Q100 298 200 305 T400 305 T600 305 T800 305" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.5"/>
      <rect y="350" width="800" height="150" fill="url(#beachSand)"/>
      {/* palm */}
      <path d="M90 360 Q92 280 88 200" stroke="#6B4A2B" strokeWidth="14" fill="none"/>
      <ellipse cx="60" cy="200" rx="44" ry="14" fill="#3F8B3A" transform="rotate(-30 60 200)"/>
      <ellipse cx="120" cy="190" rx="44" ry="14" fill="#4FA84A" transform="rotate(20 120 190)"/>
      <ellipse cx="80" cy="170" rx="40" ry="12" fill="#5BB55A" transform="rotate(-70 80 170)"/>
      <circle cx="92" cy="210" r="6" fill="#8B5E3C"/>
      <circle cx="80" cy="218" r="6" fill="#8B5E3C"/>
      {/* shells */}
      <ellipse cx="280" cy="450" rx="14" ry="8" fill="#FFB7CB"/>
      <path d="M266 450 L294 450 L286 442 L280 446 L274 442 Z" fill="#FF9EC4"/>
      <ellipse cx="540" cy="470" rx="10" ry="6" fill="#F4EAD5"/>
      {/* starfish */}
      <g transform="translate(620 440)">
        <path d="M0 -14 L4 -4 L14 -2 L6 4 L8 14 L0 8 L-8 14 L-6 4 L-14 -2 L-4 -4 Z" fill="#E8806B"/>
      </g>
    </svg>
  );
}

function SceneNight() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice"
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="nightSky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="#1A1840"/>
          <stop offset="60%" stopColor="#3D2A5C"/>
          <stop offset="100%" stopColor="#5A3A6E"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#nightSky)"/>
      {/* stars */}
      {Array.from({length: 40}).map((_, i) => {
        const x = (i * 137) % 800;
        const y = (i * 91) % 280;
        const r = (i % 3) * 0.6 + 0.8;
        return <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={0.6 + (i%3)*0.15}/>;
      })}
      {/* big stars with glow */}
      <g>
        <circle cx="120" cy="80" r="2.5" fill="#FFFFFF"/>
        <circle cx="120" cy="80" r="6" fill="#FFFFFF" opacity="0.3"/>
      </g>
      <g>
        <circle cx="640" cy="60" r="2.5" fill="#FFFFFF"/>
        <circle cx="640" cy="60" r="6" fill="#FFFFFF" opacity="0.3"/>
      </g>
      {/* moon */}
      <circle cx="660" cy="130" r="44" fill="#F4E89C"/>
      <circle cx="650" cy="120" r="38" fill="#FFFFFF" opacity="0.95"/>
      <circle cx="635" cy="115" r="6" fill="#E8DCB0" opacity="0.6"/>
      <circle cx="660" cy="135" r="4" fill="#E8DCB0" opacity="0.6"/>
      {/* hills silhouette */}
      <path d="M0 380 Q200 320 400 360 Q600 320 800 350 L800 500 L0 500 Z" fill="#1A1530"/>
      <path d="M0 420 Q300 380 600 410 Q800 400 800 420 L800 500 L0 500 Z" fill="#0D0A20"/>
      {/* fireflies */}
      <circle cx="200" cy="380" r="2" fill="#FFD86B"/>
      <circle cx="200" cy="380" r="6" fill="#FFD86B" opacity="0.3"/>
      <circle cx="500" cy="390" r="2" fill="#FFD86B"/>
      <circle cx="500" cy="390" r="6" fill="#FFD86B" opacity="0.3"/>
    </svg>
  );
}

function SceneSnow() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice"
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="snowSky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="#C8D8E8"/>
          <stop offset="100%" stopColor="#E8EDF2"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#snowSky)"/>
      {/* mountains */}
      <path d="M0 380 L150 200 L260 320 L380 180 L520 340 L660 220 L800 360 L800 500 L0 500 Z" fill="#7B8B9E"/>
      <path d="M150 200 L180 240 L120 240 Z" fill="#FFFFFF"/>
      <path d="M380 180 L420 230 L340 230 Z" fill="#FFFFFF"/>
      <path d="M660 220 L690 260 L630 260 Z" fill="#FFFFFF"/>
      {/* snowy ground */}
      <path d="M0 380 Q400 360 800 380 L800 500 L0 500 Z" fill="#FFFFFF"/>
      <path d="M0 420 Q400 400 800 420 L800 500 L0 500 Z" fill="#F4F8FB"/>
      {/* trees */}
      <g transform="translate(120 360)">
        <rect x="-4" y="0" width="8" height="20" fill="#6B4A2B"/>
        <path d="M-22 0 L0 -36 L22 0 Z" fill="#3F8B3A"/>
        <path d="M-20 -22 L0 -52 L20 -22 Z" fill="#4FA84A"/>
        <path d="M-22 0 L-12 -8 L-2 -2 L8 -10 L18 -2 L22 0 Z" fill="#FFFFFF"/>
      </g>
      <g transform="translate(680 350)">
        <rect x="-4" y="0" width="8" height="22" fill="#6B4A2B"/>
        <path d="M-24 0 L0 -40 L24 0 Z" fill="#3F8B3A"/>
        <path d="M-22 -24 L0 -56 L22 -24 Z" fill="#4FA84A"/>
        <path d="M-24 0 L-14 -8 L-4 -2 L6 -10 L16 -2 L24 0 Z" fill="#FFFFFF"/>
      </g>
      {/* snowflakes */}
      {Array.from({length: 24}).map((_, i) => {
        const x = (i * 71) % 800;
        const y = (i * 53) % 320;
        return <circle key={i} cx={x} cy={y} r={1.6} fill="#FFFFFF"/>;
      })}
    </svg>
  );
}

function SceneKitchen() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMax slice"
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <rect width="800" height="500" fill="#F8E4C2"/>
      {/* tile pattern */}
      {Array.from({length: 14}).map((_, x) => Array.from({length: 6}).map((_, y) => (
        <rect key={`${x}-${y}`} x={x*60} y={y*40} width="58" height="38" rx="2"
              fill="#FBEAD0" stroke="#E8C68A" strokeWidth="1" opacity="0.6"/>
      )))}
      {/* counter */}
      <rect y="350" width="800" height="20" fill="#8B5E3C"/>
      <rect y="370" width="800" height="130" fill="#A07550"/>
      {/* cupboard */}
      <rect x="40" y="100" width="160" height="180" rx="8" fill="#C99466" stroke="#6B4A2B" strokeWidth="6"/>
      <rect x="60" y="120" width="55" height="140" fill="#A77548"/>
      <rect x="125" y="120" width="55" height="140" fill="#A77548"/>
      <circle cx="110" cy="190" r="3" fill="#6B4A2B"/>
      <circle cx="135" cy="190" r="3" fill="#6B4A2B"/>
      {/* fridge */}
      <rect x="600" y="80" width="160" height="270" rx="10" fill="#F4EAD5" stroke="#A07550" strokeWidth="5"/>
      <line x1="600" y1="170" x2="760" y2="170" stroke="#A07550" strokeWidth="4"/>
      <rect x="740" y="120" width="6" height="30" rx="3" fill="#A07550"/>
      <rect x="740" y="200" width="6" height="40" rx="3" fill="#A07550"/>
      {/* food bowl on counter */}
      <ellipse cx="380" cy="365" rx="50" ry="10" fill="#C82F3A"/>
      <path d="M330 365 Q330 388 380 392 Q430 388 430 365" fill="#8B1F26"/>
      <ellipse cx="380" cy="365" rx="44" ry="6" fill="#5A3F2A"/>
      <circle cx="362" cy="361" r="5" fill="#8B5E3C"/>
      <circle cx="386" cy="364" r="6" fill="#8B5E3C"/>
      <circle cx="400" cy="362" r="4" fill="#8B5E3C"/>
    </svg>
  );
}

window.Scene = Scene;
