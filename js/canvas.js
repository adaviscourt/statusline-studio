import { SEGMENT_DEFS, SEGMENT_GROUPS } from './data.js';
import { state, uid, pushHistory, saveState } from './state.js';
import { updateCode } from './codegen.js';
import { selectSegment, deselectSegment, renderEditor } from './editor.js';

export function buildPalette() {
  const container = document.getElementById('palette');
  container.innerHTML = '';

  const groupEl = document.createElement('div');
  SEGMENT_GROUPS.forEach(g => {
    const title = document.createElement('div');
    title.className = 'palette-section-title';
    title.textContent = g;
    groupEl.appendChild(title);

    if (g === 'Rate Limits') {
      const note = document.createElement('div');
      note.className = 'palette-note';
      note.textContent = 'Non-API plan only';
      groupEl.appendChild(note);
    }

    SEGMENT_DEFS.filter(d => d.group === g).forEach(def => {
      const item = document.createElement('div');
      item.className = 'palette-item';
      item.dataset.defId = def.id;
      item.draggable = true;
      item.innerHTML = `<span class="palette-icon">${def.icon}</span><span class="palette-label">${def.label}</span>`;
      item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', def.id);
        e.dataTransfer.effectAllowed = 'copy';
      });
      item.addEventListener('dblclick', () => addSegment(def.id));
      groupEl.appendChild(item);
    });
  });
  container.appendChild(groupEl);
}

export function renderCanvas() {
  const area = document.getElementById('canvasArea');
  area.innerHTML = '';

  state.rows.forEach((row, rowIdx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'canvas-row-wrapper';

    const rowNum = document.createElement('div');
    rowNum.className = 'row-num';
    rowNum.textContent = rowIdx + 1;

    const rowEl = document.createElement('div');
    rowEl.className = 'canvas-row' + (row.length === 0 ? ' empty' : '');
    rowEl.dataset.rowIdx = rowIdx;

    row.forEach((seg, segIdx) => {
      const chip = createChip(seg, rowIdx, segIdx);
      rowEl.appendChild(chip);
    });

    rowEl.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      rowEl.classList.add('drag-over');
    });
    rowEl.addEventListener('dragleave', () => rowEl.classList.remove('drag-over'));
    rowEl.addEventListener('drop', e => {
      e.preventDefault();
      rowEl.classList.remove('drag-over');
      const defId = e.dataTransfer.getData('text/plain');
      if (defId) addSegmentToRow(defId, rowIdx);
    });

    wrapper.appendChild(rowNum);
    wrapper.appendChild(rowEl);

    if (state.rows.length > 1) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-row-btn';
      removeBtn.innerHTML = '×';
      removeBtn.title = 'Remove row';
      removeBtn.onclick = () => {
        pushHistory();
        state.rows.splice(rowIdx, 1);
        if (state.selectedSegment && state.selectedSegment.rowIdx === rowIdx) deselectSegment();
        renderCanvas();
        updateCode();
        saveState();
      };
      wrapper.appendChild(removeBtn);
    }

    area.appendChild(wrapper);

    Sortable.create(rowEl, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      group: { name: 'segments', pull: true, put: true },
      filter: '.chip-delete',
      onEnd: e => {
        const fromRow = parseInt(e.from.dataset.rowIdx);
        const toRow = parseInt(e.to.dataset.rowIdx);
        if (isNaN(fromRow) || isNaN(toRow)) return;
        pushHistory();
        const seg = state.rows[fromRow].splice(e.oldIndex, 1)[0];
        state.rows[toRow].splice(e.newIndex, 0, seg);
        renderCanvas();
        updateCode();
        saveState();
      },
    });
  });

  const addBtn = document.createElement('button');
  addBtn.className = 'add-row-btn';
  addBtn.innerHTML = '+ add row';
  addBtn.onclick = () => {
    pushHistory();
    state.rows.push([]);
    renderCanvas();
    updateCode();
    saveState();
  };
  area.appendChild(addBtn);

  if (state.selectedUid) {
    document.querySelectorAll('.segment-chip').forEach(el => {
      if (el.dataset.uid === state.selectedUid) el.classList.add('selected');
    });
  }
}

export function createChip(seg, rowIdx, segIdx) {
  const chip = document.createElement('div');
  chip.className = 'segment-chip';
  if (seg.isSep) chip.classList.add('chip-sep');
  if (seg.color && seg.color !== 'default') chip.classList.add(`chip-color-${seg.color.replace('br-','')}`);
  if (seg.hide) chip.style.opacity = '0.4';
  chip.dataset.uid = seg.uid;
  chip.dataset.rowIdx = rowIdx;
  chip.dataset.segIdx = segIdx;

  let chipIcon = '';
  let label;
  if (seg.isSep) {
    label = seg.sepText || '│';
  } else if (seg.isCustom) {
    label = seg.customText || 'text';
    chipIcon = seg.icon && seg.icon !== 'none' ? `<span class="chip-icon">${seg.icon}</span>` : '';
  } else {
    chipIcon = seg.icon && seg.icon !== 'none' ? `<span class="chip-icon">${seg.icon}</span>` : '';
    label = seg.label || '';
  }

  chip.innerHTML = `${chipIcon}<span class="chip-label">${label}</span><button class="chip-delete" title="Remove">×</button>`;

  chip.addEventListener('click', e => {
    if (e.target.classList.contains('chip-delete')) return;
    selectSegment(rowIdx, segIdx, seg.uid);
  });

  chip.querySelector('.chip-delete').addEventListener('click', e => {
    e.stopPropagation();
    pushHistory();
    state.rows[rowIdx].splice(segIdx, 1);
    if (state.selectedUid === seg.uid) deselectSegment();
    renderCanvas();
    updateCode();
    saveState();
  });

  return chip;
}

export function makeSegDefaults(def) {
  return {
    ...def,
    uid: uid(),
    color: def.color || 'default',
    bgColor: 'default',
    bold: false,
    hide: false,
    maxWidth: 0,
    barWidth: 10,
    prefix: '',
    suffix: '',
    sepText: def.id === 'separator' ? '│' : undefined,
    customText: def.id === 'custom' ? 'text' : undefined,
    shaLength: 'short',
    skillsMode: 'last',
    commandStr: '',
    urlHref: '',
    urlText: 'link',
    showVersion: false,
    showReset: false,
  };
}

export function addSegment(defId, rowIdx = 0) {
  const def = SEGMENT_DEFS.find(d => d.id === defId);
  if (!def) return;
  if (state.rows.length === 0) state.rows.push([]);
  pushHistory();
  const seg = makeSegDefaults(def);
  state.rows[rowIdx].push(seg);
  renderCanvas();
  updateCode();
  saveState();
  selectSegment(rowIdx, state.rows[rowIdx].length - 1, seg.uid);
}

export function addSegmentToRow(defId, rowIdx) {
  const def = SEGMENT_DEFS.find(d => d.id === defId);
  if (!def) return;
  pushHistory();
  const seg = makeSegDefaults(def);
  state.rows[rowIdx].push(seg);
  renderCanvas();
  updateCode();
  saveState();
}
