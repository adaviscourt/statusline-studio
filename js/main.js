import { state, loadState, loadSettingsState, pushHistory, saveState, canUndo, popHistory } from './state.js';
import { buildPalette, renderCanvas } from './canvas.js';
import { deselectSegment } from './editor.js';
import { updateCode } from './codegen.js';
import { copyPane } from './utils.js';
import { initExportModal } from './export.js';
import { initSettingsModal } from './settings.js';

function undo() {
  if (!canUndo()) return;
  state.rows = popHistory();
  deselectSegment();
  renderCanvas();
  updateCode();
  saveState();
}

// ─── Init ─────────────────────────────────────────
loadSettingsState();
loadState();

document.getElementById('set-powerlineMode').checked = state.globalSettings.powerlineMode;
document.getElementById('set-plSepCustom').value = state.globalSettings.powerlineSeparator || '';
document.getElementById('set-plCapCustom').value = state.globalSettings.powerlineCap || '';

buildPalette();
renderCanvas();
updateCode();
initExportModal();
initSettingsModal();

// ─── Tabs ─────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.code-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`pane-${btn.dataset.tab}`).classList.add('active');
  });
});

// ─── Copy buttons ─────────────────────────────────
document.querySelectorAll('.code-copy-btn').forEach(btn => {
  btn.addEventListener('click', () => copyPane(btn.dataset.tab));
});

// ─── Click away to deselect ───────────────────────
document.getElementById('canvasArea').addEventListener('click', e => {
  if (!e.target.closest('.segment-chip')) deselectSegment();
});

// ─── Keyboard shortcuts ───────────────────────────
document.addEventListener('keydown', e => {
  const tag = document.activeElement?.tagName;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

  if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedSegment) {
    e.preventDefault();
    const { rowIdx, segIdx } = state.selectedSegment;
    if (!state.rows[rowIdx]) return;
    pushHistory();
    state.rows[rowIdx].splice(segIdx, 1);
    deselectSegment();
    renderCanvas();
    updateCode();
    saveState();
    return;
  }

  if (e.key === 'Escape') {
    if (state.selectedSegment) {
      e.preventDefault();
      deselectSegment();
    }
    return;
  }

  if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    undo();
    return;
  }
});
