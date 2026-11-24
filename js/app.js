/*
 * Agna School — the main app (feed, classwork, Launchpad, events, voice rooms).
 * The layout lives in the "tpl-app" template in index.html; this file holds
 * the behaviour. Data comes from js/data.js.
 */

// Things we don't save between visits (live call state, half-typed comments).
const TRANSIENT = ['voice', 'cam', 'presenting', 'hand', 'toast', 'drafts', 'menuOpen'];

function timeAgo(ts) {
  const sec = Math.max(0, (Date.now() - ts) / 1000);
  if (sec < 60) return 'Just now';
  const min = Math.floor(sec / 60); if (min < 60) return min + (min === 1 ? ' minute ago' : ' minutes ago');
  const hr = Math.floor(min / 60); if (hr < 24) return hr + (hr === 1 ? ' hour ago' : ' hours ago');
  const d = Math.floor(hr / 24); if (d === 1) return 'Yesterday';
  if (d < 7) return d + ' days ago';
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

// Make photos small enough to keep in the browser's storage.
function shrinkImage(file, maxSide) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

class AppScreen extends DC.DCLogic {
  state = Object.assign({ evTab: 'up', evCity: 'All', evSaved: {}, lessonTab: 'learn', sideOpen: false, learnDone: false, pAns: {}, pChecked: {}, pHint: {}, tAns: {}, tSubmitted: false, openSubj: 'maths', chDone: { 'maths-0': true, 'science-0': true }, saved: {}, tab: 'highlights', filter: null, posts: INITIAL_POSTS, liked: {}, drafts: {}, draft: '', postCircle: '', newest: true, done: {}, voice: null, muted: false, deafened: false, cam: false, presenting: false, hand: false, group: 'all', track: null, joinedTracks: {}, draftPhoto: '', toast: '' }, Store.load(Auth.current().email), { voice: null, cam: false, presenting: false, hand: false, toast: '' });

  stateChanged(st) {
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => {
      const keep = {};
      for (const k of Object.keys(st)) if (!TRANSIENT.includes(k)) keep[k] = st[k];
      if (!Store.save(Auth.current().email, keep)) this.flash('Your browser storage is full. Try posting without a photo, or remove some photo posts.');
    }, 250);
  }

  flash(message) {
    clearTimeout(this._toastTimer);
    this.setState({ toast: message });
    this._toastTimer = setTimeout(() => this.setState({ toast: '' }), 4500);
  }

  willUnmount() { Media.stopAll(); clearTimeout(this._toastTimer); }


  renderVals() {
    const s = this.state;
    const tabs = [['welcome','Welcome'],['highlights','Highlights'],['assignments','Assignments'],['launchpad','Launchpad'],['events','Events']];
    const isCall = s.tab === 'call' && !!s.voice;
    const isLaunchpad = s.tab === 'launchpad';
    const user = Auth.current();
    const me = { name: user.firstName, initials: user.initials, color: user.color, muted: s.muted, cam: s.cam, hand: s.hand, isMe: true, stream: s.cam ? 'cam' : '' };
    const peopleOf = v => s.voice === v.id ? [...v.people, me] : v.people;
    const activeV = VOICE.find(v => v.id === s.voice);
    const ring = p => p.speaking && !p.muted ? '0 0 0 2px #22c55e' : 'none';
    const ctl = (on, onBg, onFg, label) => ({ bg: on ? onBg : '#2b2e33', fg: on ? onFg : '#fff', label });
    const tr = s.track && TRACKS.find(t => t.id === s.track);
    const shade = 'linear-gradient(180deg,rgba(10,12,15,.25) 0%,rgba(10,12,15,.2) 35%,rgba(10,12,15,.88) 100%)';
    const LEVEL = { Easy: '#1e8a4c', Medium: '#a0741f', Hard: '#c2410c' };
    const vis = TRACKS.filter(t => s.group === 'all' || t.group === s.group);
    let posts = s.posts.filter(p => !s.filter || p.circle === s.filter);
    posts = [...posts].sort((a, b) => s.newest ? b.ts - a.ts : a.ts - b.ts);
    const canPost = (s.draft.trim() || s.draftPhoto) && s.postCircle;
    const assignmentRows = ASSIGNMENTS.map(a => {
      const d = !!s.done[a.id];
      return { ...a, circleName: cName(a.circle), color: cColor(a.circle), btnLabel: d ? 'Turned in ✓' : 'Mark done',
        btnBg: d ? '#e8f6ee' : '#fff', btnFg: d ? '#1e8a4c' : '#1c1f24', btnBorder: d ? '#bfe5cf' : '#d8dce2',
        toggle: () => this.setState(st => ({ done: { ...st.done, [a.id]: !st.done[a.id] } })) };
    });
    const navKeys = { home: 'highlights', classwork: 'assignments', launchpad: 'launchpad', events: 'events', welcome: 'welcome' };
    const nav = {}; Object.entries(navKeys).forEach(([k, t]) => { const on = s.tab === t || (t === 'assignments' && s.tab === 'lesson'); nav[k] = { bg: on ? '#f1f3f5' : 'transparent', weight: on ? 800 : 500, stroke: on ? 2.4 : 1.9, go: () => { this.setState({ tab: t, track: t === 'launchpad' ? null : s.track }); window.scrollTo(0, 0); } }; });
    const big = id => 'url(' + IMG[id] + ')';
    const POSTIMG = { science: big('astro'), code: big('microsites') };
    const list = tr && vis.includes(tr) ? vis : TRACKS;
    const ti = tr ? list.indexOf(tr) : -1;
    const nextT = tr ? list[(ti + 1) % list.length] : null, prevT = tr ? list[(ti - 1 + list.length) % list.length] : null;
    const goTrack = t => { this.setState({ track: t.id }); window.scrollTo(0, 0); };
    const sendComment = p => { const t = (s.drafts[p.id] || '').trim(); if (!t) return;
      this.setState(st => ({ drafts: { ...st.drafts, [p.id]: '' }, posts: st.posts.map(x => x.id === p.id ? { ...x, comments: [...x.comments, { author: user.firstName, initials: user.initials, text: t }] } : x) })); };
    const dueCount = ASSIGNMENTS.filter(a => !s.done[a.id]).length;
    const top = () => window.scrollTo(0, 0);
    const openLesson = () => { this.setState({ tab: 'lesson', lessonTab: 'learn', sideOpen: false }); top(); };
    const pOk = i => s.pChecked[i] && Number(String(s.pAns[i] ?? '').trim()) === PRACTICE[i].a;
    const pCorrect = PRACTICE.filter((_, i) => pOk(i)).length;
    const tScore = TEST.filter((t, i) => s.tAns[i] === t.a).length;
    const tAnswered = Object.keys(s.tAns).length;
    return {
      me: { name: user.name, firstName: user.firstName, initials: user.initials, color: user.color },
      logout: () => { Media.stopAll(); this.props.onLogout(); },
      hasToast: !!s.toast, toast: s.toast,
      drawerClass: s.menuOpen ? 'open' : '',
      openMenu: () => this.setState({ menuOpen: true, sideOpen: true }),
      closeMenu: () => this.setState({ menuOpen: false }),
      // On phones the menu slides in; close it after picking somewhere to go.
      sideClick: e => { if (s.menuOpen && e.target.closest && e.target.closest('nav button, .agna-close-menu')) this.setState({ menuOpen: false }); },
      isLesson: s.tab === 'lesson', inLesson: s.tab === 'lesson',
      fullSide: s.tab !== 'lesson' || s.sideOpen, railSide: s.tab === 'lesson' && !s.sideOpen,
      expandSide: () => this.setState({ sideOpen: true }), collapseSide: () => this.setState({ sideOpen: false }),
      openLesson, backToClasswork: () => { this.setState({ tab: 'assignments' }); top(); },
      lessonTabs: [['learn', 'Learn'], ['practice', 'Practice'], ['test', 'Test']].map(([k, label], i) => { const on = s.lessonTab === k;
        const done = k === 'learn' ? s.learnDone : k === 'practice' ? pCorrect === PRACTICE.length : s.tSubmitted;
        return { label, num: done ? '✓' : i + 1, bg: on ? '#fff' : 'transparent', fg: on ? '#1c1f24' : '#5b616a', shadow: on ? '0 1px 3px rgba(0,0,0,.12)' : 'none',
          numBg: done ? '#1e8a4c' : on ? '#1c1f24' : '#a9aeb6', go: () => { this.setState(st => ({ lessonTab: k, learnDone: st.learnDone || (st.lessonTab === 'learn' && k !== 'learn') })); top(); } }; }),
      isLearn: s.lessonTab === 'learn', isPractice: s.lessonTab === 'practice', isTest: s.lessonTab === 'test',
      goPractice: () => { this.setState({ lessonTab: 'practice', learnDone: true }); top(); },
      goTest: () => { this.setState({ lessonTab: 'test' }); top(); },
      practiceScore: pCorrect + ' / ' + PRACTICE.length,
      practiceRows: PRACTICE.map((p, i) => { const checked = !!s.pChecked[i], ok = pOk(i);
        const check = () => { if (String(s.pAns[i] ?? '').trim()) this.setState(st => ({ pChecked: { ...st.pChecked, [i]: true } })); };
        return { n: i + 1, q: p.q, hint: p.hint, val: s.pAns[i] ?? '', showHint: !!s.pHint[i], hintLabel: s.pHint[i] ? 'Hide hint' : 'Show hint',
          onInput: e => { const v = e.target.value; this.setState(st => ({ pAns: { ...st.pAns, [i]: v }, pChecked: { ...st.pChecked, [i]: false } })); },
          onKey: e => { if (e.key === 'Enter') check(); }, check,
          toggleHint: () => this.setState(st => ({ pHint: { ...st.pHint, [i]: !st.pHint[i] } })),
          showResult: checked, border: checked ? (ok ? '#1e8a4c' : '#e5484d') : '#e6e8eb',
          fbBg: ok ? '#e8f6ee' : '#fdecec', fbFg: ok ? '#1e7a45' : '#b42318', fbText: ok ? 'Correct! x = ' + p.a : 'Not quite. Try again, or open the hint.' }; }),
      testRows: TEST.map((t, i) => ({ n: i + 1, q: t.q, why: t.why, showWhy: s.tSubmitted,
        opts: t.opts.map((label, j) => { const sel = s.tAns[i] === j; let bg = '#fff', bd = '#e0e3e7';
          if (!s.tSubmitted && sel) { bg = '#e8effc'; bd = '#2f6fde'; }
          if (s.tSubmitted) { if (j === t.a) { bg = '#e8f6ee'; bd = '#1e8a4c'; } else if (sel) { bg = '#fdecec'; bd = '#e5484d'; } }
          return { label, letter: 'ABCD'[j], bg, bd, pick: () => { if (!s.tSubmitted) this.setState(st => ({ tAns: { ...st.tAns, [i]: j } })); } }; }) })),
      tSubmitted: s.tSubmitted, notSubmitted: !s.tSubmitted, tAnsweredLabel: tAnswered + ' / ' + TEST.length,
      submitBg: tAnswered === TEST.length ? '#2f6fde' : '#a9c3ef',
      submitTest: () => { if (tAnswered === TEST.length) { this.setState({ tSubmitted: true }); top(); } },
      scoreLabel: tScore + ' / ' + TEST.length,
      scoreMsg: tScore === TEST.length ? 'Perfect score!' : tScore >= 3 ? 'Great job! Almost there.' : 'Good try! Go back to Learn and try again.',
      retake: () => { this.setState({ tAns: {}, tSubmitted: false }); top(); },
      nav, dueCount, hasDue: dueCount > 0,
      storyRows: [{ id: null, name: 'All', short: 'All posts', color: '#1c1f24' }, ...CIRCLES].map(c => { const on = s.filter === c.id;
        return { initial: c.id ? c.name[0] : '★', short: c.short || c.name.split(' ')[0], color: c.color, weight: on ? 800 : 500,
          ring: on ? '#2f6fde' : c.unread ? 'linear-gradient(45deg,#f4a261,#e07a5f,#c2417a)' : '#d8dce2',
          select: () => this.setState({ filter: c.id, postCircle: c.id || s.postCircle }) }; }),
      tabRows: tabs.map(([id, label]) => ({ label, bg: s.tab === id ? '#f1f3f5' : 'transparent', weight: s.tab === id ? 700 : 500, dot: id === 'assignments',
        select: () => this.setState({ tab: id }) })),
      isHighlights: s.tab === 'highlights', isAssignments: s.tab === 'assignments', isWelcome: s.tab === 'welcome', isEvents: s.tab === 'events',
      circleRows: CIRCLES.map(c => ({ ...c, initial: c.name[0], hasUnread: c.unread > 0, bg: s.filter === c.id ? '#eef3fc' : 'transparent', weight: c.unread ? 700 : 600,
        select: () => this.setState({ filter: c.id, tab: 'highlights', postCircle: c.id }) })),
      showAll: () => this.setState({ filter: null }),
      hasFilter: !!s.filter, filterName: cName(s.filter),
      sortLabel: s.newest ? 'Newest to oldest' : 'Oldest to newest',
      toggleSort: () => this.setState(st => ({ newest: !st.newest })),
      draft: s.draft, onDraft: e => this.setState({ draft: e.target.value }),
      postCircle: s.postCircle, onPostCircle: e => this.setState({ postCircle: e.target.value }),
      postBtnBg: canPost ? '#2f6fde' : '#e3edfc', postBtnFg: canPost ? '#fff' : '#8fb2ea',
      submitPost: () => { if (!canPost) return;
        this.setState(st => ({ draft: '', draftPhoto: '', posts: [{ id: Date.now(), author: user.name, initials: user.initials, avatarColor: user.color, role: 'Student', circle: st.postCircle, ts: Date.now(), time: 'Just now', likes: 0, hasImage: !!st.draftPhoto, photo: st.draftPhoto || '', body: st.draft.trim(), comments: [], mine: true }, ...st.posts] })); },
      pickPhoto: () => { const el = document.getElementById('agna-photo-input'); if (el) el.click(); },
      onPhoto: e => { const file = e.target.files && e.target.files[0]; e.target.value = ''; if (!file) return;
        shrinkImage(file, 900).then(url => this.setState({ draftPhoto: url })).catch(() => this.flash('That file could not be opened as a picture.')); },
      removePhoto: () => this.setState({ draftPhoto: '' }),
      hasDraftPhoto: !!s.draftPhoto, draftPhoto: s.draftPhoto, photoBtnBg: s.draftPhoto ? '#e3edfc' : '#f3f4f6',
      postRows: posts.map(p => {
        const liked = !!s.liked[p.id];
        const n = p.likes + (liked ? 1 : 0), hasText = !!(s.drafts[p.id] || '').trim();
        const time = p.ts > 1e12 ? timeAgo(p.ts) : p.time;
        return { ...p, circleName: cName(p.circle), imageBg: p.photo ? '#f3f4f6' : BG[p.circle], image: p.photo ? 'url("' + p.photo + '")' : (POSTIMG[p.circle] || 'none'), time, likes: n, commentCount: p.comments.length,
          meta: (p.role === 'Teacher' ? 'Teacher · ' : '') + cName(p.circle) + ' · ' + time, likesLabel: n === 1 ? '1 like' : n + ' likes',
          heartFill: liked ? '#e5484d' : 'none', heartStroke: liked ? '#e5484d' : '#1c1f24', saveFill: s.saved[p.id] ? '#1c1f24' : 'none',
          save: () => this.setState(st => ({ saved: { ...st.saved, [p.id]: !st.saved[p.id] } })),
          inputId: 'c-' + p.id, focusComment: () => { const el = document.getElementById('c-' + p.id); if (el) el.focus(); },
          send: () => sendComment(p), sendColor: hasText ? '#2f6fde' : '#a9c3ef',
          likeColor: liked ? '#2f6fde' : '#5b616a', likeWeight: liked ? 700 : 500,
          like: () => this.setState(st => ({ liked: { ...st.liked, [p.id]: !st.liked[p.id] } })),
          draft: s.drafts[p.id] || '',
          onDraft: e => { const v = e.target.value; this.setState(st => ({ drafts: { ...st.drafts, [p.id]: v } })); },
          onKey: e => { if (e.key === 'Enter') sendComment(p); } };
      }),
      assignmentRows,
      dueSoon: assignmentRows.filter(a => !s.done[a.id]).slice(0, 3),
      goAssignments: () => this.setState({ tab: 'assignments' }),
      shots: Object.fromEntries(["home","post","classwork","launchpad","voice"].map(n => [n, 'images/screenshots/' + n + '.jpg'])),
      events: EVENTS,
      ...(() => { const today = new Date(new Date().toDateString()), days = d => Math.ceil((new Date(d) - today) / 864e5);
        const inCity = e => s.evCity === 'All' || e.city === s.evCity;
        const tabs = [['up', 'Coming up'], ['annual', 'Every year'], ['comp', 'Competitions']];
        const rows = EV.filter(e => e.g === s.evTab && inCity(e)).sort((a, b) => a.date.localeCompare(b.date)).map(e => {
          const c = EV_TYPE_COLOR[e.type] || '#2f6fde', dl = e.deadline ? days(e.deadline) : null, saved = !!s.evSaved[e.title];
          return { ...e, color: c, tint: c + '14', hasWho: !!e.who, daySize: /^\d+$/.test(e.day) ? '19px' : '15px',
            hasDeadline: dl !== null && dl >= 0, deadline: dl === 0 ? 'Register today' : 'Register in ' + dl + (dl === 1 ? ' day' : ' days'),
            dlFg: dl !== null && dl <= 14 ? '#b42318' : '#1f55b3', dlBg: dl !== null && dl <= 14 ? '#fdecec' : '#e8effc',
            rLabel: saved ? 'Saved ✓' : 'Remind me', rBg: saved ? '#e8f6ee' : '#fff', rFg: saved ? '#1e7a45' : '#1c1f24', rBd: saved ? '#bfe5cf' : '#d8dce2',
            remind: () => this.setState(st => ({ evSaved: { ...st.evSaved, [e.title]: !st.evSaved[e.title] } })) }; });
        return { evRows: rows, evEmpty: rows.length === 0,
          evTabs: tabs.map(([k, label]) => { const on = s.evTab === k; return { label, count: EV.filter(e => e.g === k && inCity(e)).length,
            bg: on ? '#fff' : 'transparent', fg: on ? '#1c1f24' : '#5b616a', shadow: on ? '0 1px 3px rgba(0,0,0,.12)' : 'none', countBg: on ? '#e8effc' : '#d8dce2', go: () => this.setState({ evTab: k }) }; }),
          evCities: ['All', 'Chennai', 'Bengaluru', 'Online'].map(c => { const on = s.evCity === c; return { label: c,
            bg: on ? '#1c1f24' : '#fff', fg: on ? '#fff' : '#3d434b', bd: on ? '#1c1f24' : '#d8dce2', go: () => this.setState({ evCity: c }) }; }) }; })(),
      isCall, isLaunchpad,
      mainBasis: s.tab === 'assignments' ? '300px' : '480px',
      mainMax: isCall || isLaunchpad ? '1100px' : s.tab === 'lesson' ? '820px' : s.tab === 'welcome' ? '880px' : '640px',
      showRail: s.tab === 'highlights' || s.tab === 'events',
      subjectRows: SUBJECTS.map(sb => { const open = s.openSubj === sb.id;
        const lessonPct = Math.round(((s.learnDone ? 1 : 0) + pCorrect / PRACTICE.length + (s.tSubmitted ? tScore / TEST.length : 0)) / 3 * 100);
        const chPct = i => { const k = sb.id + '-' + i; return s.chDone[k] ? 100 : (sb.id === 'maths' && i === 1) ? lessonPct : (CH_PROG[k] || 0); };
        const avg = Math.round(sb.chapters.reduce((n, _, i) => n + chPct(i), 0) / sb.chapters.length);
        return { ...sb, level: LEVEL_OF[sb.id], initial: sb.name[0], open, chev: open ? 'rotate(90deg)' : 'none', progress: avg + '%', pct: avg + '%',
          toggle: () => this.setState({ openSubj: open ? null : sb.id }),
          chapters: sb.chapters.map((title, i) => { const k = sb.id + '-' + i, d = !!s.chDone[k];
            const hasLesson = sb.id === 'maths' && i === 1;
            const cp = chPct(i);
            return { n: i + 1, title, hasLesson, pct: cp + '%', pctFg: cp === 100 ? '#1e7a45' : cp > 0 ? '#1f55b3' : '#8a9099', pctBg: cp === 100 ? '#e8f6ee' : cp > 0 ? '#e8effc' : '#f3f4f6', weight: hasLesson ? 700 : 500, rowBg: hasLesson ? '#eef3fc' : 'transparent', open: hasLesson ? openLesson : () => this.setState(st => ({ chDone: { ...st.chDone, [k]: !st.chDone[k] } })), mark: d ? '✓' : '', boxBg: d ? sb.color : '#fff', boxBorder: d ? sb.color : '#c4c8ce', fg: d ? '#6b7280' : '#1c1f24',
              toggle: () => this.setState(st => ({ chDone: { ...st.chDone, [k]: !st.chDone[k] } })) }; }) }; }),
      voiceOnline: VOICE.reduce((n, v) => n + peopleOf(v).length, 0),
      voiceRows: VOICE.map(v => { const j = s.voice === v.id; return { name: v.name, bg: j ? '#eef3fc' : 'transparent', weight: j ? 700 : 600,
        btnLabel: j ? "You're in" : 'Join', btnFg: j ? '#1e8a4c' : '#fff', btnBg: j ? '#e8f6ee' : '#2f6fde', btnBorder: j ? '#bfe5cf' : '#cfdcf3', faces: peopleOf(v).slice(0, 3),
        people: peopleOf(v).map(p => ({ ...p, ring: ring(p) })),
        join: () => { if (!j) Media.stopAll(); this.setState({ voice: v.id, tab: 'call', ...(j ? {} : { cam: false, presenting: false, hand: false }) }); } }; }),
      inVoice: !!s.voice, voiceName: activeV ? activeV.name : '',
      openCall: () => this.setState({ tab: 'call' }),
      goFeed: () => this.setState({ tab: 'highlights' }),
      leave: () => { Media.stopAll(); this.setState(st => ({ voice: null, cam: false, presenting: false, hand: false, tab: st.tab === 'call' ? 'highlights' : st.tab })); },
      muted: s.muted, unmuted: !s.muted, deafened: s.deafened, presenting: s.presenting,
      statusLabel: s.voice ? 'In voice' + (s.muted ? ' · muted' : '') : 'Online',
      toggleMute: () => this.setState(st => ({ muted: !st.muted, deafened: st.muted ? false : st.deafened })),
      toggleDeafen: () => this.setState(st => ({ deafened: !st.deafened, muted: !st.deafened ? true : st.muted })),
      toggleCam: () => { if (s.cam) { Media.stop('cam'); this.setState({ cam: false }); return; }
        Media.startCamera().then(() => this.setState({ cam: true })).catch(err => this.flash(Media.explain(err, 'camera'))); },
      togglePresent: () => { if (s.presenting) { Media.stop('screen'); this.setState({ presenting: false }); return; }
        Media.startScreen(() => this.setState({ presenting: false })).then(() => this.setState({ presenting: true })).catch(err => this.flash(Media.explain(err, 'screen'))); },
      screenStream: s.presenting ? 'screen' : '',
      toggleHand: () => this.setState(st => ({ hand: !st.hand })),
      side: { micFg: s.muted ? '#e5484d' : '#5b616a', deafFg: s.deafened ? '#e5484d' : '#5b616a',
        camBg: s.cam ? '#1c1f24' : '#fff', camFg: s.cam ? '#fff' : '#3d434b', presBg: s.presenting ? '#2f6fde' : '#fff', presFg: s.presenting ? '#fff' : '#3d434b' },
      ctrl: { mute: ctl(s.muted, '#e5484d', '#fff', s.muted ? 'Unmute' : 'Mute'), cam: ctl(s.cam, '#fff', '#16181b', s.cam ? 'Stop video' : 'Video'),
        pres: ctl(s.presenting, '#2f6fde', '#fff', s.presenting ? 'Presenting' : 'Present'), hand: ctl(s.hand, '#d4a24c', '#1c1f24', s.hand ? 'Lower hand' : 'Raise hand'),
        deaf: ctl(s.deafened, '#e5484d', '#fff', s.deafened ? 'Undeafen' : 'Deafen') },
      tiles: activeV ? peopleOf(activeV).map(p => ({ ...p, muted: !!p.muted, cam: !!p.cam, hand: !!p.hand, isMe: !!p.isMe, stream: p.stream || '', showAvatar: !p.cam, ring: ring(p),
        bg: p.cam ? 'repeating-linear-gradient(135deg,#2a2d32 0 10px,#30343a 10px 20px)' : '#24272b' })) : [],
      tileCount: activeV ? peopleOf(activeV).length : 0,
      groupChips: [['all', 'All'], ...Object.entries(GROUPS).map(([k, g]) => [k, g.label])].map(([k, label]) => { const on = s.group === k;
        return { label, count: k === 'all' ? TRACKS.length : TRACKS.filter(t => t.group === k).length, bg: on ? '#1c1f24' : '#fff', fg: on ? '#fff' : '#3d434b', border: on ? '#1c1f24' : '#d8dce2',
          select: () => this.setState({ group: k }) }; }),
      trackRows: vis.map(t => ({ ...t, color: GROUPS[t.group].color, groupName: GROUPS[t.group].label, joined: !!s.joinedTracks[t.id],
        bgImage: shade + ', url(' + IMG[t.id] + ')',
        open: () => goTrack(t) })),
      noTrack: !tr, hasTrack: !!tr,
      closeTrack: () => { this.setState({ track: null }); window.scrollTo(0, 0); },
      track: tr ? (() => { const j = !!s.joinedTracks[tr.id], g = GROUPS[tr.group]; return { ...tr, color: g.color, groupName: g.label, circleName: cName(g.circle),
        heroImage: shade + ', url(' + IMG[tr.id] + ')',
        steps: tr.steps.map((text, i) => ({ n: i + 1, text })),
        posLabel: (ti + 1) + ' of ' + list.length, goNext: () => goTrack(nextT), goPrev: () => goTrack(prevT),
        nextTitle: nextT.title, nextColor: GROUPS[nextT.group].color, nextImage: 'url(' + IMG[nextT.id] + ')',
        learnRows: tr.learn.map(([name, what, url]) => ({ name, what, url })),
        buyRows: tr.buy.map(([item, price, need]) => ({ item, price, tag: need ? 'Must have' : 'Optional', tagBg: need ? '#e3edfc' : '#f1f3f5', tagFg: need ? '#1f55b3' : '#5b616a' })),
        hasBuy: tr.buy.length > 0, noBuy: tr.buy.length === 0,
        facts: [{ label: 'Money to start', value: tr.budget, color: '#1c1f24' }, { label: 'How hard', value: tr.level, color: LEVEL[tr.level] },
          { label: 'Time needed', value: tr.time, color: '#1c1f24' }, { label: 'Good for ages', value: tr.age, color: '#1c1f24' }, { label: 'Grown-up help', value: tr.sup, color: '#1c1f24' }],
        btnLabel: j ? 'Joined ✓' : 'I want to try this', btnBg: j ? '#e8f6ee' : '#fff', btnFg: j ? '#1e8a4c' : '#1c1f24',
        toggleJoin: () => this.setState(st => ({ joinedTracks: { ...st.joinedTracks, [tr.id]: !st.joinedTracks[tr.id] } })),
        discuss: () => this.setState({ tab: 'highlights', filter: g.circle, postCircle: g.circle, track: null }) }; })() : {}
    };
  }
}
