export const ANSI_BG_COLORS = {
  default:      { code: null,  css: 'transparent' },
  black:        { code: '40',  css: '#2d3444' },
  red:          { code: '41',  css: '#5a2020' },
  green:        { code: '42',  css: '#1a4a35' },
  yellow:       { code: '43',  css: '#4a3a10' },
  blue:         { code: '44',  css: '#1a2e5a' },
  magenta:      { code: '45',  css: '#3a1a5a' },
  cyan:         { code: '46',  css: '#1a3a3a' },
  white:        { code: '47',  css: '#8090a8' },
  'br-black':   { code: '100', css: '#4a5268' },
  'br-red':     { code: '101', css: '#7a3535' },
  'br-green':   { code: '102', css: '#2a5a45' },
  'br-yellow':  { code: '103', css: '#5a4a20' },
  'br-blue':    { code: '104', css: '#2a3e7a' },
  'br-magenta': { code: '105', css: '#4a2a7a' },
  'br-cyan':    { code: '106', css: '#2a4a4a' },
  'br-white':   { code: '107', css: '#c0c8d8' },
};

export const BASH_BG_VAR = {
  default:'', black:"${BG_BLACK}", red:"${BG_RED}", green:"${BG_GREEN}",
  yellow:"${BG_YELLOW}", blue:"${BG_BLUE}", magenta:"${BG_MAGENTA}", cyan:"${BG_CYAN}", white:"${BG_WHITE}",
  'br-black':"${BG_BR_BLACK}",'br-red':"${BG_BR_RED}",'br-green':"${BG_BR_GREEN}",
  'br-yellow':"${BG_BR_YELLOW}",'br-blue':"${BG_BR_BLUE}",'br-magenta':"${BG_BR_MAGENTA}",
  'br-cyan':"${BG_BR_CYAN}",'br-white':"${BG_BR_WHITE}",
};

export const ANSI_COLORS = {
  default:     { code: null,   css: '#7a8499' },
  black:       { code: '30',   css: '#2d3444' },
  red:         { code: '31',   css: '#f06a6a' },
  green:       { code: '32',   css: '#3ecf8e' },
  yellow:      { code: '33',   css: '#f0b429' },
  blue:        { code: '34',   css: '#5b8af5' },
  magenta:     { code: '35',   css: '#c67af7' },
  cyan:        { code: '36',   css: '#56cfcf' },
  white:       { code: '37',   css: '#c8d0e0' },
  'br-black':  { code: '90',   css: '#4a5268' },
  'br-red':    { code: '91',   css: '#ff8585' },
  'br-green':  { code: '92',   css: '#5deeaa' },
  'br-yellow': { code: '93',   css: '#ffd166' },
  'br-blue':   { code: '94',   css: '#7da8ff' },
  'br-magenta':{ code: '95',   css: '#da9aff' },
  'br-cyan':   { code: '96',   css: '#7de8e8' },
  'br-white':  { code: '97',   css: '#eef1f7' },
  bold:        { code: '1',    css: '#eef1f7' },
};

// bash uses pre-declared shell vars like ${BLUE}, ${RESET}
export const BASH_COLOR_VAR = {
  default: '', black: '${BLACK}', red: '${RED}', green: '${GREEN}',
  yellow: '${YELLOW}', blue: '${BLUE}', magenta: '${MAGENTA}',
  cyan: '${CYAN}', white: '${WHITE}', 'br-black': '${BR_BLACK}',
  'br-red': '${BR_RED}', 'br-green': '${BR_GREEN}', 'br-yellow': '${BR_YELLOW}',
  'br-blue': '${BR_BLUE}', 'br-magenta': '${BR_MAGENTA}', 'br-cyan': '${BR_CYAN}',
  'br-white': '${BR_WHITE}', bold: '${BOLD}',
};

// ─── Color helpers ────────────────────────────────
export function pyAnsiBg(color) {
  const c = ANSI_BG_COLORS[color] || ANSI_BG_COLORS.default;
  return c.code ? `\\033[${c.code}m` : '';
}
export function nodeAnsiBg(color) {
  const c = ANSI_BG_COLORS[color] || ANSI_BG_COLORS.default;
  return c.code ? `\\x1b[${c.code}m` : '';
}
export function bashColorOpen(color) { return BASH_COLOR_VAR[color] || ''; }
export function bashColorClose(color) { return (BASH_COLOR_VAR[color]) ? '${RESET}' : ''; }
export function ansiCode(color) {
  const c = ANSI_COLORS[color] || ANSI_COLORS.default;
  if (!c.code) return { open: '', close: '' };
  return { open: `\\033[${c.code}m`, close: `\\033[0m` };
}
export function pyAnsi(color) {
  const c = ANSI_COLORS[color] || ANSI_COLORS.default;
  if (!c.code) return { o: '', c: '' };
  return { o: `\\033[${c.code}m`, c: `\\033[0m` };
}
export function nodeAnsi(color) {
  const c = ANSI_COLORS[color] || ANSI_COLORS.default;
  if (!c.code) return { o: '', c: '' };
  return { o: `\\x1b[${c.code}m`, c: `\\x1b[0m` };
}

// ─── Segment output renderers ─────────────────────
export function renderBashOut(s, varExpr) {
  if (s.hide) return '';
  const fg    = bashColorOpen(s.color);
  const bg    = BASH_BG_VAR[s.bgColor || 'default'] || '';
  const boldO = s.bold ? '${BOLD}' : '';
  const close = (fg || bg || boldO) ? '${RESET}' : '';
  const icon  = (s.icon && s.icon !== 'none') ? s.icon + ' ' : '';
  const pre   = s.prefix  || '';
  const suf   = s.suffix  || '';
  const rawVar = varExpr.replace(/^"|"$/g, '');
  const mw = (s.maxWidth > 0) ? s.maxWidth : 0;
  if (mw > 0) {
    return `{ __v="${pre}${icon}${rawVar}${suf}"; parts+=("${bg}${boldO}${fg}\${__v:0:${mw}}${close}"); }`;
  }
  return `parts+=("${pre}${icon}${bg}${boldO}${fg}${rawVar}${close}${suf}")`;
}

export function renderPyOut(s, varExpr) {
  if (s.hide) return '';
  const c    = pyAnsi(s.color);
  const bg   = pyAnsiBg(s.bgColor || 'default');
  const bold = s.bold ? '\\033[1m' : '';
  const reset = (c.o || bg || bold) ? '\\033[0m' : '';
  const pre  = s.prefix || '';
  const icon = s.icon && s.icon !== 'none' ? s.icon + ' ' : '';
  const suf  = s.suffix || '';
  const mw   = (s.maxWidth > 0) ? s.maxWidth : 0;
  const inner = mw > 0 ? `(str(${varExpr}))[:${mw}]` : varExpr;
  return `parts.append(f"${pre}${icon}${bg}${bold}${c.o}{${inner}}${reset}${suf}")`;
}

export function renderNodeOut(s, varExpr) {
  if (s.hide) return '';
  const c    = nodeAnsi(s.color);
  const bg   = nodeAnsiBg(s.bgColor || 'default');
  const bold = s.bold ? '\\x1b[1m' : '';
  const reset = (c.o || bg || bold) ? '\\x1b[0m' : '';
  const pre  = s.prefix || '';
  const icon = s.icon && s.icon !== 'none' ? s.icon + ' ' : '';
  const suf  = s.suffix || '';
  const mw   = (s.maxWidth > 0) ? s.maxWidth : 0;
  if (mw > 0) {
    return `parts.push(\`${pre}${icon}${bg}${bold}${c.o}\${String(${varExpr}).slice(0,${mw})}${reset}${suf}\`);`;
  }
  return `parts.push(\`${pre}${icon}${bg}${bold}${c.o}\${${varExpr}}${reset}${suf}\`);`;
}

// ─── Gradient output renderers (runtime color var) ─
// Used by context widgets when `gradient` is enabled. The color var is chosen
// at statusline-runtime based on percentage, so the static seg.color is ignored.
export function gradientBashOut(s, varExpr, colorVar) {
  if (s.hide) return '';
  const bg    = BASH_BG_VAR[s.bgColor || 'default'] || '';
  const boldO = s.bold ? '${BOLD}' : '';
  const icon  = (s.icon && s.icon !== 'none') ? s.icon + ' ' : '';
  const pre   = s.prefix || '';
  const suf   = s.suffix || '';
  const rawVar = varExpr.replace(/^"|"$/g, '');
  const mw = (s.maxWidth > 0) ? s.maxWidth : 0;
  if (mw > 0) {
    return `{ __v="${pre}${icon}${rawVar}${suf}"; parts+=("${bg}${boldO}${colorVar}\${__v:0:${mw}}\${RESET}"); }`;
  }
  return `parts+=("${pre}${icon}${bg}${boldO}${colorVar}${rawVar}\${RESET}${suf}")`;
}

export function gradientPyOut(s, varExpr, colorVar) {
  if (s.hide) return '';
  const bg   = pyAnsiBg(s.bgColor || 'default');
  const bold = s.bold ? '\\033[1m' : '';
  const pre  = s.prefix || '';
  const icon = s.icon && s.icon !== 'none' ? s.icon + ' ' : '';
  const suf  = s.suffix || '';
  const mw   = (s.maxWidth > 0) ? s.maxWidth : 0;
  const inner = mw > 0 ? `(str(${varExpr}))[:${mw}]` : varExpr;
  return `parts.append(f"${pre}${icon}${bg}${bold}{${colorVar}}{${inner}}\\033[0m${suf}")`;
}

export function gradientNodeOut(s, varExpr, colorVar) {
  if (s.hide) return '';
  const bg   = nodeAnsiBg(s.bgColor || 'default');
  const bold = s.bold ? '\\x1b[1m' : '';
  const pre  = s.prefix || '';
  const icon = s.icon && s.icon !== 'none' ? s.icon + ' ' : '';
  const suf  = s.suffix || '';
  const mw   = (s.maxWidth > 0) ? s.maxWidth : 0;
  if (mw > 0) {
    return `parts.push(\`${pre}${icon}${bg}${bold}\${${colorVar}}\${String(${varExpr}).slice(0,${mw})}\\x1b[0m${suf}\`);`;
  }
  return `parts.push(\`${pre}${icon}${bg}${bold}\${${colorVar}}\${${varExpr}}\\x1b[0m${suf}\`);`;
}

// ─── Segment definitions ──────────────────────────
export const SEGMENT_DEFS = [
  { id: 'model',      label: 'Model Name',     icon: '◆', group: 'Model & Session',  color: 'blue',
    editorFields: [{ type:'toggle', key:'showVersion', label:'Show version (e.g. 4.6)' }],
    preview: s => s.showVersion ? 'Sonnet 4.6' : 'Sonnet',
    bash: s => s.showVersion
      ? `MODEL=$(echo "$input" | jq -r '.model.display_name' | sed 's/^[Cc]laude //')`
      : `MODEL=$(echo "$input" | jq -r '.model.display_name' | sed 's/^[Cc]laude //; s/ [0-9].*//')`,
    pyVar: s => s.showVersion
      ? `import re\nmodel = re.sub(r'^[Cc]laude\\s+', '', data["model"]["display_name"])`
      : `import re\nmodel = re.sub(r'\\s+\\d.*', '', re.sub(r'^[Cc]laude\\s+', '', data["model"]["display_name"]))`,
    nodeVar: s => s.showVersion
      ? `const model = data.model.display_name.replace(/^[Cc]laude\\s+/, '');`
      : `const model = data.model.display_name.replace(/^[Cc]laude\\s+/, '').replace(/\\s+\\d.*/, '');`,
    bashOut: s => renderBashOut(s, '$MODEL'),
    pyOut: s => renderPyOut(s, 'model'),
    nodeOut: s => renderNodeOut(s, 'model'),
  },
  { id: 'session',    label: 'Session Name',   icon: '⬡', group: 'Model & Session',  color: 'cyan',
    preview: () => 'my-session',
    bash: s => `SESSION=$(echo "$input" | jq -r '.session_name // empty')`,
    pyVar: 'session = data.get("session_name", "")',
    nodeVar: `const session = data.session_name || '';`,
    bashOut: s => `[ -n "$SESSION" ] && ${renderBashOut(s, '$SESSION')}`,
    pyOut: s => `if session:\n    ${renderPyOut(s, 'session')}`,
    nodeOut: s => `if (session) { ${renderNodeOut(s, 'session')} }`,
  },
  { id: 'version',    label: 'Version',        icon: '◌', group: 'Model & Session',  color: 'default',
    preview: () => 'v2.1.90',
    bash: s => `VERSION=$(echo "$input" | jq -r '.version')`,
    pyVar: 'version = data.get("version", "")',
    nodeVar: `const version = data.version || '';`,
    bashOut: s => renderBashOut(s, '"v$VERSION"'),
    pyOut: s => renderPyOut(s, '"v" + version'),
    nodeOut: s => renderNodeOut(s, '`v${version}`'),
  },
  { id: 'vimmode',    label: 'Vim Mode',       icon: '⬧', group: 'Model & Session',  color: 'yellow',
    preview: () => 'NORMAL',
    bash: s => `VIM_MODE=$(echo "$input" | jq -r '.vim.mode // empty')`,
    pyVar: 'vim_mode = (data.get("vim") or {}).get("mode", "")',
    nodeVar: `const vimMode = data.vim?.mode || '';`,
    bashOut: s => `[ -n "$VIM_MODE" ] && ${renderBashOut(s, '$VIM_MODE')}`,
    pyOut: s => `if vim_mode:\n    ${renderPyOut(s, 'vim_mode')}`,
    nodeOut: s => `if (vimMode) { ${renderNodeOut(s, 'vimMode')} }`,
  },
  { id: 'ctx_bar',    label: 'Context Bar',    icon: '▓', group: 'Context',          color: 'green',
    preview: () => '▓▓░░░░░░░░ 8%',
    bash: s => {
      const base = `PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)\nBAR_WIDTH=${s.barWidth||10}\nFILLED=$((PCT * BAR_WIDTH / 100))\nEMPTY=$((BAR_WIDTH - FILLED))\nBAR=""\n[ "$FILLED" -gt 0 ] && printf -v FILL "%\${FILLED}s" && BAR="\${FILL// /▓}"\n[ "$EMPTY" -gt 0 ] && printf -v PAD "%\${EMPTY}s" && BAR="\${BAR}\${PAD// /░}"`;
      if (!s.gradient) return base;
      return `${base}\nCTX_BAR_COLOR=$GREEN\n[ "$PCT" -ge 50 ] && CTX_BAR_COLOR=$YELLOW\n[ "$PCT" -ge 80 ] && CTX_BAR_COLOR=$RED`;
    },
    pyVar: s => {
      const base = `pct = int(data.get("context_window", {}).get("used_percentage", 0) or 0)\n    bar_w = ${s.barWidth||10}\n    filled = pct * bar_w // 100\n    ctx_bar = "▓" * filled + "░" * (bar_w - filled)`;
      if (!s.gradient) return base;
      return `${base}\n    ctx_bar_color = "\\033[32m" if pct < 50 else ("\\033[33m" if pct < 80 else "\\033[31m")`;
    },
    nodeVar: s => {
      const base = `const pct = Math.floor(data.context_window?.used_percentage || 0);\n    const barW = ${s.barWidth||10};\n    const filled = Math.floor(pct * barW / 100);\n    const ctxBar = "▓".repeat(filled) + "░".repeat(barW - filled);`;
      if (!s.gradient) return base;
      return `${base}\n    const ctxBarColor = pct < 50 ? "\\x1b[32m" : pct < 80 ? "\\x1b[33m" : "\\x1b[31m";`;
    },
    bashOut: s => s.gradient ? gradientBashOut(s, '"$BAR $PCT%"', '${CTX_BAR_COLOR}') : renderBashOut(s, '"$BAR $PCT%"'),
    pyOut:   s => s.gradient ? gradientPyOut(s, 'f"{ctx_bar} {pct}%"', 'ctx_bar_color') : renderPyOut(s, 'f"{ctx_bar} {pct}%"'),
    nodeOut: s => s.gradient ? gradientNodeOut(s, '`${ctxBar} ${pct}%`', 'ctxBarColor') : renderNodeOut(s, '`${ctxBar} ${pct}%`'),
    editorFields: [
      { type:'number', key:'barWidth', label:'Bar Width', min:4, max:40 },
      { type:'toggle', key:'gradient', label:'Gradient (green→yellow→red by %)' },
    ],
  },
  { id: 'ctx_pct',    label: 'Context %',      icon: '%', group: 'Context',          color: 'green',
    preview: () => '8%',
    bash: s => {
      const base = `CTX_PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)`;
      if (!s.gradient) return base;
      return `${base}\nCTX_PCT_COLOR=$GREEN\n[ "$CTX_PCT" -ge 50 ] && CTX_PCT_COLOR=$YELLOW\n[ "$CTX_PCT" -ge 80 ] && CTX_PCT_COLOR=$RED`;
    },
    pyVar: s => {
      const base = 'ctx_pct = int(data.get("context_window", {}).get("used_percentage", 0) or 0)';
      if (!s.gradient) return base;
      return `${base}\n    ctx_pct_color = "\\033[32m" if ctx_pct < 50 else ("\\033[33m" if ctx_pct < 80 else "\\033[31m")`;
    },
    nodeVar: s => {
      const base = `const ctxPct = Math.floor(data.context_window?.used_percentage || 0);`;
      if (!s.gradient) return base;
      return `${base}\n    const ctxPctColor = ctxPct < 50 ? "\\x1b[32m" : ctxPct < 80 ? "\\x1b[33m" : "\\x1b[31m";`;
    },
    bashOut: s => s.gradient ? gradientBashOut(s, '"${CTX_PCT}%"', '${CTX_PCT_COLOR}') : renderBashOut(s, '"${CTX_PCT}%"'),
    pyOut:   s => s.gradient ? gradientPyOut(s, 'f"{ctx_pct}%"', 'ctx_pct_color') : renderPyOut(s, 'f"{ctx_pct}%"'),
    nodeOut: s => s.gradient ? gradientNodeOut(s, '`${ctxPct}%`', 'ctxPctColor') : renderNodeOut(s, '`${ctxPct}%`'),
    editorFields: [
      { type:'toggle', key:'gradient', label:'Gradient (green→yellow→red by %)' },
    ],
  },
  { id: 'cost',       label: 'Cost',           icon: '$', group: 'Cost & Time',      color: 'yellow',
    preview: () => '$0.01',
    bash: s => `COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')\nCOST_FMT=$(printf '$%.2f' "$COST")`,
    pyVar: 'cost = data.get("cost", {}).get("total_cost_usd", 0) or 0\n    cost_fmt = f"${cost:.2f}"',
    nodeVar: `const cost = data.cost?.total_cost_usd || 0;\n    const costFmt = \`$\${cost.toFixed(2)}\`;`,
    bashOut: s => renderBashOut(s, '$COST_FMT'),
    pyOut: s => renderPyOut(s, 'cost_fmt'),
    nodeOut: s => renderNodeOut(s, 'costFmt'),
  },
  { id: 'duration',   label: 'Duration',       icon: '⏱', group: 'Cost & Time',      color: 'cyan',
    preview: () => '5m 30s',
    bash: s => `DURATION_MS=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')\nDURATION_SEC=$((DURATION_MS / 1000))\nMINS=$((DURATION_SEC / 60))\nSECS=$((DURATION_SEC % 60))`,
    pyVar: 'dur_ms = data.get("cost", {}).get("total_duration_ms", 0) or 0\n    dur_sec = dur_ms // 1000\n    mins, secs = dur_sec // 60, dur_sec % 60',
    nodeVar: `const durMs = data.cost?.total_duration_ms || 0;\n    const mins = Math.floor(durMs / 60000);\n    const secs = Math.floor((durMs % 60000) / 1000);`,
    bashOut: s => renderBashOut(s, '"${MINS}m ${SECS}s"'),
    pyOut: s => renderPyOut(s, 'f"{mins}m {secs}s"'),
    nodeOut: s => renderNodeOut(s, '`${mins}m ${secs}s`'),
  },
  { id: 'apitime',    label: 'API Time',        icon: '⚡', group: 'Cost & Time',     color: 'magenta',
    preview: () => '2.3s',
    bash: s => `API_MS=$(echo "$input" | jq -r '.cost.total_api_duration_ms // 0')\nAPI_SEC=$(echo "scale=1; $API_MS / 1000" | bc)`,
    pyVar: 'api_ms = data.get("cost", {}).get("total_api_duration_ms", 0) or 0\n    api_sec = api_ms / 1000',
    nodeVar: `const apiMs = data.cost?.total_api_duration_ms || 0;\n    const apiSec = (apiMs / 1000).toFixed(1);`,
    bashOut: s => renderBashOut(s, '"${API_SEC}s"'),
    pyOut: s => renderPyOut(s, 'f"{api_sec:.1f}s"'),
    nodeOut: s => renderNodeOut(s, '`${apiSec}s`'),
  },
  { id: 'lines',      label: 'Lines Changed',  icon: '±', group: 'Cost & Time',      color: 'green',
    preview: () => '+156/-23',
    bash: s => `LINES_ADD=$(echo "$input" | jq -r '.cost.total_lines_added // 0')\nLINES_DEL=$(echo "$input" | jq -r '.cost.total_lines_removed // 0')`,
    pyVar: 'lines_add = data.get("cost", {}).get("total_lines_added", 0) or 0\n    lines_del = data.get("cost", {}).get("total_lines_removed", 0) or 0',
    nodeVar: `const linesAdd = data.cost?.total_lines_added || 0;\n    const linesDel = data.cost?.total_lines_removed || 0;`,
    bashOut: s => renderBashOut(s, '"+${LINES_ADD}/-${LINES_DEL}"'),
    pyOut: s => renderPyOut(s, 'f"+{lines_add}/-{lines_del}"'),
    nodeOut: s => renderNodeOut(s, '`+${linesAdd}/-${linesDel}`'),
  },
  { id: 'workdir',    label: 'Working Dir',    icon: '📁', group: 'Workspace',        color: 'default',
    preview: () => 'my-project',
    bash: s => `DIR=$(echo "$input" | jq -r '.workspace.current_dir')`,
    pyVar: 'import os\n    workdir = os.path.basename(data["workspace"]["current_dir"])',
    nodeVar: `const workdir = require('path').basename(data.workspace.current_dir);`,
    bashOut: s => renderBashOut(s, '"${DIR##*/}"'),
    pyOut: s => renderPyOut(s, 'workdir'),
    nodeOut: s => renderNodeOut(s, 'workdir'),
  },
  { id: 'projdir',    label: 'Project Dir',    icon: '⬚', group: 'Workspace',        color: 'default',
    preview: () => 'my-project',
    bash: s => `PROJ_DIR=$(echo "$input" | jq -r '.workspace.project_dir')`,
    pyVar: 'import os\n    projdir = os.path.basename(data["workspace"]["project_dir"])',
    nodeVar: `const projdir = require('path').basename(data.workspace.project_dir);`,
    bashOut: s => renderBashOut(s, '"${PROJ_DIR##*/}"'),
    pyOut: s => renderPyOut(s, 'projdir'),
    nodeOut: s => renderNodeOut(s, 'projdir'),
  },
  { id: 'git_branch', label: 'Git Branch',     icon: '⎇', group: 'Git',              color: 'green',
    preview: () => 'main',
    bash: s => `BRANCH=$(git branch --show-current 2>/dev/null || echo '')`,
    pyVar: 'import subprocess\n    try:\n        branch = subprocess.check_output(["git","branch","--show-current"],text=True,stderr=subprocess.DEVNULL).strip()\n    except:\n        branch = ""',
    nodeVar: `let branch = '';\n    try { branch = require('child_process').execSync('git branch --show-current', {encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim(); } catch {}`,
    bashOut: s => `[ -n "$BRANCH" ] && ${renderBashOut(s, '$BRANCH')}`,
    pyOut: s => `if branch:\n    ${renderPyOut(s, 'branch')}`,
    nodeOut: s => `if (branch) { ${renderNodeOut(s, 'branch')} }`,
  },
  { id: 'git_status', label: 'Git Status',     icon: '◈', group: 'Git',              color: 'yellow',
    preview: () => '+2~1',
    bash: s => `STAGED=$(git diff --cached --numstat 2>/dev/null | wc -l | tr -d ' ')\nMODIFIED=$(git diff --numstat 2>/dev/null | wc -l | tr -d ' ')`,
    pyVar: 'try:\n        staged_out = subprocess.check_output(["git","diff","--cached","--numstat"],text=True,stderr=subprocess.DEVNULL).strip()\n        mod_out = subprocess.check_output(["git","diff","--numstat"],text=True,stderr=subprocess.DEVNULL).strip()\n        staged = len(staged_out.split("\\n")) if staged_out else 0\n        modified = len(mod_out.split("\\n")) if mod_out else 0\n    except:\n        staged = modified = 0',
    nodeVar: `let staged = 0, modified = 0;\n    try {\n        const cp = require('child_process');\n        staged = cp.execSync('git diff --cached --numstat',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim().split('\\n').filter(Boolean).length;\n        modified = cp.execSync('git diff --numstat',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim().split('\\n').filter(Boolean).length;\n    } catch {}`,
    bashOut: s => {
      const open = bashColorOpen(s.color);
      const close = bashColorClose(s.color);
      return `GIT_ST=""\n[ "$STAGED" -gt 0 ] && GIT_ST="${open}+\${STAGED}${close}"\n[ "$MODIFIED" -gt 0 ] && GIT_ST="\${GIT_ST}${open}~\${MODIFIED}${close}"\n[ -n "$GIT_ST" ] && parts+=("$GIT_ST")`;
    },
    pyOut: s => {
      const py = pyAnsi(s.color);
      return `git_st = ""\n    if staged: git_st += f"${py.o}+{staged}${py.c}"\n    if modified: git_st += f"${py.o}~{modified}${py.c}"\n    if git_st: parts.append(git_st)`;
    },
    nodeOut: s => {
      const nd = nodeAnsi(s.color);
      return `let gitSt = '';\n    if (staged) gitSt += \`${nd.o}+\${staged}${nd.c}\`;\n    if (modified) gitSt += \`${nd.o}~\${modified}${nd.c}\`;\n    if (gitSt) parts.push(gitSt);`;
    },
  },
  { id: 'rl5h',       label: 'Rate Limit 5h',  icon: '◉', group: 'Rate Limits',      color: 'red',
    editorFields: [{ type:'toggle', key:'showReset', label:'Show reset time' }],
    preview: s => s.showReset ? '5h: 24% · 14:30' : '5h: 24%',
    bash: s => s.showReset
      ? `RL5H=$(echo "$input" | jq -r 'if .rate_limits.five_hour.used_percentage != null then (.rate_limits.five_hour.used_percentage | floor | tostring) else "" end')\n_RL5H_TS=$(echo "$input" | jq -r '.rate_limits.five_hour.resets_at // empty')\nRL5H_RESET=""\n[ -n "$_RL5H_TS" ] && RL5H_RESET=$(date -r "$_RL5H_TS" +%H:%M 2>/dev/null || date -d "@$_RL5H_TS" +%H:%M 2>/dev/null || echo "")`
      : `RL5H=$(echo "$input" | jq -r 'if .rate_limits.five_hour.used_percentage != null then (.rate_limits.five_hour.used_percentage | floor | tostring) else "" end')`,
    pyVar: s => s.showReset
      ? `rl5h = (data.get("rate_limits") or {}).get("five_hour", {}).get("used_percentage")\n    _rl5h_ts = (data.get("rate_limits") or {}).get("five_hour", {}).get("resets_at")\n    rl5h_reset = __import__('datetime').datetime.fromtimestamp(_rl5h_ts).strftime('%H:%M') if _rl5h_ts else ""`
      : `rl5h = (data.get("rate_limits") or {}).get("five_hour", {}).get("used_percentage")`,
    nodeVar: s => s.showReset
      ? `const rl5h = data.rate_limits?.five_hour?.used_percentage;\n    const _rl5hTs = data.rate_limits?.five_hour?.resets_at;\n    const rl5hReset = _rl5hTs ? new Date(_rl5hTs * 1000).toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit',hour12:false}) : '';`
      : `const rl5h = data.rate_limits?.five_hour?.used_percentage;`,
    bashOut: s => {
      if (s.showReset) {
        const open = bashColorOpen(s.color), close = bashColorClose(s.color);
        const icon = (s.icon && s.icon !== 'none') ? s.icon + ' ' : '';
        const pre = s.prefix || '', suf = s.suffix || '';
        return `[ -n "$RL5H" ] && { rl5h_str="5h: \${RL5H}%"; [ -n "$RL5H_RESET" ] && rl5h_str="\${rl5h_str} · \${RL5H_RESET}"; parts+=("${pre}${icon}${open}\${rl5h_str}${close}${suf}"); }`;
      }
      return `[ -n "$RL5H" ] && ${renderBashOut(s, '"5h: ${RL5H}%"')}`;
    },
    pyOut: s => s.showReset
      ? `if rl5h is not None:\n    rl5h_str = f"5h: {int(rl5h)}%" + (f" · {rl5h_reset}" if rl5h_reset else "")\n    ${renderPyOut(s, 'rl5h_str')}`
      : `if rl5h is not None:\n    ${renderPyOut(s, 'f"5h: {int(rl5h)}%"')}`,
    nodeOut: s => s.showReset
      ? `if (rl5h != null) { const s5h = \`5h: \${Math.round(rl5h)}%\` + (rl5hReset ? \` · \${rl5hReset}\` : ''); ${renderNodeOut(s, 's5h')} }`
      : `if (rl5h != null) { ${renderNodeOut(s, '`5h: ${Math.round(rl5h)}%`')} }`,
  },
  { id: 'rl7d',       label: 'Rate Limit 7d',  icon: '◎', group: 'Rate Limits',      color: 'red',
    editorFields: [{ type:'toggle', key:'showReset', label:'Show reset time' }],
    preview: s => s.showReset ? '7d: 41% · 14:30' : '7d: 41%',
    bash: s => s.showReset
      ? `RL7D=$(echo "$input" | jq -r 'if .rate_limits.seven_day.used_percentage != null then (.rate_limits.seven_day.used_percentage | floor | tostring) else "" end')\n_RL7D_TS=$(echo "$input" | jq -r '.rate_limits.seven_day.resets_at // empty')\nRL7D_RESET=""\n[ -n "$_RL7D_TS" ] && RL7D_RESET=$(date -r "$_RL7D_TS" +%H:%M 2>/dev/null || date -d "@$_RL7D_TS" +%H:%M 2>/dev/null || echo "")`
      : `RL7D=$(echo "$input" | jq -r 'if .rate_limits.seven_day.used_percentage != null then (.rate_limits.seven_day.used_percentage | floor | tostring) else "" end')`,
    pyVar: s => s.showReset
      ? `rl7d = (data.get("rate_limits") or {}).get("seven_day", {}).get("used_percentage")\n    _rl7d_ts = (data.get("rate_limits") or {}).get("seven_day", {}).get("resets_at")\n    rl7d_reset = __import__('datetime').datetime.fromtimestamp(_rl7d_ts).strftime('%H:%M') if _rl7d_ts else ""`
      : `rl7d = (data.get("rate_limits") or {}).get("seven_day", {}).get("used_percentage")`,
    nodeVar: s => s.showReset
      ? `const rl7d = data.rate_limits?.seven_day?.used_percentage;\n    const _rl7dTs = data.rate_limits?.seven_day?.resets_at;\n    const rl7dReset = _rl7dTs ? new Date(_rl7dTs * 1000).toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit',hour12:false}) : '';`
      : `const rl7d = data.rate_limits?.seven_day?.used_percentage;`,
    bashOut: s => {
      const open = bashColorOpen(s.color), close = bashColorClose(s.color);
      const icon = (s.icon && s.icon !== 'none') ? s.icon + ' ' : '';
      const pre = s.prefix || '', suf = s.suffix || '';
      if (s.showReset) {
        return `[ -n "$RL7D" ] && { rl7d_str="7d: \${RL7D}%"; [ -n "$RL7D_RESET" ] && rl7d_str="\${rl7d_str} · \${RL7D_RESET}"; parts+=("${pre}${icon}${open}\${rl7d_str}${close}${suf}"); }`;
      }
      return `[ -n "$RL7D" ] && ${renderBashOut(s, '"7d: ${RL7D}%"')}`;
    },
    pyOut: s => s.showReset
      ? `if rl7d is not None:\n    rl7d_str = f"7d: {int(rl7d)}%" + (f" · {rl7d_reset}" if rl7d_reset else "")\n    ${renderPyOut(s, 'rl7d_str')}`
      : `if rl7d is not None:\n    ${renderPyOut(s, 'f"7d: {int(rl7d)}%"')}`,
    nodeOut: s => s.showReset
      ? `if (rl7d != null) { const s7d = \`7d: \${Math.round(rl7d)}%\` + (rl7dReset ? \` · \${rl7dReset}\` : ''); ${renderNodeOut(s, 's7d')} }`
      : `if (rl7d != null) { ${renderNodeOut(s, '`7d: ${Math.round(rl7d)}%`')} }`,
  },
  { id: 'git_staged',   label: 'Git Staged',     icon: '+', group: 'Git',              color: 'green',
    preview: () => '+2',
    bash: () => `GIT_STAGED=$(git diff --cached --numstat 2>/dev/null | wc -l | tr -d ' ')`,
    pyVar: `try:\n        _s_out = subprocess.check_output(["git","diff","--cached","--numstat"],text=True,stderr=subprocess.DEVNULL).strip()\n        git_staged = len(_s_out.split("\\n")) if _s_out else 0\n    except:\n        git_staged = 0`,
    nodeVar: `let gitStaged = 0;\n    try { gitStaged = require('child_process').execSync('git diff --cached --numstat',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim().split('\\n').filter(Boolean).length; } catch {}`,
    bashOut: s => `[ "$GIT_STAGED" -gt 0 ] && ${renderBashOut(s, '"+${GIT_STAGED}"')}`,
    pyOut: s => `if git_staged:\n    ${renderPyOut(s, 'f"+{git_staged}"')}`,
    nodeOut: s => `if (gitStaged) { ${renderNodeOut(s, '`+${gitStaged}`')} }`,
  },
  { id: 'git_unstaged', label: 'Git Unstaged',   icon: '~', group: 'Git',              color: 'yellow',
    preview: () => '~1',
    bash: () => `GIT_UNSTAGED=$(git diff --numstat 2>/dev/null | wc -l | tr -d ' ')`,
    pyVar: `try:\n        _u_out = subprocess.check_output(["git","diff","--numstat"],text=True,stderr=subprocess.DEVNULL).strip()\n        git_unstaged = len(_u_out.split("\\n")) if _u_out else 0\n    except:\n        git_unstaged = 0`,
    nodeVar: `let gitUnstaged = 0;\n    try { gitUnstaged = require('child_process').execSync('git diff --numstat',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim().split('\\n').filter(Boolean).length; } catch {}`,
    bashOut: s => `[ "$GIT_UNSTAGED" -gt 0 ] && ${renderBashOut(s, '"~${GIT_UNSTAGED}"')}`,
    pyOut: s => `if git_unstaged:\n    ${renderPyOut(s, 'f"~{git_unstaged}"')}`,
    nodeOut: s => `if (gitUnstaged) { ${renderNodeOut(s, '`~${gitUnstaged}`')} }`,
  },
  { id: 'git_untracked',label: 'Git Untracked',  icon: '?', group: 'Git',              color: 'red',
    preview: () => '?3',
    bash: () => `GIT_UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l | tr -d ' ')`,
    pyVar: `try:\n        _ut_out = subprocess.check_output(["git","ls-files","--others","--exclude-standard"],text=True,stderr=subprocess.DEVNULL).strip()\n        git_untracked = len(_ut_out.split("\\n")) if _ut_out else 0\n    except:\n        git_untracked = 0`,
    nodeVar: `let gitUntracked = 0;\n    try { gitUntracked = require('child_process').execSync('git ls-files --others --exclude-standard',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim().split('\\n').filter(Boolean).length; } catch {}`,
    bashOut: s => `[ "$GIT_UNTRACKED" -gt 0 ] && ${renderBashOut(s, '"?${GIT_UNTRACKED}"')}`,
    pyOut: s => `if git_untracked:\n    ${renderPyOut(s, 'f"?{git_untracked}"')}`,
    nodeOut: s => `if (gitUntracked) { ${renderNodeOut(s, '`?${gitUntracked}`')} }`,
  },
  { id: 'git_insertions',label:'Git Insertions', icon: '+', group: 'Git',              color: 'green',
    preview: () => '+45',
    bash: () => `GIT_INS=$(git diff --numstat 2>/dev/null | awk '{sum+=$1} END {print sum+0}')`,
    pyVar: `try:\n        _ins_raw = subprocess.check_output(["git","diff","--numstat"],text=True,stderr=subprocess.DEVNULL)\n        git_ins = sum(int(l.split()[0]) for l in _ins_raw.strip().split("\\n") if l and l.split()[0].isdigit())\n    except:\n        git_ins = 0`,
    nodeVar: `let gitIns = 0;\n    try { require('child_process').execSync('git diff --numstat',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim().split('\\n').forEach(l=>{const n=parseInt(l);if(!isNaN(n))gitIns+=n;}); } catch {}`,
    bashOut: s => renderBashOut(s, '"+${GIT_INS}"'),
    pyOut: s => renderPyOut(s, 'f"+{git_ins}"'),
    nodeOut: s => renderNodeOut(s, '`+${gitIns}`'),
  },
  { id: 'git_deletions', label: 'Git Deletions', icon: '-', group: 'Git',              color: 'red',
    preview: () => '-12',
    bash: () => `GIT_DEL=$(git diff --numstat 2>/dev/null | awk '{sum+=$2} END {print sum+0}')`,
    pyVar: `try:\n        _del_raw = subprocess.check_output(["git","diff","--numstat"],text=True,stderr=subprocess.DEVNULL)\n        git_del = sum(int(l.split()[1]) for l in _del_raw.strip().split("\\n") if l and len(l.split())>1 and l.split()[1].isdigit())\n    except:\n        git_del = 0`,
    nodeVar: `let gitDel = 0;\n    try { require('child_process').execSync('git diff --numstat',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim().split('\\n').forEach(l=>{const p=l.split('\\t');const n=parseInt(p[1]);if(!isNaN(n))gitDel+=n;}); } catch {}`,
    bashOut: s => renderBashOut(s, '"-${GIT_DEL}"'),
    pyOut: s => renderPyOut(s, 'f"-{git_del}"'),
    nodeOut: s => renderNodeOut(s, '`-${gitDel}`'),
  },
  { id: 'git_changes',  label: 'Git Changes',    icon: '±', group: 'Git',              color: 'yellow',
    preview: () => '3',
    bash: () => `GIT_CHANGES=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')`,
    pyVar: `try:\n        _ch_out = subprocess.check_output(["git","diff","--name-only"],text=True,stderr=subprocess.DEVNULL).strip()\n        git_changes = len(_ch_out.split("\\n")) if _ch_out else 0\n    except:\n        git_changes = 0`,
    nodeVar: `let gitChanges = 0;\n    try { gitChanges = require('child_process').execSync('git diff --name-only',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim().split('\\n').filter(Boolean).length; } catch {}`,
    bashOut: s => renderBashOut(s, '$GIT_CHANGES'),
    pyOut: s => renderPyOut(s, 'str(git_changes)'),
    nodeOut: s => renderNodeOut(s, 'String(gitChanges)'),
  },
  { id: 'git_sha',      label: 'Git SHA',        icon: '#', group: 'Git',              color: 'default',
    editorFields: [{ type:'select', key:'shaLength', label:'SHA Length', options:['short','full'] }],
    preview: s => s.shaLength === 'full' ? 'abc1234567890' : 'abc1234',
    bash: s => s.shaLength === 'full'
      ? `GIT_SHA=$(git rev-parse HEAD 2>/dev/null || echo '')`
      : `GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo '')`,
    pyVar: s => s.shaLength === 'full'
      ? `try:\n        git_sha = subprocess.check_output(["git","rev-parse","HEAD"],text=True,stderr=subprocess.DEVNULL).strip()\n    except:\n        git_sha = ""`
      : `try:\n        git_sha = subprocess.check_output(["git","rev-parse","--short","HEAD"],text=True,stderr=subprocess.DEVNULL).strip()\n    except:\n        git_sha = ""`,
    nodeVar: s => s.shaLength === 'full'
      ? `let gitSha='';\n    try{gitSha=require('child_process').execSync('git rev-parse HEAD',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim();}catch{}`
      : `let gitSha='';\n    try{gitSha=require('child_process').execSync('git rev-parse --short HEAD',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim();}catch{}`,
    bashOut: s => `[ -n "$GIT_SHA" ] && ${renderBashOut(s, '$GIT_SHA')}`,
    pyOut: s => `if git_sha:\n    ${renderPyOut(s, 'git_sha')}`,
    nodeOut: s => `if (gitSha) { ${renderNodeOut(s, 'gitSha')} }`,
  },
  { id: 'git_ahead_behind', label: 'Ahead/Behind', icon: '⇅', group: 'Git',           color: 'cyan',
    preview: () => '↑2 ↓0',
    bash: () => `_AB=$(git rev-list --left-right --count HEAD...@{u} 2>/dev/null || echo '0\t0')\nGIT_AHEAD=$(echo "$_AB" | cut -f1)\nGIT_BEHIND=$(echo "$_AB" | cut -f2)`,
    pyVar: `try:\n        _ab = subprocess.check_output(["git","rev-list","--left-right","--count","HEAD...@{u}"],text=True,stderr=subprocess.DEVNULL).strip().split()\n        git_ahead,git_behind = (int(_ab[0]),int(_ab[1])) if len(_ab)>1 else (0,0)\n    except:\n        git_ahead=git_behind=0`,
    nodeVar: `let gitAhead=0,gitBehind=0;\n    try{const _ab=require('child_process').execSync('git rev-list --left-right --count HEAD...@{u}',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim().split(/\\s+/);gitAhead=parseInt(_ab[0])||0;gitBehind=parseInt(_ab[1])||0;}catch{}`,
    bashOut: s => renderBashOut(s, '"↑${GIT_AHEAD} ↓${GIT_BEHIND}"'),
    pyOut: s => renderPyOut(s, 'f"↑{git_ahead} ↓{git_behind}"'),
    nodeOut: s => renderNodeOut(s, '`↑${gitAhead} ↓${gitBehind}`'),
  },
  { id: 'git_conflicts', label: 'Git Conflicts',  icon: '✖', group: 'Git',             color: 'red',
    preview: () => '2 conflicts',
    bash: () => `GIT_CONFLICTS=$(git diff --name-only --diff-filter=U 2>/dev/null | wc -l | tr -d ' ')`,
    pyVar: `try:\n        _cf_out = subprocess.check_output(["git","diff","--name-only","--diff-filter=U"],text=True,stderr=subprocess.DEVNULL).strip()\n        git_conflicts = len(_cf_out.split("\\n")) if _cf_out else 0\n    except:\n        git_conflicts = 0`,
    nodeVar: `let gitConflicts=0;\n    try{gitConflicts=require('child_process').execSync('git diff --name-only --diff-filter=U',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim().split('\\n').filter(Boolean).length;}catch{}`,
    bashOut: s => `[ "$GIT_CONFLICTS" -gt 0 ] && ${renderBashOut(s, '"${GIT_CONFLICTS} conflicts"')}`,
    pyOut: s => `if git_conflicts:\n    ${renderPyOut(s, 'f"{git_conflicts} conflicts"')}`,
    nodeOut: s => `if (gitConflicts) { ${renderNodeOut(s, '`${gitConflicts} conflicts`')} }`,
  },
  { id: 'git_pr',       label: 'Git PR',          icon: '⬦', group: 'Git · Remote',    color: 'blue',
    preview: () => '#123 fix: x',
    bash: () => `GIT_PR=$(gh pr view --json number,title 2>/dev/null | jq -r '"#"+(.number|tostring)+" "+.title' 2>/dev/null || echo '')`,
    pyVar: `try:\n        import json as _json\n        _pr=_json.loads(subprocess.check_output(["gh","pr","view","--json","number,title"],stderr=subprocess.DEVNULL,text=True))\n        git_pr=f"#{_pr['number']} {_pr['title']}"\n    except:\n        git_pr=""`,
    nodeVar: `let gitPr='';\n    try{const _pr=JSON.parse(require('child_process').execSync('gh pr view --json number,title',{encoding:'utf8',stdio:['pipe','pipe','ignore']}));gitPr=\`#\${_pr.number} \${_pr.title}\`;}catch{}`,
    bashOut: s => `[ -n "$GIT_PR" ] && ${renderBashOut(s, '$GIT_PR')}`,
    pyOut: s => `if git_pr:\n    ${renderPyOut(s, 'git_pr')}`,
    nodeOut: s => `if (gitPr) { ${renderNodeOut(s, 'gitPr')} }`,
  },
  { id: 'git_root_dir', label: 'Git Root Dir',    icon: '⬚', group: 'Git · Remote',    color: 'default',
    preview: () => 'project',
    bash: () => `GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo '')`,
    pyVar: `try:\n        git_root=subprocess.check_output(["git","rev-parse","--show-toplevel"],text=True,stderr=subprocess.DEVNULL).strip()\n    except:\n        git_root=""`,
    nodeVar: `let gitRoot='';\n    try{gitRoot=require('child_process').execSync('git rev-parse --show-toplevel',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim();}catch{}`,
    bashOut: s => `[ -n "$GIT_ROOT" ] && ${renderBashOut(s, '"${GIT_ROOT##*/}"')}`,
    pyOut: s => `if git_root:\n    ${renderPyOut(s, '__import__("os").path.basename(git_root)')}`,
    nodeOut: s => `if (gitRoot) { ${renderNodeOut(s, 'require("path").basename(gitRoot)')} }`,
  },
  { id: 'git_is_fork',  label: 'Is Fork',         icon: '⬦', group: 'Git · Remote',    color: 'cyan',
    preview: () => 'fork',
    bash: () => `GIT_IS_FORK=$(git remote 2>/dev/null | grep -q upstream && echo 'fork' || echo '')`,
    pyVar: `try:\n        _remotes=subprocess.check_output(["git","remote"],text=True,stderr=subprocess.DEVNULL).strip().split("\\n")\n        git_is_fork="fork" if "upstream" in _remotes else ""\n    except:\n        git_is_fork=""`,
    nodeVar: `let gitIsFork='';\n    try{const _rm=require('child_process').execSync('git remote',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim().split('\\n');gitIsFork=_rm.includes('upstream')?'fork':'';}catch{}`,
    bashOut: s => `[ -n "$GIT_IS_FORK" ] && ${renderBashOut(s, '$GIT_IS_FORK')}`,
    pyOut: s => `if git_is_fork:\n    ${renderPyOut(s, 'git_is_fork')}`,
    nodeOut: s => `if (gitIsFork) { ${renderNodeOut(s, 'gitIsFork')} }`,
  },
  { id: 'git_origin_owner', label: 'Origin Owner', icon: '◌', group: 'Git · Remote',  color: 'default',
    preview: () => 'octocat',
    bash: () => `GIT_ORIG_URL=$(git remote get-url origin 2>/dev/null||echo '')\nGIT_ORIGIN_OWNER=$(echo "$GIT_ORIG_URL"|sed 's|.*[:/]\\([^/]*\\)/[^/]*\\.git.*|\\1|;s|.*[:/]\\([^/]*\\)/[^/]*$|\\1|')`,
    pyVar: `try:\n        import re as _re\n        _ou=subprocess.check_output(["git","remote","get-url","origin"],text=True,stderr=subprocess.DEVNULL).strip()\n        _om=_re.search(r'[:/]([^/]+)/[^/]+(?:\\.git)?$',_ou)\n        git_origin_owner=_om.group(1) if _om else ""\n    except:\n        git_origin_owner=""`,
    nodeVar: `let gitOriginOwner='';\n    try{const _ou=require('child_process').execSync('git remote get-url origin',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim();const _om=_ou.match(/[:/]([^\\/]+)\\/[^\\/]+(?:\\.git)?$/);gitOriginOwner=_om?_om[1]:'';}catch{}`,
    bashOut: s => `[ -n "$GIT_ORIGIN_OWNER" ] && ${renderBashOut(s, '$GIT_ORIGIN_OWNER')}`,
    pyOut: s => `if git_origin_owner:\n    ${renderPyOut(s, 'git_origin_owner')}`,
    nodeOut: s => `if (gitOriginOwner) { ${renderNodeOut(s, 'gitOriginOwner')} }`,
  },
  { id: 'git_origin_repo', label: 'Origin Repo',  icon: '◌', group: 'Git · Remote',   color: 'default',
    preview: () => 'hello-world',
    bash: () => `GIT_ORIG_URL=$(git remote get-url origin 2>/dev/null||echo '')\nGIT_ORIGIN_REPO=$(echo "$GIT_ORIG_URL"|sed 's|.*/\\([^/]*\\)\\.git$|\\1|;s|.*/\\([^/]*\\)$|\\1|')`,
    pyVar: `try:\n        _ou2=subprocess.check_output(["git","remote","get-url","origin"],text=True,stderr=subprocess.DEVNULL).strip()\n        _om2=_re.search(r'/([^\\/]+?)(?:\\.git)?$',_ou2)\n        git_origin_repo=_om2.group(1) if _om2 else ""\n    except:\n        git_origin_repo=""`,
    nodeVar: `let gitOriginRepo='';\n    try{const _ou2=require('child_process').execSync('git remote get-url origin',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim();const _om2=_ou2.match(/\\/([^\\/]+?)(?:\\.git)?$/);gitOriginRepo=_om2?_om2[1]:'';}catch{}`,
    bashOut: s => `[ -n "$GIT_ORIGIN_REPO" ] && ${renderBashOut(s, '$GIT_ORIGIN_REPO')}`,
    pyOut: s => `if git_origin_repo:\n    ${renderPyOut(s, 'git_origin_repo')}`,
    nodeOut: s => `if (gitOriginRepo) { ${renderNodeOut(s, 'gitOriginRepo')} }`,
  },
  { id: 'git_origin_owner_repo', label: 'Origin Owner/Repo', icon: '◈', group: 'Git · Remote', color: 'default',
    preview: () => 'octocat/hello-world',
    bash: () => `GIT_ORIG_URL=$(git remote get-url origin 2>/dev/null||echo '')\nGIT_ORIGIN_OR=$(echo "$GIT_ORIG_URL"|sed 's|.*[:/]\\([^/]*/[^/]*\\)\\.git$|\\1|;s|.*[:/]\\([^/]*/[^/]*\\)$|\\1|')`,
    pyVar: `try:\n        _ou3=subprocess.check_output(["git","remote","get-url","origin"],text=True,stderr=subprocess.DEVNULL).strip()\n        _om3=_re.search(r'[:/]([^\\/]+/[^\\/]+?)(?:\\.git)?$',_ou3)\n        git_origin_or=_om3.group(1) if _om3 else ""\n    except:\n        git_origin_or=""`,
    nodeVar: `let gitOriginOr='';\n    try{const _ou3=require('child_process').execSync('git remote get-url origin',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim();const _om3=_ou3.match(/[:/]([^\\/]+\\/[^\\/]+?)(?:\\.git)?$/);gitOriginOr=_om3?_om3[1]:'';}catch{}`,
    bashOut: s => `[ -n "$GIT_ORIGIN_OR" ] && ${renderBashOut(s, '$GIT_ORIGIN_OR')}`,
    pyOut: s => `if git_origin_or:\n    ${renderPyOut(s, 'git_origin_or')}`,
    nodeOut: s => `if (gitOriginOr) { ${renderNodeOut(s, 'gitOriginOr')} }`,
  },
  { id: 'git_upstream_owner', label: 'Upstream Owner', icon: '◌', group: 'Git · Remote', color: 'default',
    preview: () => 'org',
    bash: () => `GIT_UP_URL=$(git remote get-url upstream 2>/dev/null||echo '')\nGIT_UP_OWNER=$(echo "$GIT_UP_URL"|sed 's|.*[:/]\\([^/]*\\)/[^/]*\\.git.*|\\1|;s|.*[:/]\\([^/]*\\)/[^/]*$|\\1|')`,
    pyVar: `try:\n        _uu=subprocess.check_output(["git","remote","get-url","upstream"],text=True,stderr=subprocess.DEVNULL).strip()\n        _um=_re.search(r'[:/]([^/]+)/[^/]+(?:\\.git)?$',_uu)\n        git_up_owner=_um.group(1) if _um else ""\n    except:\n        git_up_owner=""`,
    nodeVar: `let gitUpOwner='';\n    try{const _uu=require('child_process').execSync('git remote get-url upstream',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim();const _um=_uu.match(/[:/]([^\\/]+)\\/[^\\/]+(?:\\.git)?$/);gitUpOwner=_um?_um[1]:'';}catch{}`,
    bashOut: s => `[ -n "$GIT_UP_OWNER" ] && ${renderBashOut(s, '$GIT_UP_OWNER')}`,
    pyOut: s => `if git_up_owner:\n    ${renderPyOut(s, 'git_up_owner')}`,
    nodeOut: s => `if (gitUpOwner) { ${renderNodeOut(s, 'gitUpOwner')} }`,
  },
  { id: 'git_upstream_repo', label: 'Upstream Repo', icon: '◌', group: 'Git · Remote', color: 'default',
    preview: () => 'hello-world',
    bash: () => `GIT_UP_URL=$(git remote get-url upstream 2>/dev/null||echo '')\nGIT_UP_REPO=$(echo "$GIT_UP_URL"|sed 's|.*/\\([^/]*\\)\\.git$|\\1|;s|.*/\\([^/]*\\)$|\\1|')`,
    pyVar: `try:\n        _uu2=subprocess.check_output(["git","remote","get-url","upstream"],text=True,stderr=subprocess.DEVNULL).strip()\n        _um2=_re.search(r'/([^\\/]+?)(?:\\.git)?$',_uu2)\n        git_up_repo=_um2.group(1) if _um2 else ""\n    except:\n        git_up_repo=""`,
    nodeVar: `let gitUpRepo='';\n    try{const _uu2=require('child_process').execSync('git remote get-url upstream',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim();const _um2=_uu2.match(/\\/([^\\/]+?)(?:\\.git)?$/);gitUpRepo=_um2?_um2[1]:'';}catch{}`,
    bashOut: s => `[ -n "$GIT_UP_REPO" ] && ${renderBashOut(s, '$GIT_UP_REPO')}`,
    pyOut: s => `if git_up_repo:\n    ${renderPyOut(s, 'git_up_repo')}`,
    nodeOut: s => `if (gitUpRepo) { ${renderNodeOut(s, 'gitUpRepo')} }`,
  },
  { id: 'git_upstream_owner_repo', label: 'Upstream Owner/Repo', icon: '◈', group: 'Git · Remote', color: 'default',
    preview: () => 'org/hello-world',
    bash: () => `GIT_UP_URL=$(git remote get-url upstream 2>/dev/null||echo '')\nGIT_UP_OR=$(echo "$GIT_UP_URL"|sed 's|.*[:/]\\([^/]*/[^/]*\\)\\.git$|\\1|;s|.*[:/]\\([^/]*/[^/]*\\)$|\\1|')`,
    pyVar: `try:\n        _uu3=subprocess.check_output(["git","remote","get-url","upstream"],text=True,stderr=subprocess.DEVNULL).strip()\n        _um3=_re.search(r'[:/]([^\\/]+/[^\\/]+?)(?:\\.git)?$',_uu3)\n        git_up_or=_um3.group(1) if _um3 else ""\n    except:\n        git_up_or=""`,
    nodeVar: `let gitUpOr='';\n    try{const _uu3=require('child_process').execSync('git remote get-url upstream',{encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim();const _um3=_uu3.match(/[:/]([^\\/]+\\/[^\\/]+?)(?:\\.git)?$/);gitUpOr=_um3?_um3[1]:'';}catch{}`,
    bashOut: s => `[ -n "$GIT_UP_OR" ] && ${renderBashOut(s, '$GIT_UP_OR')}`,
    pyOut: s => `if git_up_or:\n    ${renderPyOut(s, 'git_up_or')}`,
    nodeOut: s => `if (gitUpOr) { ${renderNodeOut(s, 'gitUpOr')} }`,
  },
  { id: 'git_worktree_name', label: 'Worktree Name', icon: '⬚', group: 'Git · Worktrees', color: 'cyan',
    preview: () => 'feat',
    bash: () => `GIT_WT_NAME=$(git worktree list --porcelain 2>/dev/null | awk 'BEGIN{cwd=ENVIRON["PWD"]} /^worktree/{p=$2} /^branch/{b=$2} /^$/{if(p==cwd){print b;exit}}' | sed 's|.*/||')`,
    pyVar: `try:\n        _wt=subprocess.check_output(["git","worktree","list","--porcelain"],text=True,stderr=subprocess.DEVNULL)\n        import os as _os2; _cwd=_os2.getcwd(); git_wt_name=""\n        for _blk in _wt.split("\\n\\n"):\n            if _cwd in _blk:\n                for _ln in _blk.split("\\n"):\n                    if _ln.startswith("branch "): git_wt_name=_ln.split("/")[-1]\n    except:\n        git_wt_name=""`,
    nodeVar: `let gitWtName='';\n    try{const _wt=require('child_process').execSync('git worktree list --porcelain',{encoding:'utf8',stdio:['pipe','pipe','ignore']});for(const _b of _wt.split('\\n\\n')){if(_b.includes(process.cwd())){const _m=_b.match(/^branch (.+)$/m);if(_m)gitWtName=_m[1].split('/').pop();}}}catch{}`,
    bashOut: s => `[ -n "$GIT_WT_NAME" ] && ${renderBashOut(s, '$GIT_WT_NAME')}`,
    pyOut: s => `if git_wt_name:\n    ${renderPyOut(s, 'git_wt_name')}`,
    nodeOut: s => `if (gitWtName) { ${renderNodeOut(s, 'gitWtName')} }`,
  },
  { id: 'git_worktree_branch', label: 'Worktree Branch', icon: '⎇', group: 'Git · Worktrees', color: 'green',
    preview: () => 'feature/x',
    bash: () => `GIT_WT_BRANCH=$(git worktree list --porcelain 2>/dev/null | awk 'BEGIN{cwd=ENVIRON["PWD"]} /^worktree/{p=$2} /^branch/{b=$2} /^$/{if(p==cwd){print b;exit}}')`,
    pyVar: `try:\n        _wt2=subprocess.check_output(["git","worktree","list","--porcelain"],text=True,stderr=subprocess.DEVNULL)\n        git_wt_branch=""\n        for _blk2 in _wt2.split("\\n\\n"):\n            if _cwd in _blk2:\n                for _ln2 in _blk2.split("\\n"):\n                    if _ln2.startswith("branch "): git_wt_branch=_ln2[7:]\n    except:\n        git_wt_branch=""`,
    nodeVar: `let gitWtBranch='';\n    try{const _wt2=require('child_process').execSync('git worktree list --porcelain',{encoding:'utf8',stdio:['pipe','pipe','ignore']});for(const _b2 of _wt2.split('\\n\\n')){if(_b2.includes(process.cwd())){const _m2=_b2.match(/^branch (.+)$/m);if(_m2)gitWtBranch=_m2[1];}}}catch{}`,
    bashOut: s => `[ -n "$GIT_WT_BRANCH" ] && ${renderBashOut(s, '$GIT_WT_BRANCH')}`,
    pyOut: s => `if git_wt_branch:\n    ${renderPyOut(s, 'git_wt_branch')}`,
    nodeOut: s => `if (gitWtBranch) { ${renderNodeOut(s, 'gitWtBranch')} }`,
  },
  { id: 'tokens_input',  label: 'Tokens In',      icon: '→', group: 'Tokens',           color: 'blue',
    preview: () => '12500',
    bash: () => `TOK_IN=$(echo "$input" | jq -r '.tokens.input // 0')`,
    pyVar: 'tok_in = (data.get("tokens") or {}).get("input", 0)',
    nodeVar: `const tokIn = data.tokens?.input || 0;`,
    bashOut: s => renderBashOut(s, '$TOK_IN'),
    pyOut: s => renderPyOut(s, 'str(tok_in)'),
    nodeOut: s => renderNodeOut(s, 'String(tokIn)'),
  },
  { id: 'tokens_output', label: 'Tokens Out',     icon: '←', group: 'Tokens',           color: 'green',
    preview: () => '3200',
    bash: () => `TOK_OUT=$(echo "$input" | jq -r '.tokens.output // 0')`,
    pyVar: 'tok_out = (data.get("tokens") or {}).get("output", 0)',
    nodeVar: `const tokOut = data.tokens?.output || 0;`,
    bashOut: s => renderBashOut(s, '$TOK_OUT'),
    pyOut: s => renderPyOut(s, 'str(tok_out)'),
    nodeOut: s => renderNodeOut(s, 'String(tokOut)'),
  },
  { id: 'tokens_cached', label: 'Tokens Cached',  icon: '◎', group: 'Tokens',           color: 'cyan',
    preview: () => '8000',
    bash: () => `TOK_CACHED=$(echo "$input" | jq -r '.tokens.cached // 0')`,
    pyVar: 'tok_cached = (data.get("tokens") or {}).get("cached", 0)',
    nodeVar: `const tokCached = data.tokens?.cached || 0;`,
    bashOut: s => renderBashOut(s, '$TOK_CACHED'),
    pyOut: s => renderPyOut(s, 'str(tok_cached)'),
    nodeOut: s => renderNodeOut(s, 'String(tokCached)'),
  },
  { id: 'tokens_total',  label: 'Tokens Total',   icon: '◉', group: 'Tokens',           color: 'magenta',
    preview: () => '23700',
    bash: () => `TOK_TOTAL=$(echo "$input" | jq -r '.tokens.total // 0')`,
    pyVar: 'tok_total = (data.get("tokens") or {}).get("total", 0)',
    nodeVar: `const tokTotal = data.tokens?.total || 0;`,
    bashOut: s => renderBashOut(s, '$TOK_TOTAL'),
    pyOut: s => renderPyOut(s, 'str(tok_total)'),
    nodeOut: s => renderNodeOut(s, 'String(tokTotal)'),
  },
  { id: 'context_length',label: 'Context Length', icon: '◈', group: 'Tokens',           color: 'default',
    preview: () => '200000',
    bash: () => `CTX_LEN=$(echo "$input" | jq -r '.context_window.length // 0')`,
    pyVar: 'ctx_len = (data.get("context_window") or {}).get("length", 0)',
    nodeVar: `const ctxLen = data.context_window?.length || 0;`,
    bashOut: s => renderBashOut(s, '$CTX_LEN'),
    pyOut: s => renderPyOut(s, 'str(ctx_len)'),
    nodeOut: s => renderNodeOut(s, 'String(ctxLen)'),
  },
  { id: 'input_speed',   label: 'Input Speed',    icon: '⚡', group: 'Tokens',           color: 'blue',
    preview: () => '450tok/s',
    bash: () => `IN_SPEED=$(echo "$input" | jq -r '.tokens.input_speed // 0' | cut -d. -f1)`,
    pyVar: 'in_speed = int((data.get("tokens") or {}).get("input_speed", 0) or 0)',
    nodeVar: `const inSpeed = Math.floor(data.tokens?.input_speed || 0);`,
    bashOut: s => renderBashOut(s, '"${IN_SPEED}tok/s"'),
    pyOut: s => renderPyOut(s, 'f"{in_speed}tok/s"'),
    nodeOut: s => renderNodeOut(s, '`${inSpeed}tok/s`'),
  },
  { id: 'output_speed',  label: 'Output Speed',   icon: '⚡', group: 'Tokens',           color: 'green',
    preview: () => '112tok/s',
    bash: () => `OUT_SPEED=$(echo "$input" | jq -r '.tokens.output_speed // 0' | cut -d. -f1)`,
    pyVar: 'out_speed = int((data.get("tokens") or {}).get("output_speed", 0) or 0)',
    nodeVar: `const outSpeed = Math.floor(data.tokens?.output_speed || 0);`,
    bashOut: s => renderBashOut(s, '"${OUT_SPEED}tok/s"'),
    pyOut: s => renderPyOut(s, 'f"{out_speed}tok/s"'),
    nodeOut: s => renderNodeOut(s, '`${outSpeed}tok/s`'),
  },
  { id: 'total_speed',   label: 'Total Speed',    icon: '⚡', group: 'Tokens',           color: 'yellow',
    preview: () => '562tok/s',
    bash: () => `TOTAL_SPEED=$(echo "$input" | jq -r '.tokens.total_speed // 0' | cut -d. -f1)`,
    pyVar: 'total_speed = int((data.get("tokens") or {}).get("total_speed", 0) or 0)',
    nodeVar: `const totalSpeed = Math.floor(data.tokens?.total_speed || 0);`,
    bashOut: s => renderBashOut(s, '"${TOTAL_SPEED}tok/s"'),
    pyOut: s => renderPyOut(s, 'f"{total_speed}tok/s"'),
    nodeOut: s => renderNodeOut(s, '`${totalSpeed}tok/s`'),
  },
  { id: 'session_usage', label: 'Session Usage',  icon: '◈', group: 'Tokens',           color: 'default',
    preview: () => '45000 tok',
    bash: () => `SESSION_TOK=$(echo "$input" | jq -r '.usage.session_tokens // 0')`,
    pyVar: 'session_tok = (data.get("usage") or {}).get("session_tokens", 0)',
    nodeVar: `const sessionTok = data.usage?.session_tokens || 0;`,
    bashOut: s => renderBashOut(s, '"${SESSION_TOK} tok"'),
    pyOut: s => renderPyOut(s, 'f"{session_tok} tok"'),
    nodeOut: s => renderNodeOut(s, '`${sessionTok} tok`'),
  },
  { id: 'weekly_usage',  label: 'Weekly Usage',   icon: '◎', group: 'Tokens',           color: 'default',
    preview: () => '890000 tok',
    bash: () => `WEEKLY_TOK=$(echo "$input" | jq -r '.usage.weekly_tokens // 0')`,
    pyVar: 'weekly_tok = (data.get("usage") or {}).get("weekly_tokens", 0)',
    nodeVar: `const weeklyTok = data.usage?.weekly_tokens || 0;`,
    bashOut: s => renderBashOut(s, '"${WEEKLY_TOK} tok"'),
    pyOut: s => renderPyOut(s, 'f"{weekly_tok} tok"'),
    nodeOut: s => renderNodeOut(s, '`${weeklyTok} tok`'),
  },
  { id: 'block_reset_timer', label: 'Block Reset Timer', icon: '⏱', group: 'Timers',   color: 'red',
    preview: () => '14m 30s',
    bash: () => `_BRT=$(echo "$input" | jq -r '.usage.block_reset_at // empty')\nif [ -n "$_BRT" ]; then\n  _BRT_TS=$(date -d "$_BRT" +%s 2>/dev/null || gdate -d "$_BRT" +%s 2>/dev/null || echo 0)\n  _BRT_DIFF=$(( _BRT_TS - $(date +%s) ))\n  [ "$_BRT_DIFF" -lt 0 ] && _BRT_DIFF=0\n  BLOCK_RESET_FMT="$(( _BRT_DIFF / 60 ))m $(( _BRT_DIFF % 60 ))s"\nelse\n  BLOCK_RESET_FMT=""\nfi`,
    pyVar: `try:\n        from datetime import datetime,timezone\n        _brt=(data.get("usage") or {}).get("block_reset_at","")\n        if _brt:\n            _brt_dt=datetime.fromisoformat(_brt.replace("Z","+00:00"))\n            _brt_d=max(0,int((_brt_dt-datetime.now(timezone.utc)).total_seconds()))\n            block_reset_fmt=f"{_brt_d//60}m {_brt_d%60}s"\n        else: block_reset_fmt=""\n    except: block_reset_fmt=""`,
    nodeVar: `let blockResetFmt='';\n    try{const _brt=data.usage?.block_reset_at;if(_brt){const _d=Math.max(0,Math.floor((new Date(_brt)-Date.now())/1000));blockResetFmt=\`\${Math.floor(_d/60)}m \${_d%60}s\`;}}catch{}`,
    bashOut: s => `[ -n "$BLOCK_RESET_FMT" ] && ${renderBashOut(s, '$BLOCK_RESET_FMT')}`,
    pyOut: s => `if block_reset_fmt:\n    ${renderPyOut(s, 'block_reset_fmt')}`,
    nodeOut: s => `if (blockResetFmt) { ${renderNodeOut(s, 'blockResetFmt')} }`,
  },
  { id: 'weekly_reset_timer', label: 'Weekly Reset Timer', icon: '⏱', group: 'Timers', color: 'magenta',
    preview: () => '4d 12h',
    bash: () => `_WRT=$(echo "$input" | jq -r '.usage.weekly_reset_at // empty')\nif [ -n "$_WRT" ]; then\n  _WRT_TS=$(date -d "$_WRT" +%s 2>/dev/null || gdate -d "$_WRT" +%s 2>/dev/null || echo 0)\n  _WRT_DIFF=$(( _WRT_TS - $(date +%s) ))\n  [ "$_WRT_DIFF" -lt 0 ] && _WRT_DIFF=0\n  WEEKLY_RESET_FMT="$(( _WRT_DIFF / 86400 ))d $(( (_WRT_DIFF % 86400) / 3600 ))h"\nelse\n  WEEKLY_RESET_FMT=""\nfi`,
    pyVar: `try:\n        _wrt=(data.get("usage") or {}).get("weekly_reset_at","")\n        if _wrt:\n            _wrt_dt=datetime.fromisoformat(_wrt.replace("Z","+00:00"))\n            _wrt_d=max(0,int((_wrt_dt-datetime.now(timezone.utc)).total_seconds()))\n            weekly_reset_fmt=f"{_wrt_d//86400}d {(_wrt_d%86400)//3600}h"\n        else: weekly_reset_fmt=""\n    except: weekly_reset_fmt=""`,
    nodeVar: `let weeklyResetFmt='';\n    try{const _wrt=data.usage?.weekly_reset_at;if(_wrt){const _d=Math.max(0,Math.floor((new Date(_wrt)-Date.now())/1000));weeklyResetFmt=\`\${Math.floor(_d/86400)}d \${Math.floor((_d%86400)/3600)}h\`;}}catch{}`,
    bashOut: s => `[ -n "$WEEKLY_RESET_FMT" ] && ${renderBashOut(s, '$WEEKLY_RESET_FMT')}`,
    pyOut: s => `if weekly_reset_fmt:\n    ${renderPyOut(s, 'weekly_reset_fmt')}`,
    nodeOut: s => `if (weeklyResetFmt) { ${renderNodeOut(s, 'weeklyResetFmt')} }`,
  },
  { id: 'thinking_effort', label: 'Thinking Effort', icon: '◈', group: 'Model & Session', color: 'magenta',
    preview: () => 'normal',
    bash: () => `THINKING=$(echo "$input" | jq -r '.session.thinking_effort // empty')`,
    pyVar: 'thinking = (data.get("session") or {}).get("thinking_effort", "")',
    nodeVar: `const thinking = data.session?.thinking_effort || '';`,
    bashOut: s => `[ -n "$THINKING" ] && ${renderBashOut(s, '$THINKING')}`,
    pyOut: s => `if thinking:\n    ${renderPyOut(s, 'thinking')}`,
    nodeOut: s => `if (thinking) { ${renderNodeOut(s, 'thinking')} }`,
  },
  { id: 'claude_email',    label: 'Account Email',   icon: '✦', group: 'Model & Session', color: 'default',
    preview: () => 'user@example.com',
    bash: () => `CLAUDE_EMAIL=$(echo "$input" | jq -r '.account.email // empty')`,
    pyVar: 'claude_email = (data.get("account") or {}).get("email", "")',
    nodeVar: `const claudeEmail = data.account?.email || '';`,
    bashOut: s => `[ -n "$CLAUDE_EMAIL" ] && ${renderBashOut(s, '$CLAUDE_EMAIL')}`,
    pyOut: s => `if claude_email:\n    ${renderPyOut(s, 'claude_email')}`,
    nodeOut: s => `if (claudeEmail) { ${renderNodeOut(s, 'claudeEmail')} }`,
  },
  { id: 'session_id',      label: 'Session ID',      icon: '⬡', group: 'Model & Session', color: 'default',
    preview: () => 'ses_abc123',
    bash: () => `SESSION_ID=$(echo "$input" | jq -r '.session.id // empty')`,
    pyVar: 'session_id = (data.get("session") or {}).get("id", "")',
    nodeVar: `const sessionId = data.session?.id || '';`,
    bashOut: s => `[ -n "$SESSION_ID" ] && ${renderBashOut(s, '$SESSION_ID')}`,
    pyOut: s => `if session_id:\n    ${renderPyOut(s, 'session_id')}`,
    nodeOut: s => `if (sessionId) { ${renderNodeOut(s, 'sessionId')} }`,
  },
  { id: 'skills',          label: 'Skills',           icon: '🧩', group: 'Model & Session', color: 'cyan',
    editorFields: [{ type:'select', key:'skillsMode', label:'Display', options:['last','count','list'] }],
    preview: s => ({ last:'frontend-design', count:'3 skills', list:'design,commit' })[s.skillsMode||'last'],
    bash: s => {
      if ((s.skillsMode||'last') === 'count') return `SKILLS_VAL=$(echo "$input" | jq -r '(.skills.total_count // 0) | tostring | . + " skills"')`;
      if ((s.skillsMode||'last') === 'list')  return `SKILLS_VAL=$(echo "$input" | jq -r '[.skills.unique_list[]?] | join(",")')`;
      return `SKILLS_VAL=$(echo "$input" | jq -r '.skills.last_used // empty')`;
    },
    pyVar: s => {
      if ((s.skillsMode||'last') === 'count') return `skills_val = str((data.get("skills") or {}).get("total_count", 0)) + " skills"`;
      if ((s.skillsMode||'last') === 'list')  return `skills_val = ",".join((data.get("skills") or {}).get("unique_list", []))`;
      return `skills_val = (data.get("skills") or {}).get("last_used", "")`;
    },
    nodeVar: s => {
      if ((s.skillsMode||'last') === 'count') return `const skillsVal = String(data.skills?.total_count || 0) + ' skills';`;
      if ((s.skillsMode||'last') === 'list')  return `const skillsVal = (data.skills?.unique_list || []).join(',');`;
      return `const skillsVal = data.skills?.last_used || '';`;
    },
    bashOut: s => `[ -n "$SKILLS_VAL" ] && ${renderBashOut(s, '$SKILLS_VAL')}`,
    pyOut: s => `if skills_val:\n    ${renderPyOut(s, 'skills_val')}`,
    nodeOut: s => `if (skillsVal) { ${renderNodeOut(s, 'skillsVal')} }`,
  },
  { id: 'free_memory',   label: 'Free Memory',    icon: '▓', group: 'System',           color: 'cyan',
    preview: () => '4096M',
    bash: () => `FREE_MEM=$(free -h 2>/dev/null | awk '/^Mem:/{print $4}' || vm_stat 2>/dev/null | awk '/Pages free/{printf "%.0fM",$3*4096/1048576}' || echo '')`,
    pyVar: `try:\n        import platform as _plat\n        if _plat.system()=="Darwin":\n            _vm=subprocess.check_output(["vm_stat"],text=True,stderr=subprocess.DEVNULL)\n            import re as _re2; _pf=int(_re2.search(r'Pages free:\\s+(\\d+)',_vm).group(1))\n            free_mem=f"{_pf*4096//(1024*1024)}M"\n        else:\n            _fm=subprocess.check_output(["free","-h"],text=True,stderr=subprocess.DEVNULL)\n            free_mem=_fm.split("\\n")[1].split()[3]\n    except: free_mem=""`,
    nodeVar: `let freeMem='';\n    try{const _os=require('os');freeMem=Math.floor(_os.freemem()/1024/1024)+'M';}catch{}`,
    bashOut: s => `[ -n "$FREE_MEM" ] && ${renderBashOut(s, '$FREE_MEM')}`,
    pyOut: s => `if free_mem:\n    ${renderPyOut(s, 'free_mem')}`,
    nodeOut: s => `if (freeMem) { ${renderNodeOut(s, 'freeMem')} }`,
  },
  { id: 'terminal_width',label: 'Terminal Width',  icon: '↔', group: 'System',           color: 'default',
    preview: () => '220',
    bash: () => `TERM_WIDTH=$(tput cols 2>/dev/null || echo 80)`,
    pyVar: `import shutil as _shutil\n    term_width = _shutil.get_terminal_size().columns`,
    nodeVar: `const termWidth = process.stdout.columns || 80;`,
    bashOut: s => renderBashOut(s, '$TERM_WIDTH'),
    pyOut: s => renderPyOut(s, 'str(term_width)'),
    nodeOut: s => renderNodeOut(s, 'String(termWidth)'),
  },
  { id: 'custom_command',label: 'Custom Command',  icon: '⬧', group: 'Custom',          color: 'default',
    editorFields: [{ type:'text', key:'commandStr', label:'Command', width:200, placeholder:'my-tool --flag' }],
    preview: s => s.commandStr ? s.commandStr.slice(0,16) : 'custom cmd',
    bash: s => `CUSTOM_OUT=$(echo "$input" | ${s.commandStr || 'cat'} 2>/dev/null || echo '')`,
    pyVar: s => `try:\n        custom_out=subprocess.check_output(${JSON.stringify(s.commandStr||'cat')},input=json.dumps(data).encode(),shell=True,stderr=subprocess.DEVNULL,text=True).strip()\n    except: custom_out=""`,
    nodeVar: s => `let customOut='';\n    try{customOut=require('child_process').execSync(${JSON.stringify(s.commandStr||'cat')},{input:JSON.stringify(data),encoding:'utf8',stdio:['pipe','pipe','ignore']}).trim();}catch{}`,
    bashOut: s => `[ -n "$CUSTOM_OUT" ] && ${renderBashOut(s, '$CUSTOM_OUT')}`,
    pyOut: s => `if custom_out:\n    ${renderPyOut(s, 'custom_out')}`,
    nodeOut: s => `if (customOut) { ${renderNodeOut(s, 'customOut')} }`,
  },
  { id: 'link',          label: 'Link (OSC 8)',    icon: '🔗', group: 'Custom',          color: 'blue',
    editorFields: [{ type:'text', key:'urlHref', label:'URL', width:200, placeholder:'https://...' }, { type:'text', key:'urlText', label:'Display Text', width:120, placeholder:'click here' }],
    preview: s => s.urlText || 'link',
    bash: () => '',
    pyVar: '',
    nodeVar: '',
    bashOut: s => `parts+=($'\\033]8;;${s.urlHref||''}\\033\\\\${s.urlText||'link'}\\033]8;;\\033\\\\')`,
    pyOut: s => `parts.append("\\033]8;;${s.urlHref||''}\\033\\\\\\\\${s.urlText||'link'}\\033]8;;\\033\\\\\\\\")`,
    nodeOut: s => `parts.push("\\x1b]8;;${s.urlHref||''}\\x1b\\\\\\\\${s.urlText||'link'}\\x1b]8;;\\x1b\\\\\\\\");`,
  },
  { id: 'separator',  label: 'Separator',      icon: '│', group: 'Layout',            color: 'default',
    preview: s => s.sepText || '│',
    isSep: true,
    bash: () => '',
    pyVar: '',
    nodeVar: '',
    bashOut: s => `parts+=("${(s.sepText||'│')}")`,
    pyOut: s => `parts.append("${s.sepText||'│'}")`,
    nodeOut: s => `parts.push("${s.sepText||'│'}");`,
  },
  { id: 'custom',     label: 'Custom Text',    icon: 'T', group: 'Layout',            color: 'default',
    preview: s => s.customText || 'hello',
    isCustom: true,
    bash: () => '',
    pyVar: '',
    nodeVar: '',
    bashOut: s => `parts+=("${s.customText||''}")`,
    pyOut: s => `parts.append("${s.customText||''}")`,
    nodeOut: s => `parts.push("${s.customText||''}");`,
  },
];

export const SEGMENT_GROUPS = [...new Set(SEGMENT_DEFS.map(d => d.group))];
