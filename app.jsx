// Main App — Ringo's Diary
// Diary-style scrapbook layout with full-bleed scene, mood indicators, and a paper-card overlay.

const { useState: useS, useEffect: useE, useRef: useR } = React;

const STORAGE_KEY = 'ringo-diary-v1';
const DEFAULTS = {
  hunger: 70, happiness: 80, energy: 75, hygiene: 70, health: 95,
  age: 0, weight: 8, coins: 50,
  scene: 'home', accessory: 'none',
  lastTick: Date.now(),
  log: [],
};

function useGameState() {
  const [state, setState] = useS(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...DEFAULTS, ...(saved || {}) };
    } catch { return DEFAULTS; }
  });

  // Persist
  useE(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  // Decay loop
  useE(() => {
    const id = setInterval(() => {
      setState(s => {
        const dt = (Date.now() - s.lastTick) / 1000;
        const factor = dt / 8; // gentle
        const hunger = Math.max(0, s.hunger - 1.2 * factor);
        const energy = Math.max(0, s.energy - 0.8 * factor);
        const happiness = Math.max(0, s.happiness - 0.6 * factor);
        const hygiene = Math.max(0, s.hygiene - 0.5 * factor);
        let health = s.health;
        if (hunger < 20 || hygiene < 20) health = Math.max(0, health - 0.4 * factor);
        if (hunger > 60 && hygiene > 50) health = Math.min(100, health + 0.2 * factor);
        return { ...s, hunger, energy, happiness, hygiene, health, lastTick: Date.now() };
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return [state, setState];
}

function getMood(s) {
  if (s.health < 30) return 'sick';
  if (s.energy < 15) return 'sleeping';
  if (s.hunger < 25 || s.happiness < 25) return 'sad';
  if (s.happiness > 70 && s.hunger > 40) return 'happy';
  return 'neutral';
}

function App() {
  const [state, setState] = useGameState();
  const [tab, setTab] = useS('care');
  const [game, setGame] = useS(null);
  const [action, setAction] = useS(null); // 'eating' | 'bath' | etc
  const [floats, setFloats] = useS([]);
  const [tweaks, setTweak] = useTweaks({
    "art": "diary",
    "showStats": true
  });

  function pushFloat(text, color) {
    const id = Math.random();
    setFloats(f => [...f, { id, text, color, t: Date.now() }]);
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1400);
  }

  function logEntry(emoji, text) {
    setState(s => ({
      ...s,
      log: [{ time: Date.now(), emoji, text }, ...s.log].slice(0, 24)
    }));
  }

  function doAction(name, fn, animLabel) {
    if (animLabel) {
      setAction(animLabel);
      setTimeout(() => setAction(null), 1600);
    }
    fn();
  }

  const actions = {
    feed: () => doAction('feed', () => {
      setState(s => ({ ...s, hunger: Math.min(100, s.hunger + 25), happiness: Math.min(100, s.happiness + 5) }));
      pushFloat('+25 🍖', '#4FA84A');
      logEntry('🍖', 'Comió rico');
    }, 'eating'),
    play: () => doAction('play', () => {
      setState(s => ({ ...s, happiness: Math.min(100, s.happiness + 20), energy: Math.max(0, s.energy - 12) }));
      pushFloat('+20 💛', '#FF9EC4');
      logEntry('🎾', 'Jugó un rato');
    }),
    bath: () => doAction('bath', () => {
      setState(s => ({ ...s, hygiene: 100, happiness: Math.min(100, s.happiness + 5) }));
      pushFloat('+30 🛁', '#88BFFF');
      logEntry('🛁', 'Se dio un baño');
    }, 'bath'),
    sleep: () => doAction('sleep', () => {
      setState(s => ({ ...s, energy: Math.min(100, s.energy + 40), happiness: Math.min(100, s.happiness + 3) }));
      pushFloat('+40 ⚡', '#A88BD4');
      logEntry('💤', 'Durmió una siesta');
    }),
    treat: () => doAction('treat', () => {
      setState(s => ({ ...s, hunger: Math.min(100, s.hunger + 8), happiness: Math.min(100, s.happiness + 10), coins: Math.max(0, s.coins - 5) }));
      pushFloat('+10 💛', '#FF9EC4');
      logEntry('🦴', 'Le dieron un premio (-5¢)');
    }, 'eating'),
    medicine: () => doAction('med', () => {
      setState(s => ({ ...s, health: Math.min(100, s.health + 30), happiness: Math.max(0, s.happiness - 5) }));
      pushFloat('+30 ❤️', '#C82F3A');
      logEntry('💊', 'Tomó remedio');
    }),
  };

  function setScene(id) {
    const names = { home: 'Casa', park: 'Parque', beach: 'Playa', kitchen: 'Cocina', snow: 'Nieve', night: 'Noche' };
    setState(s => ({ ...s, scene: id }));
    logEntry('🌅', `Se fue a ${names[id] || id}`);
  }
  function setAccessory(id) {
    setState(s => ({ ...s, accessory: id }));
  }

  function endGame(score) {
    setState(s => ({
      ...s,
      happiness: Math.min(100, s.happiness + score / 3),
      energy: Math.max(0, s.energy - 8),
      coins: s.coins + Math.round(score / 4),
    }));
    pushFloat(`+${Math.round(score/4)}¢`, '#FFD86B');
    logEntry('🏆', `Jugó un mini-juego, +${Math.round(score/4)} monedas`);
  }

  const mood = getMood(state);
  const sleeping = mood === 'sleeping';

  return (
    <div className={`art-${tweaks.art}`} style={{
      width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative',
    }}>
      {/* Full-bleed scene */}
      <div className="scene-wrap" style={{ position: 'absolute', inset: 0 }}>
        <Scene id={state.scene}/>
      </div>

      {/* Vignette + paper grain (only in diary mode) */}
      {tweaks.art === 'diary' && (
        <div className="paper-grain" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(26,19,16,0.3))',
          mixBlendMode: 'multiply',
        }}/>
      )}

      {/* Ringo center stage — feet land near the scene horizon */}
      <div className="ringo-stage" style={{
        position: 'absolute', left: '50%', top: '58%',
        transform: 'translate(-50%, -50%)',
        filter: tweaks.art === 'soft' ? 'drop-shadow(0 30px 30px rgba(0,0,0,0.35))'
              : tweaks.art === 'sticker' ? 'drop-shadow(0 0 0 #1A1310) drop-shadow(8px 8px 0 #1A1310)'
              : 'drop-shadow(0 14px 16px rgba(0,0,0,0.25))',
      }}>
        <Ringo mood={mood} sleeping={sleeping}
               action={action} accessory={state.accessory}
               size={Math.min(window.innerWidth * 0.5, 420)}/>
      </div>

      {/* Floating feedback */}
      {floats.map(f => (
        <div key={f.id} style={{
          position: 'absolute', left: '50%', bottom: '60%',
          transform: 'translateX(-50%)',
          fontWeight: 800, fontSize: 28, color: f.color,
          textShadow: '2px 2px 0 #FFFFFF, -2px -2px 0 #FFFFFF, 2px -2px 0 #FFFFFF, -2px 2px 0 #FFFFFF',
          animation: 'rfloat 1.4s ease-out forwards',
          pointerEvents: 'none',
          fontFamily: 'var(--display)',
        }}>{f.text}</div>
      ))}

      {/* Diary header */}
      <div className="diary-header" style={{
        position: 'absolute', top: 24, left: 24, right: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        pointerEvents: 'none',
      }}>
        <div className="paper-card" style={{ padding: '14px 22px', pointerEvents: 'auto' }}>
          <div style={{ fontFamily: 'var(--hand)', fontSize: 14, color: '#8B5E3C', letterSpacing: 1 }}>
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 style={{ margin: '2px 0 0', fontFamily: 'var(--display)', fontSize: 32, color: '#1A1310', lineHeight: 1 }}>
            El Diario de Ringo
          </h1>
          <div style={{ fontSize: 13, color: '#6B4A2B', marginTop: 4 }}>
            Día {Math.floor(state.age) + 1} · {moodLabel(mood)}
          </div>
        </div>

        <div className="paper-card" style={{ padding: '12px 18px', display: 'flex', gap: 14, alignItems: 'center', pointerEvents: 'auto' }}>
          <span style={{ fontSize: 22 }}>🪙</span>
          <span style={{ fontFamily: 'var(--display)', fontSize: 24, color: '#1A1310' }}>{state.coins}</span>
        </div>
      </div>

      {/* Stats — left column */}
      {tweaks.showStats && (
        <div className="paper-card stats-card" style={{
          position: 'absolute', left: 24, top: 130, width: 220,
          padding: '16px 18px',
        }}>
          <div style={{ fontFamily: 'var(--hand)', fontSize: 16, color: '#8B5E3C', marginBottom: 10 }}>
            Cómo se siente Ringo
          </div>
          <Stat icon="🍖" label="Hambre"    value={state.hunger}    color="#E8806B"/>
          <Stat icon="💛" label="Felicidad" value={state.happiness} color="#FF9EC4"/>
          <Stat icon="⚡" label="Energía"   value={state.energy}    color="#FFD86B"/>
          <Stat icon="🛁" label="Higiene"   value={state.hygiene}   color="#88BFFF"/>
          <Stat icon="❤️" label="Salud"     value={state.health}    color="#C82F3A"/>
        </div>
      )}

      {/* Recent diary entries */}
      <div className="paper-card diary-log" style={{
        position: 'absolute', right: 24, top: 130, width: 230,
        padding: '14px 18px', maxHeight: 320, overflowY: 'auto',
      }}>
        <div style={{ fontFamily: 'var(--hand)', fontSize: 16, color: '#8B5E3C', marginBottom: 10 }}>
          Aventuras de hoy
        </div>
        {state.log.length === 0 ? (
          <div style={{ fontSize: 13, color: '#A07550', fontStyle: 'italic' }}>
            Nada todavía. ¡Dale de comer a Ringo!
          </div>
        ) : (
          state.log.slice(0, 8).map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16 }}>{e.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: '#1A1310', lineHeight: 1.3 }}>{e.text}</div>
                <div style={{ fontSize: 10, color: '#A07550', fontFamily: 'var(--hand)' }}>
                  {timeAgo(e.time)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom action panel */}
      <div className="paper-card action-panel" style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
        width: 'min(640px, calc(100% - 48px))',
      }}>
        <div className="tabs" style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          {[
            ['care', '🐾 Cuidar'],
            ['play', '🎮 Jugar'],
            ['scene', '🌅 Escena'],
            ['wear', '👕 Ropa'],
          ].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={tab === k ? 'tab tab-active' : 'tab'}
              style={{
                padding: '8px 16px', fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
                background: tab === k ? '#1A1310' : 'transparent',
                color: tab === k ? '#FBEAD0' : '#1A1310',
                border: '2px solid #1A1310', borderRadius: 8, cursor: 'pointer',
              }}>{label}</button>
          ))}
        </div>

        {tab === 'care' && (
          <div className="action-row">
            <ActionBtn icon="🍖" label="Comer" sub="+25" onClick={actions.feed}/>
            <ActionBtn icon="🛁" label="Baño" sub="+30" onClick={actions.bath}/>
            <ActionBtn icon="💤" label="Dormir" sub="+40" onClick={actions.sleep}/>
            <ActionBtn icon="🦴" label="Premio" sub="-5¢" onClick={actions.treat} disabled={state.coins < 5}/>
            <ActionBtn icon="💊" label="Remedio" sub="+30" onClick={actions.medicine} highlight={state.health < 50}/>
          </div>
        )}
        {tab === 'play' && (
          <div className="action-row">
            <ActionBtn icon="🎾" label="Pelota" sub="3 rondas" onClick={() => setGame('fetch')}/>
            <ActionBtn icon="🪢" label="Soga" sub="15s" onClick={() => setGame('tug')}/>
            <ActionBtn icon="🦴" label="Huesitos" sub="20s" onClick={() => setGame('toss')}/>
            <ActionBtn icon="🎮" label="Rápido" sub="+20💛" onClick={actions.play}/>
          </div>
        )}
        {tab === 'scene' && (
          <div className="action-row">
            {[
              ['home', '🏠', 'Casa'],
              ['park', '🌳', 'Parque'],
              ['beach', '🏖️', 'Playa'],
              ['kitchen', '🍳', 'Cocina'],
              ['snow', '❄️', 'Nieve'],
              ['night', '🌙', 'Noche'],
            ].map(([id, icon, label]) => (
              <ActionBtn key={id} icon={icon} label={label}
                         active={state.scene === id}
                         onClick={() => setScene(id)}/>
            ))}
          </div>
        )}
        {tab === 'wear' && (
          <div className="action-row">
            {[
              ['none', '🚫', 'Nada'],
              ['bow_tie', '🎀', 'Moño'],
              ['collar_red', '🔴', 'Collar'],
              ['sunglasses', '😎', 'Gafas'],
              ['birthday_hat', '🎂', 'Fiesta'],
              ['cowboy_hat', '🤠', 'Vaquero'],
              ['santa_hat', '🎅', 'Papá Noel'],
              ['bandana', '🩹', 'Pañuelo'],
              ['raincoat', '🧥', 'Piloto'],
            ].map(([id, icon, label]) => (
              <ActionBtn key={id} icon={icon} label={label}
                         active={state.accessory === id}
                         onClick={() => setAccessory(id)}/>
            ))}
          </div>
        )}
      </div>

      {/* Mini-games */}
      {game === 'fetch' && <FetchGame onClose={() => setGame(null)} onResult={endGame}/>}
      {game === 'tug'   && <TugGame   onClose={() => setGame(null)} onResult={endGame}/>}
      {game === 'toss'  && <TossGame  onClose={() => setGame(null)} onResult={endGame}/>}

      {/* Tweaks */}
      <TweaksPanel title="Ajustes">
        <TweakSection title="Estilo">
          <TweakRadio value={tweaks.art} onChange={v => setTweak('art', v)}
                      options={[
                        { value: 'diary',   label: 'Diario' },
                        { value: 'soft',    label: 'Suave' },
                        { value: 'sticker', label: 'Sticker' },
                      ]}/>
        </TweakSection>
        <TweakSection title="Mostrar">
          <TweakToggle label="Ver stats" value={tweaks.showStats}
                       onChange={v => setTweak('showStats', v)}/>
        </TweakSection>
        <TweakSection title="Estado rápido">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <TweakButton label="Feliz"   onClick={() => setState(s => ({ ...s, hunger: 80, happiness: 90, energy: 80, hygiene: 80, health: 100 }))}/>
            <TweakButton label="Triste"  onClick={() => setState(s => ({ ...s, hunger: 30, happiness: 15, energy: 40, hygiene: 30, health: 80 }))}/>
            <TweakButton label="Sueño"   onClick={() => setState(s => ({ ...s, energy: 8 }))}/>
            <TweakButton label="Enfermo" onClick={() => setState(s => ({ ...s, health: 20 }))}/>
            <TweakButton label="Reset"   onClick={() => { localStorage.removeItem(STORAGE_KEY); location.reload(); }}/>
          </div>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function moodLabel(m) {
  return { happy: 'súper feliz ✨', sad: 'medio bajón 💧', sick: 'no se siente bien 🤒',
           sleeping: 'profundamente dormido 💤', neutral: 'tranquilo' }[m] || 'tranquilo';
}

function timeAgo(t) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return 'recién';
  if (s < 3600) return 'hace ' + Math.floor(s/60) + ' min';
  return 'hace ' + Math.floor(s/3600) + ' h';
}

function Stat({ icon, label, value, color }) {
  const v = Math.round(value);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#1A1310', marginBottom: 3 }}>
        <span>{icon} {label}</span>
        <span style={{ fontFamily: 'var(--display)', fontSize: 13 }}>{v}</span>
      </div>
      <div style={{ height: 8, background: 'rgba(26,19,16,0.12)', borderRadius: 4, overflow: 'hidden', border: '1.5px solid #1A1310' }}>
        <div style={{ height: '100%', width: v + '%', background: color, transition: 'width 0.4s' }}/>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, sub, onClick, active, highlight, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className="action-btn"
      style={{
        flex: '1 1 70px', minWidth: 70, padding: '10px 6px',
        fontFamily: 'inherit', cursor: disabled ? 'not-allowed' : 'pointer',
        background: active ? '#1A1310' : highlight ? '#FFD86B' : '#FBEAD0',
        color: active ? '#FBEAD0' : '#1A1310',
        border: '2.5px solid #1A1310', borderRadius: 12,
        boxShadow: disabled ? 'none' : (active ? 'inset 0 2px 0 rgba(0,0,0,0.4)' : '0 3px 0 #1A1310'),
        opacity: disabled ? 0.5 : 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700 }}>{label}</span>
      {sub && <span style={{ fontSize: 9, opacity: 0.7 }}>{sub}</span>}
    </button>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
