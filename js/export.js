import { state } from './state.js';
import { showToast } from './utils.js';

export function initExportModal() {
  const DEFAULT_PATHS = { bash: '~/.claude/statusline.sh', python: '~/.claude/statusline.py', node: '~/.claude/statusline.js' };
  const EXTS = { bash: 'sh', python: 'py', node: 'js' };
  let exportLang = 'bash';

  function getExportPath() {
    return document.getElementById('export-path').value.trim() || DEFAULT_PATHS[exportLang];
  }

  function shellQuote(value) {
    return `'${value.replace(/'/g, `'\\''`)}'`;
  }

  function uniqueDelimiter(base, content) {
    let delimiter = base;
    let i = 2;
    while (content.includes(delimiter)) {
      delimiter = `${base}_${i}`;
      i += 1;
    }
    return delimiter;
  }

  function shellPathExpression(path) {
    if (path.startsWith('~')) return `"$HOME"${shellQuote(path.slice(1))}`;
    return shellQuote(path);
  }

  function buildInstaller() {
    const scriptCode = state.rawCode[exportLang] || '';
    const settingsCode = state.rawCode.settings || '{}';
    const scriptPath = getExportPath();
    const settingsObj = JSON.parse(settingsCode);
    const scriptDelimiter = uniqueDelimiter('STATUSLINE_SCRIPT_EOF', scriptCode);
    const nodeDelimiter = uniqueDelimiter('NODEEOF', JSON.stringify(settingsObj));

    return `#!/usr/bin/env bash
set -e
SCRIPT_PATH=${shellPathExpression(scriptPath)}
mkdir -p "$(dirname "$SCRIPT_PATH")"
cat > "$SCRIPT_PATH" <<'${scriptDelimiter}'
${scriptCode}
${scriptDelimiter}
chmod +x "$SCRIPT_PATH"
node - <<'${nodeDelimiter}'
const fs=require('fs'),os=require('os'),p=require('path').join(os.homedir(),'.claude/settings.json');
const e=fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):{};
Object.assign(e,${JSON.stringify(settingsObj, null, 2)});
fs.writeFileSync(p,JSON.stringify(e,null,2));
console.log('settings.json updated');
${nodeDelimiter}
echo "Installed to $SCRIPT_PATH"
`;
  }

  function refreshDialog() {
    const pathInp = document.getElementById('export-path');
    if (!pathInp.value || Object.values(DEFAULT_PATHS).includes(pathInp.value)) {
      pathInp.value = DEFAULT_PATHS[exportLang];
    }
    document.getElementById('export-path-display').textContent = getExportPath();
    document.getElementById('export-settings-preview').textContent = state.rawCode.settings || '';
    document.getElementById('export-installer-preview').textContent = buildInstaller();
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
    document.getElementById('export-installer-preview').textContent = buildInstaller();
  });

  document.getElementById('export-save-btn').addEventListener('click', () => {
    const code = state.rawCode[exportLang] || '';
    const ext = EXTS[exportLang] || 'sh';
    const filename = `statusline.${ext}`;
    const blob = new Blob([code], { type: 'text/plain' });

    if ('showSaveFilePicker' in window) {
      window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Statusline script',
          accept: { 'text/plain': [`.${ext}`] }
        }]
      }).then(async handle => {
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        showToast(`Saved ${filename}`);
      }).catch(err => {
        if (err.name !== 'AbortError') showToast('Could not save script');
      });
      return;
    }

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast(`Downloaded ${filename}`);
  });

  document.getElementById('export-copy-settings-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(state.rawCode.settings || '').then(() => showToast('settings.json snippet copied'));
  });

  document.getElementById('export-install-btn').addEventListener('click', () => {
    const installer = buildInstaller();
    const installerB64 = btoa(unescape(encodeURIComponent(installer)));
    const cmd = `bash <(echo '${installerB64}' | base64 -d)`;
    navigator.clipboard.writeText(cmd).then(() => showToast('Quick install command copied'));
  });
}
