/* ==========================================================================
   app.js — renders the board, routes the traces, loads blog posts.
   Content lives in config.js. You should not need to edit this file.
   ========================================================================== */
(() => {
  'use strict';

  const S = window.SITE || {};
  const NS = 'http://www.w3.org/2000/svg';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const esc = (s = '') =>
    String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeUrl = (u = '') => (/^\s*(javascript|data|vbscript):/i.test(u) ? '#' : String(u).trim());
  const isExt = u => /^https?:\/\//i.test(u);
  const extAttr = u => (isExt(u) ? ' target="_blank" rel="noopener"' : '');
  const hex = n => '0x' + n.toString(16).toUpperCase().padStart(4, '0');
  const isNarrow = () => window.matchMedia('(max-width: 900px)').matches;
  const isPostRoute = () => /^#\/post\//.test(location.hash);

  /* ---------- data ---------- */
  const posts = (S.posts || [])
    .map((p, i) => ({ ...p, slug: String(p.slug || '').replace(/[^\w-]/g, ''), tags: p.tags || [], _i: i }))
    .filter(p => p.slug)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0) || b._i - a._i);
  const addrOf = p => hex(posts.length - posts.indexOf(p)); // oldest post = 0x0001

  /* ==========================================================================
     Rendering
     ========================================================================== */
  function renderTitle() {
    const sections = [
      ['about', 'About', true],
      ['projects', 'Projects', (S.projects || []).length],
      ['log', 'Log', posts.length],
      ['skills', 'Skills', (S.skills || []).length],
      ['contact', 'Contact', (S.socials || []).some(s => s.href)]
    ];
    $('#titleblock').innerHTML = `
      <div class="tb-id">
        <p class="silk tiny">${esc(S.boardId || 'Portfolio')} · Rev ${esc(S.rev || 'A')}</p>
        <h1 class="silk name"><a href="#/" data-go="top">${esc(S.name)}</a></h1>
        <p class="silk sub">${esc(S.tagline || '')}</p>
      </div>
      <nav class="tb-nav" aria-label="Sections">
        ${sections.filter(s => s[2]).map(s => `<a class="btn" href="#/" data-go="${s[0]}">${s[1]}</a>`).join('')}
        <span class="led" title="PWR OK"><i></i><span class="silk tiny">PWR</span></span>
      </nav>`;
  }

  function renderBoard() {
    const projects = S.projects || [];
    const socials = (S.socials || []).filter(s => s.href);
    const initials = (S.name || '').split(/\s+/).map(w => w[0] || '').join('').slice(0, 3).toUpperCase();
    const yy = String(S.grad || '').slice(-2);

    /* U1: about */
    const bio = (S.bio || []).map(p => `<p class="bio">${esc(p)}</p>`).join('');
    const specs = (S.specs || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    const about = `
      <section class="part u1" id="about" data-net aria-labelledby="about-h">
        <div class="part-label"><span class="silk ref">U1</span><span class="silk val">Main · About</span></div>
        <div class="chip qfp">
          <div class="pins pt"></div><div class="pins pb"></div><div class="pins pl"></div><div class="pins pr"></div>
          <div class="body">
            <i class="pin1"></i>
            <p class="mark-tiny">${esc(initials)}${esc(yy)} · Rev ${esc(S.rev || 'A')}</p>
            <h2 class="mark" id="about-h">${esc(S.role || 'About')}</h2>
            <p class="mark-sub">${esc(S.tagline || '')}</p>
            ${bio}
            ${specs ? `<dl class="specs">${specs}</dl>` : ''}
          </div>
        </div>
      </section>`;

    /* J1: socials */
    const contact = socials.length ? `
      <section class="part j1" id="contact" data-net aria-label="Contact links">
        <div class="part-label"><span class="silk ref">J1</span><span class="silk val">Connect</span></div>
        <div class="chip hdrbox">
          <ul class="hdr">
            ${socials.map((s, i) => `
              <li data-net>
                <a href="${esc(safeUrl(s.href))}"${extAttr(s.href)}>
                  <span class="pinbox"><b class="n">${i + 1}</b><i class="pinsq"></i></span>
                  <span class="lab"><b class="silk">${esc(s.label)}</b><small>${esc(s.handle || '')}</small></span>
                </a>
              </li>`).join('')}
          </ul>
        </div>
      </section>` : '';

    /* U2..: projects */
    const projHtml = projects.length ? `
      <section class="projects" id="projects" aria-labelledby="proj-h">
        <header class="sec-head"><h2 class="silk" id="proj-h">Projects</h2><span class="silk val">U2${projects.length > 1 ? ' – U' + (projects.length + 1) : ''}</span></header>
        <div class="ic-grid">
          ${projects.map((p, i) => {
            const links = [];
            if (p.repo) links.push(['Repo', p.repo]);
            if (p.demo) links.push(['Demo', p.demo]);
            if (p.post) links.push(['Write-up', '#/post/' + String(p.post).replace(/[^\w-]/g, '')]);
            const main = links.length ? links[0][1] : '';
            const title = main
              ? `<a class="stretch" href="${esc(safeUrl(main))}"${extAttr(main)}>${esc(p.name)}</a>`
              : esc(p.name);
            return `
          <article class="part ic" id="proj-${i}" data-net>
            <div class="part-label"><span class="silk ref">U${i + 2}</span><span class="silk val">${esc(p.status || 'Project')}</span></div>
            <div class="chip dip">
              <div class="pins pl"></div><div class="pins pr"></div>
              <div class="body">
                <i class="pin1"></i><i class="notch"></i>
                <h3 class="mark sm">${title}</h3>
                <p class="desc">${esc(p.desc || '')}</p>
                ${(p.tags || []).length ? `<ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
                ${links.length ? `<p class="links">${links.map(([l, u]) => `<a href="${esc(safeUrl(u))}"${extAttr(u)}>${l}</a>`).join('')}</p>` : ''}
              </div>
            </div>
          </article>`;
          }).join('')}
        </div>
      </section>` : '';

    /* Build log */
    const logRows = posts.map(p => `
      <li>
        <a href="#/post/${p.slug}">
          <span class="addr">${addrOf(p)}</span>
          <time datetime="${esc(p.date)}">${esc(p.date)}</time>
          <span class="t">${esc(p.title)}</span>
          ${p.summary ? `<p class="sum">${esc(p.summary)}</p>` : ''}
          ${p.tags.length ? `<p class="tg">${p.tags.map(esc).join(' · ')}</p>` : ''}
        </a>
      </li>`).join('');
    const log = `
      <section class="part log" id="log" data-net aria-labelledby="log-h">
        <div class="part-label"><span class="silk ref">U${projects.length + 2}</span><span class="silk val">Flash · Build log</span></div>
        <div class="chip dip">
          <div class="pins pl"></div><div class="pins pr"></div>
          <div class="body">
            <i class="pin1"></i><i class="notch"></i>
            <h2 class="mark" id="log-h">Build log</h2>
            <p class="mark-sub">${posts.length} ${posts.length === 1 ? 'entry' : 'entries'} · newest first</p>
            ${posts.length ? `<ol class="dump">${logRows}</ol>` : '<p class="empty">NO ENTRIES. Add one in config.js.</p>'}
          </div>
        </div>
      </section>`;

    /* Skills as SMD parts */
    const counters = {};
    const groups = (S.skills || []).map(g => {
      const pre = String(g.prefix || 'R').toUpperCase().slice(0, 1);
      return `
        <div class="grp">
          <h3 class="silk">${esc(g.group)}</h3>
          <ul class="smds">
            ${(g.items || []).map(it => {
              counters[pre] = (counters[pre] || 0) + 1;
              return `<li class="smd pf-${pre}"><span class="body" aria-hidden="true"></span><b>${pre}${counters[pre]}</b><span>${esc(it)}</span></li>`;
            }).join('')}
          </ul>
        </div>`;
    }).join('');
    const skills = groups ? `
      <section class="part skills" id="skills" data-net aria-label="Skills">
        <div class="part-label"><span class="silk ref">R · C · L</span><span class="silk val">Skills</span></div>
        <div class="chip zone">${groups}</div>
      </section>` : '';

    $('#view-board').innerHTML = about + contact + projHtml + log + skills;
  }

  function renderFoot() {
    $('#foot').innerHTML = `
      <span>© ${new Date().getFullYear()} ${esc(S.name)}</span>
      <span>Hand-built · HTML · CSS · JS · no framework</span>
      ${S.repo ? `<a href="${esc(safeUrl(S.repo))}" target="_blank" rel="noopener">View source</a>` : ''}`;
  }

  /* ==========================================================================
     Tiny Markdown renderer (headings, paragraphs, lists, quotes, code, images,
     links, bold, italics, inline code, hr). Everything is HTML-escaped first.
     ========================================================================== */
  function inline(src) {
    const codes = [];
    let s = src.replace(/`([^`]+)`/g, (_, c) => { codes.push(esc(c)); return '\u0000' + (codes.length - 1) + '\u0000'; });
    s = esc(s);
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, u) => `<img src="${safeUrl(u)}" alt="${alt}" loading="lazy">`);
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${safeUrl(u)}"${extAttr(u)}>${t}</a>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
  }

  function md(src) {
    const lines = src.replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    const isBlockStart = l => /^(```|#{1,4}\s|>\s?|\s*[-*+]\s+|\s*\d+\.\s+|(-{3,}|\*{3,})\s*$)/.test(l);
    let i = 0;
    while (i < lines.length) {
      const l = lines[i];
      let m;
      if (/^\s*$/.test(l)) { i++; continue; }
      if (/^```/.test(l)) {
        const lang = l.slice(3).trim();
        const buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++;
        out.push(`<pre><code${lang ? ` data-lang="${esc(lang)}"` : ''}>${esc(buf.join('\n'))}</code></pre>`);
        continue;
      }
      if ((m = l.match(/^(#{1,4})\s+(.*)$/))) {
        out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);
        i++;
        continue;
      }
      if (/^(-{3,}|\*{3,})\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
      if (/^>\s?/.test(l)) {
        const buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
        out.push(`<blockquote>${md(buf.join('\n'))}</blockquote>`);
        continue;
      }
      if (/^\s*[-*+]\s+/.test(l)) {
        const items = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*+]\s+/, ''));
        out.push('<ul>' + items.map(t => `<li>${inline(t)}</li>`).join('') + '</ul>');
        continue;
      }
      if (/^\s*\d+\.\s+/.test(l)) {
        const items = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\.\s+/, ''));
        out.push('<ol>' + items.map(t => `<li>${inline(t)}</li>`).join('') + '</ol>');
        continue;
      }
      const buf = [lines[i++]];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !isBlockStart(lines[i])) buf.push(lines[i++]);
      out.push(`<p>${inline(buf.join(' '))}</p>`);
    }
    return out.join('\n');
  }

  /* ==========================================================================
     Traces
     ========================================================================== */
  let hotMap = new Map();
  let current = null;
  let raf = 0;
  let seed = 0;

  const svgEl = (name, attrs = {}) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };
  const dedupe = pts => pts.filter((p, i) => !i || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 0.5);

  // Orthogonal polyline with 45-degree chamfered corners, the way PCB tools draw them.
  function chamfer(pts, r) {
    if (pts.length < 3) return 'M' + pts.map(p => p[0] + ' ' + p[1]).join(' L');
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1);
      const k = Math.min(r, l1 / 2, l2 / 2);
      d += ` L${x1 - (x1 - x0) / l1 * k} ${y1 - (y1 - y0) / l1 * k} L${x1 + (x2 - x1) / l2 * k} ${y1 + (y2 - y1) / l2 * k}`;
    }
    const last = pts[pts.length - 1];
    return d + ` L${last[0]} ${last[1]}`;
  }

  function addNet(layer, rawPts, ends = [], opts = {}) {
    const pts = dedupe(rawPts);
    if (pts.length < 2) return;
    const d = chamfer(pts, opts.r || 10);
    const g = svgEl('g', { class: 'net' + (opts.deco ? ' deco' : '') });
    layer.append(g);
    g.append(svgEl('path', { d, class: 'cu' }));
    if (!opts.deco) {
      const sig = svgEl('path', { d, class: 'sig' });
      g.append(sig);
      const len = sig.getTotalLength();
      const gap = len + 150, period = gap + 12;
      sig.style.strokeDasharray = `12 ${gap}`;
      sig.style.setProperty('--P', period + 'px');
      sig.style.animationDuration = (period / 90).toFixed(2) + 's';
      sig.style.animationDelay = '-' + ((seed++ * 1.37) % (period / 90)).toFixed(2) + 's';
    }
    [pts[0], pts[pts.length - 1]].forEach(([x, y]) => {
      g.append(svgEl('circle', { cx: x, cy: y, r: 5, class: 'pad' }), svgEl('circle', { cx: x, cy: y, r: 1.8, class: 'hole' }));
    });
    ends.forEach(e => {
      if (!e) return;
      if (!hotMap.has(e)) hotMap.set(e, []);
      hotMap.get(e).push(g);
    });
  }

  function setHot(el) {
    if (el === current) return;
    (hotMap.get(current) || []).forEach(g => g.classList.remove('hot'));
    current = el;
    (hotMap.get(el) || []).forEach(g => g.classList.add('hot'));
  }

  function draw() {
    const board = $('#board'), svg = $('#traces');
    if (!board || !svg) return;
    const b = board.getBoundingClientRect();
    const W = Math.round(b.width), H = Math.round(b.height);
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.replaceChildren();
    hotMap = new Map();
    current = null;
    seed = 0;
    const layer = svgEl('g');
    svg.append(layer);

    const R = e => {
      const r = e.getBoundingClientRect();
      return { l: r.left - b.left, r: r.right - b.left, t: r.top - b.top, b: r.bottom - b.top, cx: (r.left + r.right) / 2 - b.left, cy: (r.top + r.bottom) / 2 - b.top };
    };

    if (!$('#view-board').hidden) (isNarrow() ? spine : bus)(layer, R);
    if (!isNarrow()) deco(layer, W, H);
  }

  // Desktop: pin header -> MCU, MCU -> projects, projects -> log + skills.
  function bus(layer, R) {
    const u1 = $('#about'), j1 = $('#contact'), log = $('#log'), skills = $('#skills');
    if (!u1) return;
    const U = R($('.chip', u1));

    // Each header pin is wired to the main chip.
    if (j1) {
      $$('.hdr li', j1).forEach(li => {
        const pb = R($('.pinbox', li));
        const y = pb.cy, yy = Math.min(Math.max(y, U.t + 16), U.b - 16);
        const x0 = pb.l - 4;
        const pts = [[x0, y]];
        if (Math.abs(yy - y) > 1) { const xm = (x0 + U.r) / 2; pts.push([xm, y], [xm, yy]); }
        pts.push([U.r, yy]);
        addNet(layer, pts, [li, u1, j1]);
      });
    }

    // MCU -> projects. First row drops from the MCU; later rows chain from the row above.
    const items = $$('#projects .ic').map(el => ({ el, r: R($('.chip', el)) }));
    if (items.length) {
      const bucket = i => Math.round(i.r.t / 12);
      const tops = [...new Set(items.map(bucket))].sort((a, b) => a - b);
      items.forEach(i => { i.row = tops.indexOf(bucket(i)); });

      const row0 = items.filter(i => i.row === 0).sort((a, b) => a.r.cx - b.r.cx);
      const minTop = Math.min(...row0.map(i => i.r.t));
      const clampX = x => Math.min(Math.max(x, U.l + 28), U.r - 28);
      const right = row0.filter(i => i.r.cx > U.r - 28);
      const left = row0.filter(i => i.r.cx < U.l + 28);
      const sp = 7, base = U.b + 16;
      row0.forEach(i => {
        let x1 = clampX(i.r.cx), mid = base;
        const ri = right.indexOf(i), li = left.indexOf(i);
        if (ri >= 0) { x1 -= (right.length - 1 - ri) * 9; mid = base + (right.length - 1 - ri) * sp; }
        if (li >= 0) { x1 += (left.length - 1 - li) * 9; mid = base + li * sp; }
        mid = Math.min(mid, minTop - 14);
        vlink(layer, x1, U.b, i.r.cx, i.r.t - 4, [u1, i.el], mid);
      });
      items.filter(i => i.row > 0).forEach(i => {
        const above = items.filter(a => a.row === i.row - 1).sort((a, c) => Math.abs(a.r.cx - i.r.cx) - Math.abs(c.r.cx - i.r.cx))[0];
        if (above) vlink(layer, above.r.cx, above.r.b + 4, i.r.cx, i.r.t - 4, [above.el, i.el]);
      });

      // Last project row -> build log and skills.
      const maxRow = Math.max(...items.map(i => i.row));
      const last = items.filter(i => i.row === maxRow).sort((a, b) => a.r.cx - b.r.cx);
      const a = last[0], z = last[last.length - 1], same = a === z;
      const low = (src, dst, dx) => {
        const D = R($('.chip', dst));
        const x1 = src.r.cx + dx;
        vlink(layer, x1, src.r.b + 4, Math.min(Math.max(x1, D.l + 28), D.r - 28), D.t - 4, [src.el, dst]);
      };
      if (log) low(a, log, same ? -26 : 0);
      if (skills) low(z, skills, same ? 26 : 0);
    }
  }

  function vlink(layer, x1, y1, x2, y2, ends, midY) {
    const pts = Math.abs(x1 - x2) < 2
      ? [[x2, y1], [x2, y2]]
      : (() => { const m = midY == null ? (y1 + y2) / 2 : midY; return [[x1, y1], [x1, m], [x2, m], [x2, y2]]; })();
    addNet(layer, pts, ends);
  }

  // Mobile: one routed spine down the left edge with a stub into each part.
  function spine(layer, R) {
    const x = 15;
    const parts = $$('#about, #contact, #projects .ic, #log, #skills');
    let first = null, last = null;
    parts.forEach(el => {
      const c = R($('.chip', el));
      const y = c.t + 34;
      addNet(layer, [[x, y], [c.l - 4, y]], [el]);
      if (first === null) first = y;
      last = y;
    });
    if (first !== null && last !== first) addNet(layer, [[x, first], [x, last]], []);
  }

  // Decorative side buses so the board never looks empty.
  function deco(layer, W, H) {
    [{ x: 22, dir: 1 }, { x: W - 22, dir: -1 }].forEach((s, si) => {
      for (let k = 0; k < 3; k++) {
        const x = s.x + k * 7 * s.dir;
        const y0 = 120 + k * 14, y1 = H - 120 - k * 10;
        if (y1 - y0 < 120) continue;
        const j = y0 + Math.round((0.26 + 0.2 * k + si * 0.12) * (y1 - y0));
        addNet(layer, [[x, y0], [x, j], [x + s.dir * 16, j + 16], [x + s.dir * 16, y1], [x, y1 + 16]], [], { deco: true, r: 8 });
      }
    });
  }

  const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); };

  /* ==========================================================================
     Routing
     ========================================================================== */
  let pending = null, memoY = 0, onPost = false, token = 0;

  function scrollToId(id) {
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const t = document.getElementById(id);
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function goSection(id) {
    if (isPostRoute()) { pending = id; location.hash = '#/'; return; }
    scrollToId(id);
  }

  function showBoard() {
    token++;
    $('#view-board').hidden = false;
    $('#view-post').hidden = true;
    document.title = S.siteTitle || S.name || 'Portfolio';
    const wasPost = onPost;
    onPost = false;
    requestAnimationFrame(() => {
      draw();
      if (pending) {
        const t = document.getElementById(pending);
        pending = null;
        if (t) t.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else if (wasPost) {
        window.scrollTo({ top: memoY, behavior: 'instant' });
      }
    });
  }

  function showPost(slug) {
    const my = ++token;
    if (!onPost) memoY = window.scrollY;
    onPost = true;
    const view = $('#view-post');
    $('#view-board').hidden = true;
    view.hidden = false;

    const i = posts.findIndex(p => p.slug === slug);
    if (i < 0) {
      document.title = 'Not found | ' + S.name;
      view.innerHTML = `<a class="back silk" href="#/">← Back to board</a><h1>Entry not found</h1><p class="muted">No post with the slug "${esc(slug)}" is listed in config.js.</p>`;
      window.scrollTo({ top: 0, behavior: 'instant' });
      schedule();
      return;
    }

    const p = posts[i], newer = posts[i - 1], older = posts[i + 1];
    document.title = `${p.title} | ${S.name}`;
    view.innerHTML = `
      <a class="back silk" href="#/">← Back to board</a>
      <p class="silk tiny meta">${addrOf(p)} · <time datetime="${esc(p.date)}">${esc(p.date)}</time></p>
      <h1>${esc(p.title)}</h1>
      ${p.tags.length ? `<ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      <div class="prose" id="prose"><p class="muted">Reading from flash…</p></div>
      <nav class="pager" aria-label="More posts">
        ${older ? `<a href="#/post/${older.slug}">← ${esc(older.title)}</a>` : '<span></span>'}
        ${newer ? `<a href="#/post/${newer.slug}">${esc(newer.title)} →</a>` : ''}
      </nav>`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    schedule();

    fetch(`posts/${p.slug}.md`, { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(txt => { if (my === token) { $('#prose').innerHTML = md(txt); schedule(); } })
      .catch(() => {
        if (my !== token) return;
        $('#prose').innerHTML = `<p class="muted">Could not load posts/${esc(p.slug)}.md.</p>
          <p class="muted">If you opened index.html straight from your disk, the browser blocks this. Run <code>python3 -m http.server</code> in the site folder and open http://localhost:8000. If the site is live, check that the file name matches the slug exactly.</p>`;
      });
  }

  function route() {
    const m = location.hash.match(/^#\/post\/([\w-]+)$/);
    if (m) showPost(m[1]); else showBoard();
  }

  /* ==========================================================================
     Boot
     ========================================================================== */
  function init() {
    document.title = S.siteTitle || S.name || 'Portfolio';
    const meta = $('meta[name="description"]');
    if (meta && S.description) meta.setAttribute('content', S.description);

    renderTitle();
    renderBoard();
    renderFoot();

    document.addEventListener('click', e => {
      const a = e.target.closest('a[data-go]');
      if (!a) return;
      e.preventDefault();
      goSection(a.dataset.go);
    });

    const board = $('#board');
    board.addEventListener('pointerover', e => setHot(e.target.closest('[data-net]')));
    board.addEventListener('pointerleave', () => setHot(null));
    board.addEventListener('focusin', e => setHot(e.target.closest('[data-net]')));
    board.addEventListener('focusout', () => setHot(null));

    addEventListener('hashchange', route);
    addEventListener('resize', schedule);
    addEventListener('load', schedule);
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(board);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);

    route();
    schedule();
  }

  init();
})();
