import { state } from './state.js';

export function copyPane(tab) {
  navigator.clipboard.writeText(state.rawCode[tab] || '').then(() => showToast('Copied to clipboard'));
}

export function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}
