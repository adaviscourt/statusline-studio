import { SEGMENT_DEFS } from './data.js';

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function DEFAULT_ROWS() {
  return [
    [
      { ...SEGMENT_DEFS.find(d=>d.id==='model'),      uid: uid(), icon: '◆', color: 'blue',    prefix: '', suffix: '' },
      { ...SEGMENT_DEFS.find(d=>d.id==='separator'),  uid: uid(), icon: '│', color: 'default', sepText: ' │ ' },
      { ...SEGMENT_DEFS.find(d=>d.id==='ctx_bar'),    uid: uid(), icon: '▓', color: 'green',   barWidth: 10 },
      { ...SEGMENT_DEFS.find(d=>d.id==='separator'),  uid: uid(), icon: '│', color: 'default', sepText: ' │ ' },
      { ...SEGMENT_DEFS.find(d=>d.id==='git_branch'), uid: uid(), icon: '⎇', color: 'cyan' },
      { ...SEGMENT_DEFS.find(d=>d.id==='git_status'), uid: uid(), icon: '◈', color: 'yellow' },
      { ...SEGMENT_DEFS.find(d=>d.id==='separator'),  uid: uid(), icon: '│', color: 'default', sepText: ' │ ' },
      { ...SEGMENT_DEFS.find(d=>d.id==='cost'),       uid: uid(), icon: '$', color: 'yellow' },
      { ...SEGMENT_DEFS.find(d=>d.id==='duration'),   uid: uid(), icon: '⏱', color: 'magenta' },
    ],
    [
      { ...SEGMENT_DEFS.find(d=>d.id==='workdir'),     uid: uid(), icon: '⬚', color: 'default' },
      { ...SEGMENT_DEFS.find(d=>d.id==='separator'),   uid: uid(), icon: '│', color: 'default', sepText: ' │ ' },
      { ...SEGMENT_DEFS.find(d=>d.id==='tokens_total'),uid: uid(), icon: '◉', color: 'magenta' },
      { ...SEGMENT_DEFS.find(d=>d.id==='separator'),   uid: uid(), icon: '│', color: 'default', sepText: ' │ ' },
      { ...SEGMENT_DEFS.find(d=>d.id==='ctx_pct'),     uid: uid(), icon: '%', color: 'green' },
    ],
  ];
}

export const state = {
  rows: null,
  selectedSegment: null,
  selectedUid: null,
  globalSettings: {
    powerlineMode: false,
    powerlineSeparator: '',
    powerlineCap: '',
  },
  rawCode: { bash: '', python: '', node: '', settings: '' },
};
state.rows = DEFAULT_ROWS();

const _history = [];
const MAX_HISTORY = 20;

export function pushHistory() {
  _history.push(JSON.parse(JSON.stringify(state.rows)));
  if (_history.length > MAX_HISTORY) _history.shift();
}

export function canUndo() { return _history.length > 0; }
export function popHistory() { return _history.pop(); }

export function saveState() {
  try {
    localStorage.setItem('slm_rows', JSON.stringify(state.rows));
    localStorage.setItem('slm_settings', JSON.stringify(state.globalSettings));
  } catch {}
}

export function loadState() {
  try {
    const savedRows = localStorage.getItem('slm_rows');
    if (savedRows) {
      const parsed = JSON.parse(savedRows);
      if (Array.isArray(parsed) && parsed.every(r => Array.isArray(r))) {
        state.rows = parsed.map(row => row.filter(seg => SEGMENT_DEFS.find(d => d.id === seg.id)));
        return true;
      }
    }
  } catch {}
  state.rows = DEFAULT_ROWS();
  return false;
}

export function loadSettingsState() {
  try {
    const saved = localStorage.getItem('slm_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state.globalSettings, parsed);
    }
  } catch {}
}
