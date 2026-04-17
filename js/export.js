import { state } from './state.js';
import { showToast } from './utils.js';

export function initExportModal() {
  const DEFAULT_PATHS = { bash: '~/.claude/statusline.sh', python: '~/.claude/statusline.py', node: '~/.claude/statusline.js' };
  const EXTS = { bash: 'sh', python: 'py', node: 'js' };
  let exportLang = 'bash';

  function getExportPath() {
    return document.getElementById('export-path').value.trim() || DEFAULT_PATHS[exportLang];
  }

  function refreshDialog() {
    const pathInp = document.getElementById('export-path');
    if (!pathInp.value || Object.values(DEFAULT_PATHS).includes(pathInp.value)) {
      pathInp.value = state.globalSettings.scriptPath && Object.values(DEFAULT_PATHS).includes(state.globalSettings.scriptPath)
        ? DEFAULT_PATHS[exportLang]
        : (state.globalSettings.scriptPath || DEFAULT_PATHS[exportLang]);
    }
    document.getElementById('export-path-display').textContent = getExportPath();
    document.getElementById('export-settings-preview').textContent = state.rawCode.settings || '';
  }

  function openExportModal() {
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
    if (activeTab && activeTab !== 'settings') {
      exportLang = activeTab;
      document.querySelectorAll('.export-lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === exportLang);
      });
    }
    const pathInp = document.getElementById('export-path');
    pathInp.value = DEFAULT_PATHS[exportLang];
    refreshDialog();
    document.getElementById('exportModal').classList.add('visible');
  }

  document.getElementById('openExportBtn').addEventListener('click', openExportModal);
  document.getElementById('closeExportBtn').addEventListener('click', () => {
    document.getElementById('exportModal').classList.remove('visible');
  });
  document.getElementById('exportModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.classList.remove('visible');
  });

  document.querySelectorAll('.export-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      exportLang = btn.dataset.lang;
      document.querySelectorAll('.export-lang-btn').forEach(b => b.classList.toggle('active', b === btn));
      const pathInp = document.getElementById('export-path');
      if (!pathInp.value || Object.values(DEFAULT_PATHS).includes(pathInp.value)) {
        pathInp.value = DEFAULT_PATHS[exportLang];
      }
      refreshDialog();
    });
  });

  document.getElementById('export-path').addEventListener('input', () => {
    document.getElementById('export-path-display').textContent = getExportPath();
  });

  document.getElementById('export-save-btn').addEventListener('click', () => {
    const code = state.rawCode[exportLang] || '';
    const ext = EXTS[exportLang] || 'sh';
    const blob = new Blob([code], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `statusline.${ext}`;
    a.click();
    showToast(`Downloaded statusline.${ext}`);
  });

  document.getElementById('export-copy-settings-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(state.rawCode.settings || '').then(() => showToast('settings.json snippet copied'));
  });

  document.getElementById('export-install-btn').addEventListener('click', () => {
    const scriptCode = state.rawCode[exportLang] || '';
    const settingsCode = state.rawCode.settings || '{}';
    const scriptPath = getExportPath().replace(/^~/, '$HOME');
    const settingsObj = JSON.parse(settingsCode);

    const scriptB64   = btoa(unescape(encodeURIComponent(scriptCode)));
    const settingsB64 = btoa(unescape(encodeURIComponent(JSON.stringify(settingsObj))));

    const installer =
`#!/usr/bin/env bash
set -e
SCRIPT_PATH="${scriptPath}"
mkdir -p "$(dirname "$SCRIPT_PATH")"
echo '${scriptB64}' | base64 -d > "$SCRIPT_PATH"
chmod +x "$SCRIPT_PATH"
node - <<'NODEEOF'
const fs=require('fs'),os=require('os'),p=require('path').join(os.homedir(),'.claude/settings.json');
const e=fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):{};
Object.assign(e,JSON.parse(Buffer.from('${settingsB64}','base64').toString()));
fs.writeFileSync(p,JSON.stringify(e,null,2));
console.log('settings.json updated');
NODEEOF
echo "Installed to $SCRIPT_PATH"
`;

    const installerB64 = btoa(unescape(encodeURIComponent(installer)));
    const cmd = `bash <(echo '${installerB64}' | base64 -d)`;
    navigator.clipboard.writeText(cmd).then(() => showToast('Install command copied'));
  });
}
