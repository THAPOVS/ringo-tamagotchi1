// Mini-games: Fetch, Tug of War, Treat Toss
// Each is a small interactive scene that returns score → caller updates stats.

const { useRef } = React;

// ─── Fetch ──────────────────────────────────────────────────────────────
function FetchGame({ onClose, onResult }) {
  const [phase, setPhase] = useState('aim'); // aim | flying | running | done
  const [power, setPower] = useState(50);
  const [dir, setDir] = useState(1);
  const [ballX, setBallX] = useState(80);
  const [ballY, setBallY] = useState(280);
  const [ringoX, setRingoX] = useState(60);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const aimRef = useRef();

  useEffect(() => {
    if (phase !== 'aim') return;
    const id = setInterval(() => {
      setPower(p => {
        const next = p + dir * 3;
        if (next >= 95) { setDir(-1); return 95; }
        if (next <= 10) { setDir(1); return 10; }
        return next;
      });
    }, 30);
    return () => clearInterval(id);
  }, [phase, dir]);

  function throwBall() {
    setPhase('flying');
    const targetX = 80 + (power / 100) * 600;
    const startX = 80;
    const t0 = Date.now();
    const dur = 900;
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - t0) / dur);
      setBallX(startX + (targetX - startX) * t);
      setBallY(280 - 220 * Math.sin(t * Math.PI));
      if (t >= 1) {
        clearInterval(id);
        setBallY(290);
        setPhase('running');
        runToBall(targetX);
      }
    }, 16);
  }

  function runToBall(targetX) {
    const t0 = Date.now();
    const dur = Math.abs(targetX - 60) * 4;
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - t0) / dur);
      setRingoX(60 + (targetX - 60) * t);
      if (t >= 1) {
        clearInterval(id);
        const accuracy = Math.abs(power - 70); // sweet spot 70
        const points = Math.max(0, 20 - accuracy);
        setScore(s => s + points);
        setTimeout(() => {
          if (round >= 3) {
            setPhase('done');
          } else {
            setRound(r => r + 1);
            setPower(50);
            setBallX(80); setBallY(280);
            setRingoX(60);
            setPhase('aim');
          }
        }, 700);
      }
    }, 16);
  }

  if (phase === 'done') {
    return (
      <GameOver title="¡Pelota!" emoji="🎾" score={score} max={60}
                onClose={() => { onResult(score); onClose(); }}/>
    );
  }

  return (
    <GameShell title="Pelota" subtitle={`Ronda ${round}/3 · Puntos ${score}`} onClose={onClose}>
      <div style={{ position: 'relative', width: '100%', height: 360, overflow: 'hidden', borderRadius: 16 }}>
        <Scene id="park"/>
        <div style={{ position: 'absolute', left: ringoX, bottom: 30, transition: 'none' }}>
          <Ringo mood="happy" size={130} wagSpeed={2}/>
        </div>
        <div style={{ position: 'absolute', left: ballX - 14, top: ballY,
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 30%, #FFE39E, #C82F3A)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
          <div style={{ position: 'absolute', inset: 4, borderRadius: '50%',
                        border: '2px dashed #FFFFFF', opacity: 0.7 }}/>
        </div>
        {phase === 'aim' && (
          <div style={{ position: 'absolute', left: 100, bottom: 24, width: 200, height: 14,
                         background: 'rgba(0,0,0,0.2)', borderRadius: 7, border: '2px solid #1A1310' }}>
            <div style={{ width: power + '%', height: '100%', borderRadius: 5,
                           background: power > 60 && power < 80
                             ? 'linear-gradient(90deg, #4FA84A, #FFD86B)'
                             : 'linear-gradient(90deg, #4FA84A, #FFD86B, #C82F3A)' }}/>
          </div>
        )}
      </div>
      {phase === 'aim' && (
        <button onClick={throwBall} style={btn()}>🎾 ¡Tirar!</button>
      )}
      {phase === 'aim' && (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#6B4A2B', margin: '8px 0 0' }}>
          Frená la barra cerca de la zona dorada para más puntos
        </p>
      )}
    </GameShell>
  );
}

// ─── Tug of War ─────────────────────────────────────────────────────────
function TugGame({ onClose, onResult }) {
  const [pos, setPos] = useState(0); // -100 (Ringo wins) ... +100 (you win)
  const [time, setTime] = useState(15);
  const [phase, setPhase] = useState('play'); // play | done
  const [taps, setTaps] = useState(0);

  useEffect(() => {
    if (phase !== 'play') return;
    const drift = setInterval(() => {
      setPos(p => Math.max(-100, p - 1.4));
    }, 80);
    const timer = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(timer); clearInterval(drift);
          setPhase('done');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { clearInterval(drift); clearInterval(timer); };
  }, [phase]);

  function tap() {
    if (phase !== 'play') return;
    setPos(p => Math.min(100, p + 4));
    setTaps(t => t + 1);
  }

  if (phase === 'done') {
    const won = pos > 0;
    const score = Math.max(0, Math.round(taps * 0.6 + (won ? 20 : 0)));
    return (
      <GameOver title="Soga" emoji={won ? '🏆' : '🐕'}
                score={score} max={80}
                subtitle={won ? '¡Ganaste!' : '¡Gana Ringo!'}
                onClose={() => { onResult(score); onClose(); }}/>
    );
  }

  const ringoOffset = -pos * 0.8;
  return (
    <GameShell title="Soga" subtitle={`${time}s · toques ${taps}`} onClose={onClose}>
      <div style={{ position: 'relative', width: '100%', height: 360, overflow: 'hidden', borderRadius: 16 }}>
        <Scene id="park"/>
        {/* Ringo (left side, facing right) */}
        <div style={{ position: 'absolute', left: 30 + ringoOffset, bottom: 60, transform: 'scaleX(-1)' }}>
          <Ringo mood="happy" size={170} wagSpeed={3}/>
        </div>
        {/* Hand (right side) */}
        <div style={{ position: 'absolute', right: 30 - pos * 0.8, bottom: 150, fontSize: 64,
                      transform: 'rotate(-20deg)', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.3))' }}>✋</div>
        {/* Rope — connects Ringo's mouth (~165px from left after offset) to hand (~right 70px) */}
        <div style={{ position: 'absolute',
                      left: `calc(30px + 130px + ${ringoOffset}px)`,
                      right: `calc(30px + 60px + ${pos * 0.8 * -1}px)`,
                      bottom: 168, height: 9,
                      background: 'repeating-linear-gradient(90deg, #C99466 0 8px, #8B5E3C 8px 16px)',
                      borderRadius: 4, border: '2px solid #1A1310', transition: 'all 0.1s' }}/>
        {/* Center marker */}
        <div style={{ position: 'absolute', left: '50%', bottom: 0, width: 2, height: 40, background: '#1A1310', opacity: 0.4 }}/>
        <div style={{ position: 'absolute', left: '50%', bottom: 42, transform: 'translateX(-50%)',
                      fontSize: 12, color: '#1A1310', fontFamily: 'var(--hand)', opacity: 0.6 }}>centro</div>
      </div>
      <button onClick={tap} style={{ ...btn(), fontSize: 24 }}>💪 ¡TIRÁ!</button>
    </GameShell>
  );
}

// ─── Treat Toss ─────────────────────────────────────────────────────────
function TossGame({ onClose, onResult }) {
  const [ringoX, setRingoX] = useState(50); // % across
  const [time, setTime] = useState(20);
  const [score, setScore] = useState(0);
  const [treats, setTreats] = useState([]); // {id, x, y, vy}
  const [phase, setPhase] = useState('play');
  const idRef = useRef(0);

  useEffect(() => {
    if (phase !== 'play') return;
    let dir = 1;
    const move = setInterval(() => {
      setRingoX(x => {
        let nx = x + dir * 1.2;
        if (nx > 90) { dir = -1; nx = 90; }
        if (nx < 10) { dir = 1; nx = 10; }
        return nx;
      });
    }, 50);
    const timer = setInterval(() => {
      setTime(t => {
        if (t <= 1) { clearInterval(timer); clearInterval(move); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { clearInterval(move); clearInterval(timer); };
  }, [phase]);

  // animate falling treats
  useEffect(() => {
    if (phase !== 'play') return;
    const id = setInterval(() => {
      setTreats(ts => ts.map(t => ({ ...t, y: t.y + 8 })).filter(t => t.y < 360));
      // collision
      setTreats(ts => {
        const remaining = [];
        for (const t of ts) {
          if (t.y > 280 && Math.abs(t.x - ringoX) < 10) {
            setScore(s => s + 5);
            continue;
          }
          remaining.push(t);
        }
        return remaining;
      });
    }, 30);
    return () => clearInterval(id);
  }, [phase, ringoX]);

  function toss(e) {
    if (phase !== 'play') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setTreats(ts => [...ts, { id: idRef.current++, x, y: 0 }]);
  }

  if (phase === 'done') {
    return <GameOver title="Huesitos" emoji="🦴" score={score} max={100}
                     onClose={() => { onResult(score); onClose(); }}/>;
  }

  return (
    <GameShell title="Huesitos" subtitle={`${time}s · puntos ${score}`} onClose={onClose}>
      <div onClick={toss}
           style={{ position: 'relative', width: '100%', height: 360, overflow: 'hidden',
                    borderRadius: 16, cursor: 'crosshair' }}>
        <Scene id="park"/>
        {treats.map(t => (
          <div key={t.id} style={{ position: 'absolute', left: t.x + '%', top: t.y,
                                    transform: 'translate(-50%,0) rotate(20deg)',
                                    fontSize: 28 }}>🦴</div>
        ))}
        <div style={{ position: 'absolute', left: ringoX + '%', bottom: 30,
                       transform: 'translateX(-50%)' }}>
          <Ringo mood="happy" size={130} wagSpeed={2.5}/>
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 13, color: '#6B4A2B', margin: '8px 0 0' }}>
        Tocá arriba de Ringo para tirarle huesitos — ¡dale todos los que puedas!
      </p>
    </GameShell>
  );
}

// ─── Shared shells ──────────────────────────────────────────────────────
function GameShell({ title, subtitle, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26,19,16,0.7)',
      backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 20
    }}>
      <div style={{
        width: 'min(720px, 100%)', background: '#FBEAD0', borderRadius: 24,
        padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '4px solid #1A1310'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--display, "Bowlby One", serif)',
                          fontSize: 28, color: '#1A1310' }}>{title}</h2>
            {subtitle && <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B4A2B' }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ ...btn(true), padding: '8px 14px' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function GameOver({ title, emoji, score, max, subtitle, onClose }) {
  const stars = score >= max * 0.8 ? 3 : score >= max * 0.5 ? 2 : score > 0 ? 1 : 0;
  return (
    <GameShell title={title} onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 80, marginBottom: 8 }}>{emoji}</div>
        {subtitle && <p style={{ fontSize: 18, color: '#6B4A2B', margin: '0 0 12px' }}>{subtitle}</p>}
        <div style={{ fontSize: 44, fontWeight: 800, color: '#1A1310',
                       fontFamily: 'var(--display, "Bowlby One", serif)' }}>{score}</div>
        <div style={{ fontSize: 14, color: '#6B4A2B', marginBottom: 16 }}>puntos ganados</div>
        <div style={{ fontSize: 36, marginBottom: 16 }}>
          {[0,1,2].map(i => <span key={i} style={{ opacity: i < stars ? 1 : 0.25 }}>⭐</span>)}
        </div>
        <button onClick={onClose} style={btn()}>Listo</button>
      </div>
    </GameShell>
  );
}

function btn(secondary) {
  return {
    display: 'block', width: '100%', marginTop: 12,
    padding: '14px 20px', fontSize: 18, fontWeight: 700,
    fontFamily: 'inherit',
    background: secondary ? '#FBEAD0' : '#C82F3A',
    color: secondary ? '#1A1310' : '#FFFFFF',
    border: '3px solid #1A1310', borderRadius: 12,
    boxShadow: '0 4px 0 #1A1310', cursor: 'pointer',
  };
}

window.FetchGame = FetchGame;
window.TugGame = TugGame;
window.TossGame = TossGame;
