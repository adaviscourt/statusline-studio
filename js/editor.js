import { SEGMENT_DEFS, ANSI_COLORS, ANSI_BG_COLORS } from './data.js';
import { state } from './state.js';
import { updateCode, updatePreview } from './codegen.js';
import { renderCanvas } from './canvas.js';

const ICONS_SYMBOLS = ['none','◆','⬡','◈','◉','◎','⬧','▓','⬚','⎇','$','%','±','✦','◌','⬦','│','·','❯','—'];
const ICONS_EMOJI   = ['📁','🌿','💰','⚙','🔒','🧪','⏱','⚡','🔥','💡','📊','🎯','🔗','📝','🚀','⚠️','✅','🌐','🔑','📦','🛠️','💻','🤖','⭐','🧩'];

export function selectSegment(rowIdx, segIdx, segUid) {
  state.selectedSegment = { rowIdx, segIdx };
  state.selectedUid = segUid;
  document.querySelectorAll('.segment-chip').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll(`[data-uid="${segUid}"]`).forEach(el => el.classList.add('selected'));
  renderEditor();
}

export function deselectSegment() {
  state.selectedSegment = null;
  state.selectedUid = null;
  document.getElementById('editorPanel').classList.remove('visible');
  document.getElementById('editorTitle').textContent = 'Properties';
}

export function getSeg() {
  if (!state.selectedSegment) return null;
  const { rowIdx, segIdx } = state.selectedSegment;
  return state.rows[rowIdx]?.[segIdx];
}

export function updateSegmentInState(seg) {
  if (!state.selectedSegment) return;
  const { rowIdx, segIdx } = state.selectedSegment;
  state.rows[rowIdx][segIdx] = seg;
}

export function renderEditor() {
  const seg = getSeg();
  if (!seg) { deselectSegment(); return; }

  const panel = document.getElementById('editorPanel');
  panel.classList.add('visible');
  document.getElementById('editorTitle').textContent = `✦ ${seg.label}`;

  const grid = document.getElementById('editorGrid');
  grid.innerHTML = '';

  // ─ Icon picker
  if (!seg.isSep) {
    const f = document.createElement('div');
    f.className = 'editor-field';
    f.innerHTML = `<div class="editor-label">Icon</div>`;

    const makeIconGroup = (icons, label) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:3px;margin-bottom:4px;';
      const lbl = document.createElement('div');
      lbl.style.cssText = 'font-size:9px;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px;';
      lbl.textContent = label;
      wrap.appendChild(lbl);
      const picker = document.createElement('div');
      picker.className = 'icon-picker';
      icons.forEach(ico => {
        const btn = document.createElement('div');
        btn.className = 'icon-btn' + (ico === 'none' ? ' no-icon' : '') + ((seg.icon === ico || (!seg.icon && ico === 'none')) ? ' selected' : '');
        btn.textContent = ico === 'none' ? '—' : ico;
        btn.title = ico === 'none' ? 'No icon' : ico;
        btn.onclick = () => {
          seg.icon = ico === 'none' ? '' : ico;
          updateSegmentInState(seg);
          renderCanvas(); updateCode(); renderEditor();
        };
        picker.appendChild(btn);
      });
      wrap.appendChild(picker);
      return wrap;
    };

    f.appendChild(makeIconGroup(ICONS_SYMBOLS, 'Symbols'));
    f.appendChild(makeIconGroup(ICONS_EMOJI, 'Emoji'));
    grid.appendChild(f);
  }

  // ─ Color picker
  const fc = document.createElement('div');
  fc.className = 'editor-field';
  fc.innerHTML = `<div class="editor-label">Color</div>`;
  const cpicker = document.createElement('div');
  cpicker.className = 'color-picker';
  Object.entries(ANSI_COLORS).forEach(([name, info]) => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch' + (seg.color === name ? ' selected' : '');
    sw.style.background = info.css;
    sw.title = name;
    sw.onclick = () => {
      seg.color = name;
      updateSegmentInState(seg);
      renderCanvas(); updateCode(); renderEditor();
    };
    cpicker.appendChild(sw);
  });
  fc.appendChild(cpicker);
  grid.appendChild(fc);

  // ─ Separator text
  if (seg.isSep) {
    const fs = document.createElement('div');
    fs.className = 'editor-field';
    fs.innerHTML = `<div class="editor-label">Separator</div>`;
    const sp = document.createElement('div');
    sp.className = 'sep-picker';
    ['│','·','❯','—','✦','|'].forEach(t => {
      const b = document.createElement('div');
      b.className = 'sep-btn' + (seg.sepText === t ? ' selected' : '');
      b.textContent = t;
      b.onclick = () => { seg.sepText = t; seg.icon = t; updateSegmentInState(seg); renderCanvas(); updateCode(); renderEditor(); };
      sp.appendChild(b);
    });
    const custom = document.createElement('input');
    custom.type = 'text';
    custom.className = 'editor-input';
    custom.style.width = '60px';
    custom.value = seg.sepText || '│';
    custom.placeholder = '│';
    custom.oninput = () => { seg.sepText = custom.value; seg.icon = custom.value; updateSegmentInState(seg); renderCanvas(); updateCode(); };
    sp.appendChild(custom);
    fs.appendChild(sp);
    grid.appendChild(fs);
    return;
  }

  // ─ Custom text
  if (seg.isCustom) {
    const ft = document.createElement('div');
    ft.className = 'editor-field';
    ft.innerHTML = `<div class="editor-label">Text</div>`;
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'editor-input';
    inp.style.width = '160px';
    inp.value = seg.customText || '';
    inp.oninput = () => { seg.customText = inp.value; updateSegmentInState(seg); renderCanvas(); updateCode(); };
    ft.appendChild(inp);
    grid.appendChild(ft);
  }

  // ─ Prefix
  const fp = document.createElement('div');
  fp.className = 'editor-field';
  fp.innerHTML = `<div class="editor-label">Prefix</div>`;
  const prefixInp = document.createElement('input');
  prefixInp.type = 'text'; prefixInp.className = 'editor-input';
  prefixInp.style.width = '80px'; prefixInp.value = seg.prefix || ''; prefixInp.placeholder = '[';
  prefixInp.oninput = () => { seg.prefix = prefixInp.value; updateSegmentInState(seg); updateCode(); };
  fp.appendChild(prefixInp);
  grid.appendChild(fp);

  // ─ Suffix
  const fs2 = document.createElement('div');
  fs2.className = 'editor-field';
  fs2.innerHTML = `<div class="editor-label">Suffix</div>`;
  const suffixInp = document.createElement('input');
  suffixInp.type = 'text'; suffixInp.className = 'editor-input';
  suffixInp.style.width = '80px'; suffixInp.value = seg.suffix || ''; suffixInp.placeholder = ']';
  suffixInp.oninput = () => { seg.suffix = suffixInp.value; updateSegmentInState(seg); updateCode(); };
  fs2.appendChild(suffixInp);
  grid.appendChild(fs2);

  // ─ Background color picker
  const fbg = document.createElement('div');
  fbg.className = 'editor-field';
  fbg.innerHTML = `<div class="editor-label">Background</div>`;
  const bgPicker = document.createElement('div');
  bgPicker.className = 'color-picker';
  Object.entries(ANSI_BG_COLORS).forEach(([name, info]) => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch' + ((seg.bgColor || 'default') === name ? ' selected' : '');
    sw.style.background = info.css;
    sw.style.border = name === 'default' ? '1px dashed var(--border2)' : '';
    sw.title = name;
    sw.onclick = () => { seg.bgColor = name; updateSegmentInState(seg); updateCode(); renderEditor(); };
    bgPicker.appendChild(sw);
  });
  fbg.appendChild(bgPicker);
  grid.appendChild(fbg);

  // ─ Bold + Hide toggles
  const fopts = document.createElement('div');
  fopts.className = 'editor-field';
  fopts.innerHTML = `<div class="editor-label">Display</div>`;
  ['bold','hide'].forEach(key => {
    const lbl = document.createElement('label');
    lbl.className = 'editor-toggle';
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.checked = !!seg[key];
    cb.onchange = () => { seg[key] = cb.checked; updateSegmentInState(seg); renderCanvas(); updateCode(); };
    lbl.appendChild(cb);
    lbl.appendChild(Object.assign(document.createElement('span'), { textContent: key === 'bold' ? 'Bold' : 'Hide' }));
    fopts.appendChild(lbl);
  });
  grid.appendChild(fopts);

  // ─ Max width
  const fmw = document.createElement('div');
  fmw.className = 'editor-field';
  fmw.innerHTML = `<div class="editor-label">Max Width</div>`;
  const mwInp = document.createElement('input');
  mwInp.type = 'number'; mwInp.className = 'editor-input';
  mwInp.min = 0; mwInp.max = 200; mwInp.value = seg.maxWidth || 0;
  mwInp.title = '0 = unlimited';
  mwInp.oninput = () => { seg.maxWidth = parseInt(mwInp.value) || 0; updateSegmentInState(seg); updateCode(); };
  fmw.appendChild(mwInp);
  grid.appendChild(fmw);

  // ─ Segment-specific fields
  const def = SEGMENT_DEFS.find(d => d.id === seg.id);
  (def?.editorFields || []).forEach(field => {
    const ft = document.createElement('div');
    ft.className = 'editor-field';
    if (field.type === 'toggle') {
      ft.innerHTML = `<div class="editor-label">Options</div>`;
      const lbl = document.createElement('label');
      lbl.className = 'editor-toggle';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!seg[field.key];
      cb.onchange = () => { seg[field.key] = cb.checked; updateSegmentInState(seg); renderCanvas(); updateCode(); };
      lbl.appendChild(cb);
      lbl.appendChild(Object.assign(document.createElement('span'), { textContent: field.label }));
      ft.appendChild(lbl);
    } else if (field.type === 'select') {
      ft.innerHTML = `<div class="editor-label">${field.label}</div>`;
      const sel = document.createElement('select');
      sel.className = 'editor-input';
      field.options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt; o.textContent = opt;
        o.selected = (seg[field.key] || field.options[0]) === opt;
        sel.appendChild(o);
      });
      sel.onchange = () => { seg[field.key] = sel.value; updateSegmentInState(seg); renderCanvas(); updateCode(); };
      ft.appendChild(sel);
    } else if (field.type === 'number') {
      ft.innerHTML = `<div class="editor-label">${field.label}</div>`;
      const inp = document.createElement('input');
      inp.type = 'number'; inp.className = 'editor-input';
      if (field.min !== undefined) inp.min = field.min;
      if (field.max !== undefined) inp.max = field.max;
      inp.value = seg[field.key] ?? field.min ?? 0;
      inp.oninput = () => { seg[field.key] = parseInt(inp.value) || (field.min ?? 0); updateSegmentInState(seg); updateCode(); updatePreview(); };
      ft.appendChild(inp);
    } else if (field.type === 'text') {
      ft.innerHTML = `<div class="editor-label">${field.label}</div>`;
      const inp = document.createElement('input');
      inp.type = 'text'; inp.className = 'editor-input';
      if (field.width) inp.style.width = field.width + 'px';
      if (field.placeholder) inp.placeholder = field.placeholder;
      inp.value = seg[field.key] || '';
      inp.oninput = () => { seg[field.key] = inp.value; updateSegmentInState(seg); renderCanvas(); updateCode(); };
      ft.appendChild(inp);
    }
    grid.appendChild(ft);
  });
}
