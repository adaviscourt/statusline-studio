import { state } from './state.js';
import { updateCode } from './codegen.js';

export function initSettingsModal() {
  const PL_SEPS = ['\ue0b0', '\ue0b2', '\ue0b4', '\ue0b6', '│', '▌'];
  const PL_CAPS = ['\ue0b0', '\ue0b2', '\ue0b8', '\ue0ba', ''];

  function makePicker(containerId, inputId, options, settingsKey) {
    const picker = document.getElementById(containerId);
    const customInp = document.getElementById(inputId);
    options.forEach(val => {
      const btn = document.createElement('div');
      btn.className = 'settings-sep-btn' + (state.globalSettings[settingsKey] === val ? ' selected' : '');
      btn.textContent = val || '·';
      btn.title = val || 'none';
      btn.onclick = () => {
        state.globalSettings[settingsKey] = val;
        customInp.value = val;
        picker.querySelectorAll('.settings-sep-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        updateCode();
      };
      picker.appendChild(btn);
    });
    customInp.addEventListener('input', () => {
      state.globalSettings[settingsKey] = customInp.value;
      picker.querySelectorAll('.settings-sep-btn').forEach(b => b.classList.remove('selected'));
      updateCode();
    });
  }

  makePicker('set-plSepPicker', 'set-plSepCustom', PL_SEPS, 'powerlineSeparator');
  makePicker('set-plCapPicker', 'set-plCapCustom', PL_CAPS, 'powerlineCap');

  document.getElementById('set-powerlineMode').addEventListener('change', e => {
    state.globalSettings.powerlineMode = e.target.checked;
    updateCode();
  });

  document.getElementById('openSettingsBtn').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.add('visible');
  });
  document.getElementById('closeSettingsBtn').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.remove('visible');
  });
  document.getElementById('settingsModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.classList.remove('visible');
  });
}
