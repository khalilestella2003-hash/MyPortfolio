/* ============================================================
   NETWORK TOPOLOGY CANVAS — interactive nodes & packets
   ============================================================ */
export function initNetworkCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const setSize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight || 320;
  };
  setSize();
  window.addEventListener('resize', () => { setSize(); buildNodes(); }, { passive: true });

  const NODE_TYPES = ['router','switch','server','pc','cloud'];
  const ICONS = { router:'⬡', switch:'⬡', server:'▣', pc:'◻', cloud:'◉' };
  const COLORS = { router:'#00f5ff', switch:'#2299ff', server:'#7b2fff', pc:'#00ff88', cloud:'#ff6b2b' };

  let nodes = [], edges = [], packets = [];

  function buildNodes() {
    const cw = canvas.width, ch = canvas.height;
    nodes = [
      { id:0, type:'cloud',  x:cw*0.5,  y:ch*0.12, label:'Internet' },
      { id:1, type:'router', x:cw*0.5,  y:ch*0.38, label:'Core Router' },
      { id:2, type:'switch', x:cw*0.22, y:ch*0.62, label:'Switch A' },
      { id:3, type:'switch', x:cw*0.78, y:ch*0.62, label:'Switch B' },
      { id:4, type:'server', x:cw*0.1,  y:ch*0.88, label:'Server' },
      { id:5, type:'pc',     x:cw*0.35, y:ch*0.88, label:'PC' },
      { id:6, type:'pc',     x:cw*0.65, y:ch*0.88, label:'PC' },
      { id:7, type:'server', x:cw*0.9,  y:ch*0.88, label:'DB' },
    ];
    edges = [
      [0,1],[1,2],[1,3],[2,4],[2,5],[3,6],[3,7]
    ];
  }
  buildNodes();

  function spawnPacket() {
    if (!edges.length) return;
    const e = edges[Math.floor(Math.random() * edges.length)];
    const rev = Math.random() > 0.5;
    const [ai, bi] = rev ? [e[1], e[0]] : e;
    const a = nodes[ai], b = nodes[bi];
    if (!a || !b) return;
    packets.push({ ax:a.x, ay:a.y, bx:b.x, by:b.y, t:0, speed:0.018+Math.random()*0.01, color:'#00f5ff' });
  }

  let hoveredNode = null;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    hoveredNode = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < 20) || null;
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  });

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw edges
    edges.forEach(([ai, bi]) => {
      const a = nodes[ai], b = nodes[bi];
      if (!a || !b) return;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = 'rgba(0,245,255,0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.t += p.speed;
      if (p.t > 1) { packets.splice(i, 1); continue; }
      const px = p.ax + (p.bx - p.ax) * p.t;
      const py = p.ay + (p.by - p.ay) * p.t;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // nodes
    nodes.forEach(n => {
      const isHovered = n === hoveredNode;
      const color = COLORS[n.type] || '#00f5ff';
      const r = isHovered ? 18 : 14;

      // outer glow
      if (isHovered) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = color + '44';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // bg
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#071428';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = isHovered ? 2 : 1.5;
      ctx.stroke();

      // icon text
      ctx.font = `${r * 0.9}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.fillText(ICONS[n.type] || '●', n.x, n.y);

      // label
      if (isHovered) {
        ctx.font = '11px "Share Tech Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(n.label, n.x, n.y + r + 14);
      }
    });

    if (frame % 30 === 0) spawnPacket();
    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}
