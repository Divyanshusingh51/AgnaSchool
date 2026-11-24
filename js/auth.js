/*
 * Agna School — accounts and saved progress.
 *
 * GitHub Pages only serves files; it has no server or database. So accounts
 * and progress are kept in this browser's localStorage:
 *   - each account's password is stored as a salted SHA-256 hash, never as text
 *   - progress (posts, likes, chapter ticks, test scores…) is saved per account
 * A student who signs in on another device starts fresh there.
 * To share data between devices you'd add a backend such as Firebase or
 * Supabase — see README.md.
 */
(function () {
  'use strict';
  const USERS = 'agna.users';
  const SESSION = 'agna.session';
  const COLORS = ['#3d7ea6', '#2a9d8f', '#b5838d', '#e07a5f', '#8d6a9f', '#d4a24c', '#5f64b8', '#4f7f3f', '#c2417a'];

  const read = (k, fallback) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };

  function colorFor(email) {
    let n = 0;
    for (const ch of email) n = (n * 31 + ch.charCodeAt(0)) >>> 0;
    return COLORS[n % COLORS.length];
  }
  function profile(u) {
    const words = u.name.trim().split(/\s+/);
    const initials = ((words[0] || '?')[0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
    return { email: u.email, name: u.name, firstName: words[0], initials, color: colorFor(u.email), via: u.via || 'email' };
  }

  async function hash(password, salt) {
    const data = new TextEncoder().encode(salt + ':' + password);
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Very old browsers: a simple fallback so the site still works.
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (const b of data) { h1 = Math.imul(h1 ^ b, 2654435761); h2 = Math.imul(h2 ^ b, 1597334677); }
    return ((h2 >>> 0).toString(16) + (h1 >>> 0).toString(16));
  }
  const randomSalt = () => Array.from(crypto.getRandomValues(new Uint8Array(12))).map(b => b.toString(16).padStart(2, '0')).join('');
  const cleanEmail = e => String(e || '').trim().toLowerCase();
  const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const Auth = {
    current() {
      const email = read(SESSION, null);
      const u = email && read(USERS, {})[email];
      return u ? profile(u) : null;
    },

    async signup(name, email, password) {
      name = String(name || '').trim();
      email = cleanEmail(email);
      if (!name) return { error: 'Please enter your name.' };
      if (!validEmail(email)) return { error: 'Please enter a valid email address.' };
      if (String(password || '').length < 6) return { error: 'Your password needs at least 6 characters.' };
      const users = read(USERS, {});
      if (users[email]) return { error: 'An account with this email already exists. Try logging in.' };
      const salt = randomSalt();
      users[email] = { name, email, salt, hash: await hash(password, salt), created: Date.now() };
      if (!write(USERS, users)) return { error: 'Your browser blocked saving. Turn off private browsing and try again.' };
      write(SESSION, email);
      return { user: profile(users[email]) };
    },

    async login(email, password) {
      email = cleanEmail(email);
      if (!validEmail(email)) return { error: 'Please enter a valid email address.' };
      if (!password) return { error: 'Please enter your password.' };
      const u = read(USERS, {})[email];
      if (!u || !u.hash) return { error: u ? 'This account uses Google. Use the Google button.' : 'No account found with that email. Create one first.' };
      if ((await hash(password, u.salt)) !== u.hash) return { error: 'That password is not right. Try again.' };
      write(SESSION, email);
      return { user: profile(u) };
    },

    /* Google sign-in. Needs googleClientId in js/config.js (see README). */
    google() {
      const clientId = (window.AGNA_CONFIG || {}).googleClientId;
      if (!clientId) return Promise.resolve({ error: 'Google sign-in isn’t set up on this site yet. Please use your email for now.' });
      return loadGoogle().then(() => new Promise(resolve => {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: async resp => {
            if (resp.error || !resp.access_token) return resolve({ error: 'Google sign-in was cancelled.' });
            try {
              const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: 'Bearer ' + resp.access_token } });
              const info = await r.json();
              const email = cleanEmail(info.email);
              if (!email) return resolve({ error: 'Google did not share an email address.' });
              const users = read(USERS, {});
              users[email] = Object.assign({ created: Date.now() }, users[email], { email, name: users[email] ? users[email].name : (info.name || email.split('@')[0]), via: 'google' });
              write(USERS, users);
              write(SESSION, email);
              resolve({ user: profile(users[email]) });
            } catch (e) { resolve({ error: 'Could not reach Google. Check your internet and try again.' }); }
          },
          error_callback: () => resolve({ error: 'Google sign-in was closed before finishing.' })
        });
        client.requestAccessToken();
      })).catch(() => ({ error: 'Could not load Google sign-in. Check your internet and try again.' }));
    },

    logout() { try { localStorage.removeItem(SESSION); } catch (e) { /* ignore */ } }
  };

  let googlePromise = null;
  function loadGoogle() {
    if (window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
    if (!googlePromise) googlePromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.onload = resolve;
      s.onerror = () => { googlePromise = null; reject(); };
      document.head.appendChild(s);
    });
    return googlePromise;
  }

  /* Saved progress, one bucket per account. */
  const Store = {
    load(email) { return read('agna.state.' + email, {}) || {}; },
    save(email, state) { return write('agna.state.' + email, state); }
  };

  window.Auth = Auth;
  window.Store = Store;
})();
