import { SEGMENT_DEFS, ANSI_COLORS, ANSI_BG_COLORS, cssTextGradient, getSegmentGradientStops, hasEnabledGradient, isEmojiIcon } from './data.js';
import { state, saveState } from './state.js';

// ─── Syntax highlighting ──────────────────────────

export function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// W: skips existing HTML tags (group 1), wraps code match (group 2) in a span
export function W(cls) {
  return (m, tag, match) => tag || `<span class="${cls}">${match}</span>`;
}

export function syntaxBash(code) {
  let s = esc(code);
  s = s.replace(/(<[^>]*>)|(#[^\n]*)/g, W('cmt'));
  s = s.replace(/(<[^>]*>)|\b(if|then|fi|else|elif|for|do|done|while|case|esac|in|function)\b/g, W('kw'));
  s = s.replace(/(<[^>]*>)|\b(echo|printf|export|source|local|return|exit|shift|read|cat|jq|git|bc|wc|tr|cut)\b/g, W('fn'));
  s = s.replace(/(<[^>]*>)|("(?:[^"\\]|\\.)*")/g, W('str'));
  s = s.replace(/(<[^>]*>)|(\$\{?[A-Z_][A-Z0-9_]*\}?)/g, W('var'));
  s = s.replace(/(<[^>]*>)|\b(\d+)\b/g, W('num'));
  return s;
}

export function syntaxPython(code) {
  let s = esc(code);
  s = s.replace(/(<[^>]*>)|(#[^\n]*)/g, W('cmt'));
  s = s.replace(/(<[^>]*>)|\b(import|from|def|class|if|else|elif|for|while|try|except|with|return|in|not|and|or|is|None|True|False)\b/g, W('kw'));
  s = s.replace(/(<[^>]*>)|(f?"(?:[^"\\]|\\.)*")/g, W('str'));
  s = s.replace(/(<[^>]*>)|(f?'(?:[^'\\]|\\.)*')/g, W('str'));
  s = s.replace(/(<[^>]*>)|\b(print|len|int|str|float|list|dict|range|open|json|sys|os|subprocess)\b/g, W('fn'));
  s = s.replace(/(<[^>]*>)|\b(\d+\.?\d*)\b/g, W('num'));
  return s;
}

export function syntaxJS(code) {
  let s = esc(code);
  s = s.replace(/(<[^>]*>)|(\/\/[^\n]*)/g, W('cmt'));
  s = s.replace(/(<[^>]*>)|\b(const|let|var|function|if|else|for|while|return|try|catch|require|of|in|new|null|undefined|true|false)\b/g, W('kw'));
  s = s.replace(/(<[^>]*>)|((?:&lt;)?`[^`]*`)/g, W('str'));
  s = s.replace(/(<[^>]*>)|("(?:[^"\\]|\\.)*")/g, W('str'));
  s = s.replace(/(<[^>]*>)|('(?:[^'\\]|\\.)*')/g, W('str'));
  s = s.replace(/(<[^>]*>)|\b(console|process|Math|JSON|String|require)\b/g, W('fn'));
  s = s.replace(/(<[^>]*>)|\b(\d+\.?\d*)\b/g, W('num'));
  return s;
}

export function syntaxJSON(code) {
  let s = esc(code);
  s = s.replace(/(<[^>]*>)|("(?:[^"\\]|\\.)*")(\s*:)|("(?:[^"\\]|\\.)*")/g, (m, tag, key, colon, val) => {
    if (tag) return tag;
    if (key) return `<span class="kw">${key}</span>${colon}`;
    return `<span class="str">${val}</span>`;
  });
  s = s.replace(/(<[^>]*>)|\b(true|false|null)\b/g, W('fn'));
  s = s.replace(/(<[^>]*>)|\b(\d+\.?\d*)\b/g, W('num'));
  return s;
}

// ─── Preview ──────────────────────────────────────

export function updatePreview() {
  const previewEl = document.getElementById('livePreview');
  const lines = state.rows.map(row => {
    return row.map(seg => {
      if (seg.hide) return '';
      const def = SEGMENT_DEFS.find(d => d.id === seg.id);
      if (!def) return '';
      const val = typeof def.preview === 'function' ? def.preview(seg) : '';
      const icon = (!seg.isSep && seg.icon && seg.icon !== 'none') ? seg.icon + ' ' : '';
      const c = ANSI_COLORS[seg.color] || ANSI_COLORS.default;
      const bg = ANSI_BG_COLORS[seg.bgColor || 'default'];
      const boldStyle = seg.bold ? 'font-weight:700;' : '';
      const gradient = cssTextGradient(getSegmentGradientStops(seg));
      const hasBg = bg && bg.code;
      const usesGradient = hasEnabledGradient(seg);
      const hasPlainEmojiIcon = usesGradient && icon && isEmojiIcon(seg.icon);
      const animatedClass = usesGradient && seg.gradient?.animated ? ' class="gradient-animated-text"' : '';
      if (hasPlainEmojiIcon) {
        const gradientTextStyle = `background-image:${gradient};-webkit-background-clip:text;background-clip:text;color:transparent;`;
        const outerStyle = `${hasBg ? `background-color:${bg.css};` : ''}${boldStyle}`;
        return `<span style="${outerStyle}"><span${animatedClass} style="${gradientTextStyle}">${(seg.prefix||'')}</span><span>${icon}</span><span${animatedClass} style="${gradientTextStyle}">${val}${(seg.suffix||'')}</span></span>`;
      }
      const gradientStyle = usesGradient
        ? (hasBg
          ? `background-image:${gradient},linear-gradient(${bg.css},${bg.css});-webkit-background-clip:text,border-box;background-clip:text,border-box;color:transparent;`
          : `background-image:${gradient};-webkit-background-clip:text;background-clip:text;color:transparent;`)
        : `color:${c.css};`;
      const bgStyle = !usesGradient && hasBg ? `background-color:${bg.css};` : '';
      const colorStyle = `${gradientStyle}${bgStyle}${boldStyle}`;
      return `<span${animatedClass} style="${colorStyle}">${(seg.prefix||'')}${icon}${val}${(seg.suffix||'')}</span>`;
    }).join(' ');
  });

  if (lines.every(l => l === '')) {
    previewEl.innerHTML = '— empty —';
  } else {
    previewEl.innerHTML = lines.join('\n');
  }
}

// ─── Code generation ──────────────────────────────

function hasGeneratedGradient() {
  return state.rows.flat().some(hasEnabledGradient);
}

function pushBashGradientHelper(lines) {
  lines.push(`__slm_gradient() {
  local text="$1"; shift
  local stops=("$@")
  local len=\${#text}
  local count=\${#stops[@]}
  if [ "$len" -eq 0 ]; then return; fi
  if [ "$count" -lt 2 ]; then printf '%s' "$text"; return; fi
  local last=$((count - 1))
  local i pos scaled idx local_pos from to fr fg fb tr tg tb r g b ch
  for ((i=0; i<len; i++)); do
    ch="\${text:i:1}"
    if [ "$len" -gt 1 ]; then pos=$((i * 1000 / (len - 1))); else pos=0; fi
    scaled=$((pos * last))
    idx=$((scaled / 1000))
    [ "$idx" -ge "$last" ] && idx=$((last - 1))
    local_pos=$((scaled - idx * 1000))
    from="\${stops[idx]#\\#}"
    to="\${stops[idx + 1]#\\#}"
    fr=$((16#\${from:0:2})); fg=$((16#\${from:2:2})); fb=$((16#\${from:4:2}))
    tr=$((16#\${to:0:2})); tg=$((16#\${to:2:2})); tb=$((16#\${to:4:2}))
    r=$((fr + (tr - fr) * local_pos / 1000))
    g=$((fg + (tg - fg) * local_pos / 1000))
    b=$((fb + (tb - fb) * local_pos / 1000))
    printf '\\033[38;2;%s;%s;%sm%s' "$r" "$g" "$b" "$ch"
  done
  printf '\\033[0m'
}`);
}

function pushPythonGradientHelper(lines) {
  lines.push(`def _slm_gradient_text(text, stops):
    text = str(text)
    if not text:
        return ""
    if len(stops) < 2:
        return text
    out = []
    last = len(stops) - 1
    span = max(len(text) - 1, 1)
    for i, ch in enumerate(text):
        pos = i / span
        scaled = pos * last
        idx = min(int(scaled), last - 1)
        local = scaled - idx
        a = stops[idx].lstrip("#")
        b = stops[idx + 1].lstrip("#")
        ar, ag, ab = int(a[0:2], 16), int(a[2:4], 16), int(a[4:6], 16)
        br, bg, bb = int(b[0:2], 16), int(b[2:4], 16), int(b[4:6], 16)
        r = round(ar + (br - ar) * local)
        g = round(ag + (bg - ag) * local)
        bl = round(ab + (bb - ab) * local)
        out.append(f"\\033[38;2;{r};{g};{bl}m{ch}")
    return "".join(out) + "\\033[0m"`);
}

function pushNodeGradientHelper(lines) {
  lines.push(`function slmGradientText(text, stops) {
    text = String(text);
    if (!text) return '';
    if (!Array.isArray(stops) || stops.length < 2) return text;
    const chars = Array.from(text);
    const last = stops.length - 1;
    const span = Math.max(chars.length - 1, 1);
    return chars.map((ch, i) => {
        const pos = i / span;
        const scaled = pos * last;
        const idx = Math.min(Math.floor(scaled), last - 1);
        const local = scaled - idx;
        const a = stops[idx].replace('#', '');
        const b = stops[idx + 1].replace('#', '');
        const ar = parseInt(a.slice(0, 2), 16), ag = parseInt(a.slice(2, 4), 16), ab = parseInt(a.slice(4, 6), 16);
        const br = parseInt(b.slice(0, 2), 16), bg = parseInt(b.slice(2, 4), 16), bb = parseInt(b.slice(4, 6), 16);
        const r = Math.round(ar + (br - ar) * local);
        const g = Math.round(ag + (bg - ag) * local);
        const bl = Math.round(ab + (bb - ab) * local);
        return \`\\x1b[38;2;\${r};\${g};\${bl}m\${ch}\`;
    }).join('') + '\\x1b[0m';
}`);
}

export function generateBash() {
  const lines = [];
  lines.push('#!/bin/bash');
  lines.push('input=$(cat)');
  lines.push('');

  lines.push("BLACK=$'\\033[30m'; RED=$'\\033[31m'; GREEN=$'\\033[32m'; YELLOW=$'\\033[33m'");
  lines.push("BLUE=$'\\033[34m'; MAGENTA=$'\\033[35m'; CYAN=$'\\033[36m'; WHITE=$'\\033[37m'");
  lines.push("BR_BLACK=$'\\033[90m'; BR_RED=$'\\033[91m'; BR_GREEN=$'\\033[92m'; BR_YELLOW=$'\\033[93m'");
  lines.push("BR_BLUE=$'\\033[94m'; BR_MAGENTA=$'\\033[95m'; BR_CYAN=$'\\033[96m'; BR_WHITE=$'\\033[97m'");
  lines.push("BOLD=$'\\033[1m'; RESET=$'\\033[0m'");
  lines.push("BG_BLACK=$'\\033[40m'; BG_RED=$'\\033[41m'; BG_GREEN=$'\\033[42m'; BG_YELLOW=$'\\033[43m'");
  lines.push("BG_BLUE=$'\\033[44m'; BG_MAGENTA=$'\\033[45m'; BG_CYAN=$'\\033[46m'; BG_WHITE=$'\\033[47m'");
  lines.push("BG_BR_BLACK=$'\\033[100m'; BG_BR_RED=$'\\033[101m'; BG_BR_GREEN=$'\\033[102m'; BG_BR_YELLOW=$'\\033[103m'");
  lines.push("BG_BR_BLUE=$'\\033[104m'; BG_BR_MAGENTA=$'\\033[105m'; BG_BR_CYAN=$'\\033[106m'; BG_BR_WHITE=$'\\033[107m'");
  lines.push('');
  if (hasGeneratedGradient()) {
    pushBashGradientHelper(lines);
    lines.push('');
  }

  const declared = new Set();
  state.rows.flat().forEach(seg => {
    if (seg.hide) return;
    const def = SEGMENT_DEFS.find(d => d.id === seg.id);
    if (!def) return;
    const varDecl = typeof def.bash === 'function' ? def.bash(seg) : '';
    if (varDecl && !declared.has(seg.id)) {
      lines.push(varDecl);
      declared.add(seg.id);
    }
  });

  lines.push('');

  state.rows.forEach((row, rowIdx) => {
    lines.push('parts=()');
    row.forEach(seg => {
      if (seg.hide) return;
      const def = SEGMENT_DEFS.find(d => d.id === seg.id);
      if (!def) return;
      const out = typeof def.bashOut === 'function' ? def.bashOut(seg) : '';
      if (out) lines.push(out);
    });
    if (state.globalSettings.powerlineMode && state.globalSettings.powerlineSeparator) {
      const sep = state.globalSettings.powerlineSeparator.replace(/'/g, "'\\''");
      lines.push(`_PL_SEP='${sep}'\n_PL_OUT=""\nfor _pi in "\${!parts[@]}"; do [ "$_pi" -gt 0 ] && _PL_OUT+="$_PL_SEP"; _PL_OUT+="\${parts[$_pi]}"; done\necho "$_PL_OUT"`);
    } else {
      lines.push('IFS=" "; echo "${parts[*]}"');
    }
    if (rowIdx < state.rows.length - 1) lines.push('');
  });

  const raw = lines.join('\n');
  state.rawCode.bash = raw;
  document.getElementById('code-bash').innerHTML = syntaxBash(raw);
}

export function generatePython() {
  const lines = [];
  lines.push('#!/usr/bin/env python3');
  lines.push('import json, sys');

  const needsGit = state.rows.flat().some(s => s.id.startsWith('git_'));
  if (needsGit) lines.push('import subprocess, os');

  lines.push('');
  if (hasGeneratedGradient()) {
    pushPythonGradientHelper(lines);
    lines.push('');
  }
  lines.push('data = json.load(sys.stdin)');
  lines.push('');

  const declared = new Set();
  state.rows.flat().forEach(seg => {
    if (seg.hide) return;
    const def = SEGMENT_DEFS.find(d => d.id === seg.id);
    if (!def || declared.has(seg.id)) return;
    const varDecl = typeof def.pyVar === 'string' ? def.pyVar : (typeof def.pyVar === 'function' ? def.pyVar(seg) : '');
    if (varDecl) {
      lines.push(varDecl.replace(/\n    /g, '\n'));
      declared.add(seg.id);
    }
  });

  lines.push('');

  state.rows.forEach((row, rowIdx) => {
    lines.push('parts = []');
    row.forEach(seg => {
      if (seg.hide) return;
      const def = SEGMENT_DEFS.find(d => d.id === seg.id);
      if (!def) return;
      const out = typeof def.pyOut === 'function' ? def.pyOut(seg) : '';
      if (out) lines.push(out);
    });
    if (state.globalSettings.powerlineMode && state.globalSettings.powerlineSeparator) {
      const sep = JSON.stringify(state.globalSettings.powerlineSeparator);
      lines.push(`print(${sep}.join(parts))`);
    } else {
      lines.push('print("".join(parts))');
    }
    if (rowIdx < state.rows.length - 1) lines.push('');
  });

  const raw = lines.join('\n');
  state.rawCode.python = raw;
  document.getElementById('code-python').innerHTML = syntaxPython(raw);
}

export function generateNode() {
  const lines = [];
  lines.push('#!/usr/bin/env node');

  const needsGit = state.rows.flat().some(s => s.id.startsWith('git_'));
  const needsPath = state.rows.flat().some(s => ['workdir','projdir'].includes(s.id));

  if (needsGit || needsPath) {
    if (needsGit) lines.push("const { execSync } = require('child_process');");
    if (needsPath) lines.push("const path = require('path');");
  }

  lines.push('');
  if (hasGeneratedGradient()) {
    pushNodeGradientHelper(lines);
    lines.push('');
  }
  lines.push("let input = '';");
  lines.push("process.stdin.on('data', chunk => input += chunk);");
  lines.push("process.stdin.on('end', () => {");
  lines.push("    const data = JSON.parse(input);");
  lines.push('');

  const declared = new Set();
  state.rows.flat().forEach(seg => {
    if (seg.hide) return;
    const def = SEGMENT_DEFS.find(d => d.id === seg.id);
    if (!def || declared.has(seg.id)) return;
    const varDecl = typeof def.nodeVar === 'string' ? def.nodeVar : (typeof def.nodeVar === 'function' ? def.nodeVar(seg) : '');
    if (varDecl) {
      varDecl.split('\n').forEach(l => { if (l.trim()) lines.push('    ' + l); });
      declared.add(seg.id);
    }
  });

  lines.push('');

  state.rows.forEach((row, rowIdx) => {
    lines.push('    const parts = [];');
    row.forEach(seg => {
      if (seg.hide) return;
      const def = SEGMENT_DEFS.find(d => d.id === seg.id);
      if (!def) return;
      const out = typeof def.nodeOut === 'function' ? def.nodeOut(seg) : '';
      if (out) out.split('\n').forEach(l => lines.push('    ' + l));
    });
    if (state.globalSettings.powerlineMode && state.globalSettings.powerlineSeparator) {
      const sep = JSON.stringify(state.globalSettings.powerlineSeparator);
      lines.push(`    console.log(parts.join(${sep}));`);
    } else {
      lines.push("    console.log(parts.join(''));");
    }
    if (rowIdx < state.rows.length - 1) lines.push('');
  });

  lines.push('});');

  const raw = lines.join('\n');
  state.rawCode.node = raw;
  document.getElementById('code-node').innerHTML = syntaxJS(raw);
}

export function generateSettings() {
  const obj = { statusLine: { type: 'command', command: '~/.claude/statusline.sh' } };
  if (state.globalSettings.powerlineMode) {
    obj.statusLine.powerline = { enabled: true };
    if (state.globalSettings.powerlineSeparator) obj.statusLine.powerline.separator = state.globalSettings.powerlineSeparator;
    if (state.globalSettings.powerlineCap) obj.statusLine.powerline.cap = state.globalSettings.powerlineCap;
  }
  const json = JSON.stringify(obj, null, 2);
  state.rawCode.settings = json;
  document.getElementById('code-settings').innerHTML = syntaxJSON(json);
}

export function updateCode() {
  updatePreview();
  generateBash();
  generatePython();
  generateNode();
  generateSettings();
  saveState();
}
