const C = window.CATALOGO;
const $ = s => document.querySelector(s);
const enc = f => 'assets/' + encodeURIComponent(f);

const CONTESTI = {
 'brocche-spose': 'Le «brocche della sposa» sono il vertice dei figoli oristanesi (su brugu de sos congiolargios, dal XVI secolo): anfore a 4 manici con beccucci, angeli, fiori e corone traforate, invetriate in verde con colature gialle. Dono nuziale, più da parata che da uso.',
 'uso-quotidiano': 'Stoviglie da mensa e da trasporto dei figoli: terracotta ingobbiata, decorazioni impresse a rotella (onde, ovoli, rosette), vetrina giallo-verde solo dove serve. Forme zoomorfe (gallo) e schiacciate da viaggio (frascu).',
 'acqua-cucina': 'Cantari con rubinetto, scolapasta e vasi per grassi: la cucina in terracotta. Interno ingobbiato e invetriato in verde, esterno spesso in biscotto; scritte devozionali (EFISIO) e numeri di magazzino dipinti.',
 'dietro-quinte': 'Depositi e vetrine del Museo delle Civiltà di Roma: scaffali «129 Sardegna», buste di conservazione, cartellini 52xx–53xx. Collezioni Clemente (1911) e Loria/Milano (1908).',
 'figure': 'Cavalli con fantoccio in ceramica invetriata: la tradizione del «Su Cavalluccio» oristanese, figura equestre propiziatoria un tempo collocata sui crinali dei tetti e nelle case. Serie 5206–5210, coll. Clemente 1911.',
 'casa-focolare': 'Fumaioli da camino in biscotto di terracotta, dal torrino conico forato al grande fumaiolo figurato: la ceramica oristanese oltre la mensa, sui tetti della città.',
 'a-oristano': 'Le ceramiche custodite a Oristano: sala in allestimento. Qui troveranno posto gli oggetti in città e, in futuro, i pezzi prestati e condivisi dalla comunità.'
};

function fotoTipo(nome){
  const n = nome.toLowerCase();
  if(/fondo/.test(n)) return 'fondo / scritte';
  if(/dettaglio|alto/.test(n)) return 'particolare';
  if(/beccuccio/.test(n)) return 'beccuccio';
  if(/vetrina/.test(n)) return 'in vetrina';
  if(/deposito|scaffali/.test(n)) return 'deposito';
  return 'veduta';
}

let filtroCat = '', filtroRac = '', filtroTipo = '', query = '';
function tipoDi(o){
  const t = (o.info && o.info.oggetto ? o.info.oggetto : '').toLowerCase().trim();
  if(!t || /deposito/.test(t)) return 'Deposito';
  if(/brocc/.test(t)) return 'Brocca';
  if(/figur/.test(t)) return 'Figura';
  if(/bottigli/.test(t)) return 'Bottiglia';
  if(/fumaiol/.test(t)) return 'Fumaiolo';
  if(/fiasc|frascu/.test(t)) return 'Fiasco';
  if(/anfor/.test(t)) return 'Anfora';
  if(/utensil|cubercu|tuvuli|tazza|piatto/.test(t)) return 'Utensile';
  if(/scolapast/.test(t)) return 'Scolapasta';
  if(/borracci/.test(t)) return 'Borraccia';
  if(/canter|orcio/.test(t)) return 'Cantaro';
  return t.charAt(0).toUpperCase() + t.slice(1);
}
function etichettaMedia(o){ return o.foto.length + (o.foto.length > 1 ? ' foto' : ' foto'); }
function coverDi(cat){ const o = C.oggetti.find(x => x.categoria === cat); return o ? enc(o.foto[0]) : enc('logo-museo-icon.png'); }

function renderCategorie(){
  const g = $('#gridCat'); g.innerHTML = '';
  Object.entries(C.categorie).forEach(([id, cat]) => {
    const n = C.oggetti.filter(o => o.categoria === id).length;
    const f = C.oggetti.filter(o => o.categoria === id).reduce((a, o) => a + o.foto.length, 0);
    const soon = n === 0;
    const d = document.createElement('div');
    d.className = 'cat' + (cat.sede === 'oristano' ? ' sede-or' : '') + (soon ? ' soon' : '');
    const badge = soon ? 'In arrivo · Oristano' : `${n} schede · ${f} foto`;
    d.innerHTML = `<img loading="lazy" src="${coverDi(id)}" alt="${cat.titolo}"><div class="t"><span class="badge${soon ? ' annuncio' : ''}">${badge}</span><h3>${cat.titolo}</h3><p>${cat.descr.slice(0, 120)}…</p></div>`;
    d.onclick = () => { filtroCat = filtroCat === id ? '' : id; syncFiltri(); };
    g.appendChild(d);
  });
}
function syncFiltri(){
  $('#filtroCat').value = filtroCat;
  const sr = $('#filtroRac'); if(sr) sr.value = filtroRac;
  const st = $('#filtroTipo'); if(st) st.value = filtroTipo;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.id === filtroCat));
  renderOggetti();
}
function renderChips(){
  const box = $('#chips'); box.innerHTML = '';
  const all = document.createElement('button'); all.className = 'chip' + (filtroCat === '' ? ' on' : ''); all.textContent = 'Tutte'; all.dataset.id = ''; all.onclick = () => { filtroCat = ''; syncFiltri(); }; box.appendChild(all);
  Object.entries(C.categorie).forEach(([id, cat]) => {
    const b = document.createElement('button'); b.className = 'chip' + (filtroCat === id ? ' on' : ''); b.dataset.id = id; b.textContent = cat.titolo; b.onclick = () => { filtroCat = filtroCat === id ? '' : id; syncFiltri(); }; box.appendChild(b);
  });
  const sel = $('#filtroCat'); sel.innerHTML = '<option value="">Tutte le sale</option>';
  Object.entries(C.categorie).forEach(([id, cat]) => { const o = document.createElement('option'); o.value = id; o.textContent = cat.titolo; sel.appendChild(o); });
  sel.onchange = e => { filtroCat = e.target.value; syncFiltri(); };
  const sr = $('#filtroRac');
  if(sr) sr.onchange = e => { filtroRac = e.target.value; syncFiltri(); };
  const st = $('#filtroTipo');
  if(st){
    const tipi = [...new Set(C.oggetti.map(tipoDi))].sort((a, b) => a.localeCompare(b, 'it'));
    tipi.forEach(t => {
      const n = C.oggetti.filter(o => tipoDi(o) === t).length;
      const op = document.createElement('option'); op.value = t; op.textContent = `${t} (${n})`; st.appendChild(op);
    });
    st.onchange = e => { filtroTipo = e.target.value; syncFiltri(); };
  }
}
function filtrati(){
  const q = query.trim().toLowerCase();
  return C.oggetti.filter(o => {
    if(filtroCat && o.categoria !== filtroCat) return false;
    if(filtroRac && !(o.info.autore || '').includes(filtroRac)) return false;
    if(filtroTipo && tipoDi(o) !== filtroTipo) return false;
    if(q){
      const hay = (o.titolo + ' ' + o.chiave + ' ' + (o.codice || '') + ' ' + ((o.info && o.info.inventario) || '') + ' ' + ((o.info && o.info.soggetto) || '') + ' ' + ((o.info && o.info.descrizione) || '') + ' ' + ((o.info && o.info.dettagli) || '')).toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
}
function renderOggetti(){
  const g = $('#gridObj'); const list = filtrati();
  $('#conteggio').textContent = `— ${list.length} schede`;
  g.innerHTML = '';
  if(!list.length){
    const cat = filtroCat ? C.categorie[filtroCat] : null;
    const attesa = cat && cat.prossimamente;
    const msg = attesa ? 'Questa sala è in allestimento: le schede di Oristano arrivano con le prossime fotografie.' : 'Nessuna scheda trovata per questa ricerca.';
    const btn = attesa ? 'Vedi le schede di Roma' : 'Azzera i filtri';
    g.innerHTML = `<div class="vuoto"><p>${msg}</p><button class="btn" id="azzera">${btn}</button></div>`;
    $('#azzera').onclick = () => { filtroCat = ''; filtroRac = ''; filtroTipo = ''; query = ''; $('#q').value = ''; syncFiltri(); };
    return;
  }
  list.forEach(o => {
    const cat = C.categorie[o.categoria];
    const d = document.createElement('div'); d.className = 'obj' + (cat.sede === 'oristano' ? ' sede-or' : '');
    const sede = cat.sede === 'oristano' ? '<span class="badge sede-or">Oristano</span>' : '<span class="badge sede-roma">Roma</span>';
    d.innerHTML = `<img loading="lazy" src="${enc(o.foto[0])}" alt="${o.titolo}"><div class="t"><div class="sedi-riga">${sede}<span class="badge">${cat.titolo} · ${etichettaMedia(o)}</span></div><h3><span class="cod">${o.codice || ''}</span> ${o.titolo}</h3><div class="meta">inv. ${o.info.inventario} · ${o.info.data_ingresso} · ${o.info.autore}</div><button class="btn">Apri scheda museo →</button></div>`;
    d.querySelector('img').onclick = () => apri(o.id);
    d.querySelector('.btn').onclick = () => apri(o.id);
    g.appendChild(d);
  });
}
/* glossario: termini tecnici con tooltip nelle schede */
const GLOSS = [
  ["congiolargi|congiolargio", "ceramista oristanese; voce in uso dal XV secolo"],
  ["figoli|figolo", "vasaio di Oristano"],
  ["alfarer[oi]", "vasaio; dallo Statuto degli Alfareros del 1692"],
  ["gremio", "corporazione di mestiere dei figoli"],
  ["pintada", "brocca a chiazze verdi e gialle, il pezzo più prestigioso"],
  ["frascu", "borraccia ovoidale schiacciata, da viaggio"],
  ["pizzureddu", "brocchetta a tre manici con becco pizzicato, da tavola"],
  ["cavallucci[oi]", "figura equestre propiziatoria dei tetti oristanesi"],
  ["cantar[oi]", "orcio da acqua, anche con rubinetto"],
  ["stangiu", "coperta di ingobbio e vetrina dei reperti più antichi"],
  ["ingobbi[oi]", "sottile strato di argilla bianca sotto la vetrina"],
  ["invetriatur[ae]|vetrin[ae]", "coperta vetrosa che impermeabilizza la terracotta"],
  ["cubercu", "coperchio in ceramica"],
  ["biscotto", "terracotta alla prima cottura, non ancora invetriata"]
];
const GRE = new RegExp("\\b(" + GLOSS.map(g => g[0]).join("|") + ")\\b", "gi");
function gloss(t){
  return (t || '').replace(GRE, m => {
    const d = GLOSS.find(g => new RegExp("^(" + g[0] + ")$", "i").test(m));
    return `<span class="gl" tabindex="0" data-def="${d ? d[1] : ''}">${m}</span>`;
  });
}

let corrente = null, idxFoto = 0, ultimoFuoco = null;
function didascaliaDi(o, i){ return `${fotoTipo(o.foto[i])} — ${i + 1} di ${o.foto.length}`; }
function bindMain(){ const m = $('#mainImg'); if(m){ m.style.cursor = 'zoom-in'; m.onclick = () => apriLightbox(); } }
function apriLightbox(){
  const o = corrente; if(!o) return;
  $('#lbImg').src = enc(o.foto[idxFoto]);
  $('#lbImg').alt = `${o.titolo} — ${didascaliaDi(o, idxFoto)}`;
  $('#lbCap').textContent = `${o.codice || ''} ${o.titolo} · ${didascaliaDi(o, idxFoto)}`;
  $('#lightbox').classList.add('open'); $('#lightbox').setAttribute('aria-hidden', 'false');
  $('#lbChiudi').focus();
}
function chiudiLightbox(){
  $('#lightbox').classList.remove('open'); $('#lightbox').setAttribute('aria-hidden', 'true');
}
function lbVai(d){ mostraFoto(idxFoto + d); const o = corrente; if(!o) return; $('#lbImg').src = enc(o.foto[idxFoto]); $('#lbImg').alt = `${o.titolo} — ${didascaliaDi(o, idxFoto)}`; $('#lbCap').textContent = `${o.codice || ''} ${o.titolo} · ${didascaliaDi(o, idxFoto)}`; }
$('#lbChiudi').onclick = () => chiudiLightbox();
$('#lightbox').addEventListener('click', e => { if(e.target.id === 'lightbox') chiudiLightbox(); });
$('#lbPrev').onclick = e => { e.stopPropagation(); lbVai(-1); };
$('#lbNext').onclick = e => { e.stopPropagation(); lbVai(1); };
function mostraFoto(i){
  const o = corrente; if(!o) return;
  idxFoto = (i + o.foto.length) % o.foto.length;
  const box = $('#mainBox'); if(!box) return;
  box.innerHTML = `<img id="mainImg" src="${enc(o.foto[idxFoto])}" alt="${o.titolo} — ${didascaliaDi(o, idxFoto)}">`;
  document.querySelectorAll('#thumbs [data-i]').forEach(x => x.classList.toggle('on', +x.dataset.i === idxFoto));
  const c = $('#contaFoto'); if(c) c.textContent = `${idxFoto + 1} / ${o.foto.length}`;
  const dc = $('#didascalia'); if(dc) dc.textContent = didascaliaDi(o, idxFoto);
  bindMain();
}
function chiudiScheda(){
  $('#modal').classList.remove('open');
  try{ history.replaceState(null, '', location.pathname); }catch(_){}
  if(ultimoFuoco && ultimoFuoco.focus) ultimoFuoco.focus();
}
function apri(id){
  const o = C.oggetti.find(x => x.id === id); if(!o) return;
  corrente = o; idxFoto = 0;
  const cat = C.categorie[o.categoria];
  const tipi = [...new Set(o.foto.map(fotoTipo))].join(', ');
  $('#scheda').innerHTML = `
    <h2><span class="cod big">${o.codice || ''}</span> ${o.titolo}</h2>
    <div class="sott"><a href="#oggetti" id="crumbHome">Schede</a> › <a href="#" id="crumbCat">${cat.titolo}</a> › <strong>${o.codice || ''}</strong> ${cat.sede === 'oristano' ? '<span class="badge sede-or">Oristano</span>' : '<span class="badge sede-roma">Roma</span>'} · ${etichettaMedia(o)} in questa micro-sezione · vedute: ${tipi} · inv. <strong>${o.info.inventario}</strong></div>
    <div class="gal"><div class="main"><div id="mainBox"><img id="mainImg" src="${enc(o.foto[0])}" alt="${o.titolo}"></div><div class="conta" id="contaFoto"></div><p class="didascalia" id="didascalia"></p><p class="zoom-hint">Clicca sulla foto per ingrandirla a tutto schermo</p></div>
    <div class="thumbs" id="thumbs">${o.foto.map((f, i) => `<img data-i="${i}" class="${i === 0 ? 'on' : ''}" loading="lazy" src="${enc(f)}" alt="${o.titolo} — ${fotoTipo(f)}" title="${fotoTipo(f)} — ${f}">`).join('')}</div></div>
    <div class="blocchi">
      <div class="blocco registro lungo"><h4>Descrizione d'inventario — registro comunale (trascrizione fedele)</h4><p class="cit">«${o.info.soggetto}»</p><p><span class="badge inv">inv. ${o.info.inventario}</span> <span class="badge">${o.info.oggetto}</span> <span class="badge">${o.info.materia}</span> <span class="badge">ingresso ${o.info.data_ingresso}</span> <span class="badge">racc. ${o.info.autore}</span></p></div>
      <div class="blocco lungo"><h4>Descrizione museo</h4><p>${gloss(o.info.descrizione)}</p><p><strong>Contesto:</strong> ${gloss(CONTESTI[o.categoria])}</p></div>
      <div class="blocco"><h4>Dettagli da osservare</h4><p>${gloss(o.info.dettagli)}</p><h4>Le foto di questa scheda</h4><ul>${o.foto.map(f => `<li><strong>${fotoTipo(f)}</strong> — ${f}</li>`).join('')}</ul></div>
      <div class="blocco"><h4>Nota di catalogo</h4><p>Scheda compilata incrociando le foto con il file «Ceramiche Oristano.xlsx» (inventari 5206–5343 e oltre). Le foto mostrano spesso più pezzi insieme: l'attribuzione all'inventario segue la descrizione più vicina per forma, vetrina e scritte visibili (es. «5313» sul fondo dello scolapasta, «EFISIO» sul cantaro). Verificare dal vivo misure, marchi e stato conservativo.</p></div>
      <div class="blocco lungo vedi"><h4>Vedi anche</h4><p>${C.oggetti.filter(x => x.categoria === o.categoria && x.id !== o.id).slice(0, 3).map(x => `<a href="#scheda-${x.id}">${x.codice} — ${x.titolo}</a>`).join(' · ')}</p><button class="btn" id="condividi">Condividi questa scheda</button></div>
    </div>`;
  document.querySelectorAll('#thumbs [data-i]').forEach(im => im.onclick = () => mostraFoto(+im.dataset.i));
  const cc = $('#crumbCat');
  if(cc) cc.onclick = e => { e.preventDefault(); chiudiScheda(); filtroCat = o.categoria; syncFiltri(); const og = document.getElementById('oggetti'); if(og) og.scrollIntoView({ behavior: 'smooth' }); };
  mostraFoto(0);
  const sh = $('#condividi');
  if(sh) sh.onclick = async () => {
    const txt = `${o.titolo} — Museo della Ceramica di Oristano`;
    try{
      if(navigator.share){ await navigator.share({ title: txt, text: txt, url: location.href }); return; }
      await navigator.clipboard.writeText(location.href);
      sh.textContent = 'Link copiato negli appunti';
      setTimeout(() => { sh.textContent = 'Condividi questa scheda'; }, 2500);
    }catch(_){ sh.textContent = 'Copia il link dalla barra del browser'; }
  };
  ultimoFuoco = document.activeElement;
  $('#modal').classList.add('open'); $('#modal').setAttribute('aria-hidden', 'false');
  $('#chiudi').focus();
  try{ history.replaceState(null, '', '#scheda-' + o.id); }catch(_){}
}
$('#chiudi').onclick = () => chiudiScheda();
$('#modal').addEventListener('click', e => { if(e.target.id === 'modal') chiudiScheda(); });
document.addEventListener('keydown', e => {
  const lb = $('#lightbox').classList.contains('open');
  if(lb){
    if(e.key === 'Escape'){ chiudiLightbox(); return; }
    if(e.key === 'ArrowRight'){ lbVai(1); return; }
    if(e.key === 'ArrowLeft'){ lbVai(-1); return; }
  }
  const aperta = $('#modal').classList.contains('open');
  if(e.key === 'Escape'){ if(aperta) chiudiScheda(); return; }
  if(!aperta || !corrente) return;
  if(e.key === 'Tab'){
    const f = [...document.querySelectorAll('#modal .modal-box button, #modal .modal-box a[href]')].filter(el => !el.disabled && el.offsetParent !== null);
    if(!f.length) return;
    const primo = f[0], ultimo = f[f.length - 1];
    if(e.shiftKey && document.activeElement === primo){ ultimo.focus(); e.preventDefault(); }
    else if(!e.shiftKey && document.activeElement === ultimo){ primo.focus(); e.preventDefault(); }
    return;
  }
  if(e.key === 'ArrowRight') mostraFoto(idxFoto + 1);
  if(e.key === 'ArrowLeft') mostraFoto(idxFoto - 1);
});
$('#q').addEventListener('input', e => { query = e.target.value; renderOggetti(); });
const home = $('#home');
if(home) home.addEventListener('click', e => {
  e.preventDefault();
  filtroCat = ''; filtroRac = ''; filtroTipo = ''; query = '';
  const q = $('#q'); if(q) q.value = '';
  try{ history.replaceState(null, '', location.pathname); }catch(_){}
  syncFiltri();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
const pst = $('#stampa'); if(pst) pst.onclick = () => window.print();

let carTimer = null;
function carStep(){ const g = $('#gridCat'); const card = g.querySelector('.cat'); if(!card) return; const w = card.offsetWidth + 14; if(g.scrollLeft + g.clientWidth >= g.scrollWidth - 12){ g.scrollTo({ left: 0, behavior: 'smooth' }); } else { g.scrollBy({ left: w, behavior: 'smooth' }); } }
function carPlay(){ carStop(); if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; carTimer = setInterval(carStep, 4000); }
function carStop(){ if(carTimer){ clearInterval(carTimer); carTimer = null; } }
function initCarousel(){
  const g = $('#gridCat'), wrap = g.closest('.car-wrap');
  const passo = () => { const c = g.querySelector('.cat'); return (c ? c.offsetWidth + 14 : 266) * 2; };
  $('#carPrev').onclick = () => { carStop(); g.scrollBy({ left: -passo(), behavior: 'smooth' }); carPlay(); };
  $('#carNext').onclick = () => { carStop(); g.scrollBy({ left: passo(), behavior: 'smooth' }); carPlay(); };
  wrap.addEventListener('pointerenter', carStop);
  wrap.addEventListener('pointerleave', carPlay);
  wrap.addEventListener('touchstart', carStop, { passive: true });
  document.addEventListener('visibilitychange', () => { document.hidden ? carStop() : carPlay(); });
  carPlay();
}

window.addEventListener('hashchange', () => {
  const h = (location.hash || '').replace(/^#scheda-/, '');
  const t = C.oggetti.find(x => x.id === h);
  if(t) apri(h);
  else if($('#modal').classList.contains('open')) chiudiScheda();
});
function initMappa(){
  const el = document.getElementById('mappa'); if(!el) return;
  if(!window.L){ el.innerHTML = '<p class="nota">Mappa non disponibile: controlla la connessione.</p>'; return; }
  const m = L.map('mappa', { scrollWheelZoom: false }).setView([39.9048, 8.6040], 13);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Esri, OpenStreetMap contributors' }).addTo(m);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }).addTo(m);
  [
    ['Via Figoli', 39.9066616, 8.5968085, 'Forni, case e botteghe dei figoli.'],
    ['Antiquarium Arborense', 39.9044811, 8.5927257, 'Reperti dal Neolitico al Novecento.'],
    ['Centro Terracotta', 39.9042725, 8.5892737, 'Via Sant\u2019Antonio: documenti e mostre.'],
    ['Piazza Eleonora', 39.9036954, 8.5915361, 'Ceramiche a cielo aperto: Oristano Città Museo.'],
    ['Rive del Tirso', 39.9045, 8.6280, 'Cave d\u2019argilla (posizione indicativa).']
  ].forEach(([t, la, lo, d]) => L.marker([la, lo]).addTo(m).bindPopup(`<strong>${t}</strong><br>${d}`));
}

(function init(){
  const nf = C.totaleFoto, no = C.oggetti.length, nc = Object.keys(C.categorie).length;
  $('#stats').textContent = `${nc} sale · ${no} schede · ${nf} foto`;
  renderChips(); renderCategorie(); initCarousel(); renderOggetti(); initMappa();
  const h = (location.hash || '').replace(/^#scheda-/, '');
  if(h && C.oggetti.some(x => x.id === h)) apri(h);
})();
