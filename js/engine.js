/*
 * Agna School — tiny template engine.
 *
 * The screens were designed in Claude Design, which writes HTML templates
 * with a few extra tags:
 *   {{ path.to.value }}          insert a value (text or attribute)
 *   <sc-if value="{{ x }}">      show the inside only when x is truthy
 *   <sc-for list="{{ xs }}" as="x">  repeat the inside for every item
 *   style-hover="..."            extra styles while the mouse is over it
 *   style-focus="..."            extra styles while an input is focused
 *   onClick="{{ fn }}"           run a function from the screen's logic
 *
 * This file reads those templates and turns them into React elements, so
 * React can keep the page up to date as the data changes.
 */
(function () {
  'use strict';
  const h = React.createElement;

  /* ---------- 1. Parse the template text into a simple tree ---------- */

  const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
  const RAW = new Set(['style', 'script']);
  const decoder = document.createElement('textarea');
  const decode = s => (s.indexOf('&') < 0 ? s : ((decoder.innerHTML = s), decoder.value));

  function parse(src) {
    const root = { tag: '#root', attrs: [], kids: [] };
    const stack = [root];
    let i = 0;
    const top = () => stack[stack.length - 1];
    while (i < src.length) {
      if (src.startsWith('<!--', i)) { const e = src.indexOf('-->', i); i = e < 0 ? src.length : e + 3; continue; }
      if (src[i] === '<' && src[i + 1] === '/') {
        const e = src.indexOf('>', i);
        const name = src.slice(i + 2, e).trim().toLowerCase();
        for (let k = stack.length - 1; k > 0; k--) {
          if (stack[k].tag.toLowerCase() === name) { stack.length = k; break; }
        }
        i = e + 1; continue;
      }
      if (src[i] === '<' && /[a-zA-Z]/.test(src[i + 1] || '')) {
        let j = i + 1;
        while (j < src.length && /[^\s/>]/.test(src[j])) j++;
        const tag = src.slice(i + 1, j);
        const attrs = [];
        let selfClose = false;
        while (j < src.length) {
          while (/\s/.test(src[j])) j++;
          if (src[j] === '>') { j++; break; }
          if (src[j] === '/' && src[j + 1] === '>') { selfClose = true; j += 2; break; }
          let k = j;
          while (k < src.length && /[^\s=>/]/.test(src[k])) k++;
          const name = src.slice(j, k);
          j = k;
          while (/\s/.test(src[j])) j++;
          let val = '';
          if (src[j] === '=') {
            j++;
            while (/\s/.test(src[j])) j++;
            const q = src[j];
            if (q === '"' || q === "'") { const e = src.indexOf(q, j + 1); val = src.slice(j + 1, e); j = e + 1; }
            else { let e = j; while (e < src.length && /[^\s>]/.test(src[e])) e++; val = src.slice(j, e); j = e; }
          }
          if (name) attrs.push([name, decode(val)]);
          else j++;
        }
        const node = { tag, attrs, kids: [] };
        top().kids.push(node);
        const lower = tag.toLowerCase();
        if (RAW.has(lower)) {
          const e = src.toLowerCase().indexOf('</' + lower, j);
          node.kids.push(src.slice(j, e < 0 ? src.length : e));
          i = e < 0 ? src.length : src.indexOf('>', e) + 1;
          continue;
        }
        if (!selfClose && !VOID.has(lower)) stack.push(node);
        i = j; continue;
      }
      let e = src.indexOf('<', i + 1);
      while (e >= 0 && !/[a-zA-Z/!]/.test(src[e + 1] || '')) e = src.indexOf('<', e + 1);
      if (e < 0) e = src.length;
      const text = src.slice(i, e);
      // Drop pure indentation; keep real spaces between inline words.
      if (!(text.trim() === '' && text.indexOf('\n') >= 0)) top().kids.push(decode(text));
      i = e;
    }
    return root.kids;
  }

  /* ---------- 2. Look up {{ values }} ---------- */

  const EXPR = /\{\{\s*([^}]+?)\s*\}\}/g;
  function lookup(scope, path) {
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    let v = scope;
    for (const part of path.split('.')) { if (v == null) return undefined; v = v[part]; }
    return v;
  }
  function interp(str, scope) {
    const whole = str.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
    if (whole) return lookup(scope, whole[1]);
    return str.replace(EXPR, (_, p) => { const v = lookup(scope, p); return v == null ? '' : String(v); });
  }
  const hasExpr = s => s.indexOf('{{') >= 0;

  /* ---------- 3. Styles: inline style objects + hover/focus classes ---------- */

  const camel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  function styleObject(str) {
    const out = {};
    let depth = 0, start = 0;
    const parts = [];
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (c === '(') depth++;
      else if (c === ')') depth--;
      else if (c === ';' && depth === 0) { parts.push(str.slice(start, i)); start = i + 1; }
    }
    parts.push(str.slice(start));
    for (const p of parts) {
      const k = p.indexOf(':');
      if (k < 0) continue;
      const prop = p.slice(0, k).trim(), val = p.slice(k + 1).trim();
      if (!prop || val === '') continue;
      if (prop.startsWith('--')) out[prop] = val;
      else out[camel(prop.replace(/^-ms-/, 'ms-').replace(/^-(webkit|moz)-/, (m, v) => v.charAt(0).toUpperCase() + v.slice(1) + '-'))] = val;
    }
    return out;
  }
  const stateSheet = document.createElement('style');
  stateSheet.id = 'agna-state-styles';
  document.head.appendChild(stateSheet);
  const stateClasses = new Map();
  function stateClass(kind, decls) {
    const key = kind + '|' + decls;
    if (stateClasses.has(key)) return stateClasses.get(key);
    const cls = 'dc-' + kind + '-' + stateClasses.size;
    const body = decls.split(';').map(d => d.trim()).filter(Boolean).map(d => d.replace(/\s*!important\s*$/, '') + ' !important').join(';');
    const sel = kind === 'hover' ? '.' + cls + ':hover' : '.' + cls + ':focus';
    stateSheet.appendChild(document.createTextNode(sel + '{' + body + '}\n'));
    stateClasses.set(key, cls);
    return cls;
  }

  /* ---------- 4. Attributes -> React props ---------- */

  const EVENTS = { onclick: 'onClick', onchange: 'onChange', oninput: 'onInput', onkeydown: 'onKeyDown', onkeyup: 'onKeyUp', ondoubleclick: 'onDoubleClick', ondblclick: 'onDoubleClick', onsubmit: 'onSubmit', onfocus: 'onFocus', onblur: 'onBlur', onmouseenter: 'onMouseEnter', onmouseleave: 'onMouseLeave' };
  const RENAME = { class: 'className', for: 'htmlFor', inputmode: 'inputMode', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength', autocomplete: 'autoComplete', autofocus: 'autoFocus', colspan: 'colSpan', rowspan: 'rowSpan', viewbox: 'viewBox', crossorigin: 'crossOrigin', srcset: 'srcSet', allowfullscreen: 'allowFullScreen', playsinline: 'playsInline', contenteditable: 'contentEditable', spellcheck: 'spellCheck' };
  const BOOL = new Set(['disabled', 'checked', 'selected', 'multiple', 'required', 'autoFocus', 'readOnly', 'hidden', 'playsInline', 'muted', 'autoPlay']);

  function propsFor(node, scope) {
    const props = {};
    const classes = [];
    for (const [rawName, rawVal] of node.attrs) {
      if (rawName.startsWith('hint-')) continue;
      const lower = rawName.toLowerCase();
      const val = hasExpr(rawVal) ? interp(rawVal, scope) : rawVal;
      if (lower === 'style') { props.style = styleObject(String(val ?? '')); continue; }
      if (lower === 'style-hover') { classes.push(stateClass('hover', String(val ?? ''))); continue; }
      if (lower === 'style-focus') { classes.push(stateClass('focus', String(val ?? ''))); continue; }
      if (lower === 'class') { classes.push(String(val ?? '')); continue; }
      let name;
      if (lower.startsWith('sc-camel-')) name = camel(lower.slice(9));
      else if (EVENTS[lower]) name = EVENTS[lower];
      else if (RENAME[lower]) name = RENAME[lower];
      else if (lower.startsWith('data-') || lower.startsWith('aria-')) name = lower;
      else if (lower.indexOf('-') > 0) name = camel(lower);
      else name = rawName;
      if (/^on[A-Z]/.test(name)) { if (typeof val === 'function') props[name] = val; continue; }
      if (name === 'value') { props.value = val == null ? '' : val; continue; }
      if (BOOL.has(name)) { props[name] = val === '' || val === true || val === 'true'; continue; }
      if (val === undefined || val === null || val === false) continue;
      props[name] = val;
    }
    if (classes.length) props.className = classes.join(' ');
    // Inputs that show a value but have no change handler are read-only by design.
    const tag = node.tag.toLowerCase();
    if ('value' in props && (tag === 'input' || tag === 'textarea' || tag === 'select') && !props.onChange) props.readOnly = true;
    return props;
  }

  /* ---------- 5. Render the tree with React ---------- */

  const custom = {}; // extra tags such as <live-video>, <dc-import>

  function renderList(nodes, scope) {
    const out = [];
    nodes.forEach((n, i) => {
      const r = renderNode(n, scope, i);
      if (r !== null && r !== undefined && r !== '') out.push(r);
    });
    return out;
  }

  function renderNode(node, scope, key) {
    if (typeof node === 'string') return hasExpr(node) ? (v => (v == null ? '' : typeof v === 'object' ? '' : v))(interp(node, scope)) : node;
    const tag = node.tag;
    const lower = tag.toLowerCase();
    const attr = n => { const a = node.attrs.find(x => x[0].toLowerCase() === n); return a ? a[1] : undefined; };
    if (lower === 'helmet') return null;
    if (lower === 'x-dc') return h(React.Fragment, { key }, ...renderList(node.kids, scope));
    if (lower === 'sc-if') {
      const v = interp(attr('value') || '', scope);
      return v ? h(React.Fragment, { key }, ...renderList(node.kids, scope)) : null;
    }
    if (lower === 'sc-for') {
      const list = interp(attr('list') || '', scope) || [];
      const as = attr('as') || 'item';
      return h(React.Fragment, { key }, ...list.map((item, i) => {
        const inner = Object.create(scope);
        inner[as] = item;
        inner[as + 'Index'] = i;
        return h(React.Fragment, { key: i }, ...renderList(node.kids, inner));
      }));
    }
    if (custom[lower]) {
      const props = { key };
      for (const [n, v] of node.attrs) props[camel(n.toLowerCase())] = hasExpr(v) ? interp(v, scope) : v;
      return h(custom[lower], props);
    }
    const props = propsFor(node, scope);
    props.key = key;
    const kids = renderList(node.kids, scope);
    if (lower === 'textarea' || VOID.has(lower)) return h(tag, props);
    return h(tag, props, ...kids);
  }

  /* ---------- 6. Logic classes (same shape as the design's DCLogic) ---------- */

  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(update) {
      const patch = typeof update === 'function' ? update(this.state) : update;
      if (!patch) return;
      this.state = Object.assign({}, this.state, patch);
      if (this.stateChanged) this.stateChanged(this.state);
      if (this._rerender) this._rerender();
    }
    renderVals() { return {}; }
  }

  /** Make a React component from a template + a logic class. */
  function component(templateText, Logic) {
    const tree = parse(templateText);
    return function DCComponent(props) {
      const ref = React.useRef(null);
      const [, force] = React.useReducer(x => x + 1, 0);
      if (!ref.current) ref.current = new Logic(props);
      const logic = ref.current;
      logic.props = props;
      logic._rerender = force;
      React.useEffect(() => {
        if (logic.didMount) logic.didMount();
        return () => { logic._rerender = null; if (logic.willUnmount) logic.willUnmount(); };
      }, []);
      return h(React.Fragment, null, ...renderList(tree, logic.renderVals()));
    };
  }

  window.DC = { parse, component, DCLogic, custom, h };
})();
