/*
 * Agna School — camera and screen sharing in voice rooms.
 *
 * "Video" really turns on your webcam and "Present" really shares your
 * screen, so you see yourself in the room. The other people in the rooms
 * are sample classmates: sending live video between real users needs a
 * signalling server, which GitHub Pages can't run (see README.md).
 */
(function () {
  'use strict';
  const h = React.createElement;
  const streams = {};
  const listeners = new Set();
  const changed = () => listeners.forEach(fn => fn());

  const Media = {
    streams,
    async startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('unsupported');
      Media.stop('cam');
      streams.cam = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      changed();
    },
    async startScreen(onEnded) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) throw new Error('unsupported');
      Media.stop('screen');
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      // If the student clicks the browser's own "Stop sharing" button.
      s.getVideoTracks().forEach(t => t.addEventListener('ended', () => { if (streams.screen === s) { delete streams.screen; changed(); if (onEnded) onEnded(); } }));
      streams.screen = s;
      changed();
    },
    stop(key) {
      const s = streams[key];
      if (s) { s.getTracks().forEach(t => t.stop()); delete streams[key]; changed(); }
    },
    stopAll() { Object.keys(streams).forEach(Media.stop); },
    explain(err, what) {
      const name = err && err.name;
      if (err && err.message === 'unsupported') return 'This browser can’t share your ' + what + '. Try Chrome, Edge or Firefox on a computer.';
      if (!window.isSecureContext) return 'Your ' + what + ' only works on a secure (https) site. It will work once the site is on GitHub Pages.';
      if (name === 'NotAllowedError' || name === 'SecurityError') return what === 'camera' ? 'Camera access was blocked. Allow it in the browser’s address bar and try again.' : 'Screen sharing was cancelled.';
      if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'No camera was found on this device.';
      if (name === 'NotReadableError') return 'Your camera is being used by another app. Close it and try again.';
      return 'Could not start your ' + what + '. Please try again.';
    }
  };

  /* <live-video stream="cam|screen" mirror fit label> used by the templates. */
  function LiveVideo(props) {
    const [, force] = React.useReducer(x => x + 1, 0);
    React.useEffect(() => { listeners.add(force); return () => listeners.delete(force); }, []);
    const ref = React.useRef(null);
    const stream = props.stream ? streams[props.stream] : null;
    React.useEffect(() => { if (ref.current && ref.current.srcObject !== stream) ref.current.srcObject = stream || null; });
    if (!stream) {
      return props.label ? h('div', { style: { position: 'relative', fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: '#8a9099' } }, props.label) : null;
    }
    return h('video', {
      ref, autoPlay: true, muted: true, playsInline: true,
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: props.fit || 'cover', background: '#000', transform: props.mirror === true || props.mirror === 'true' ? 'scaleX(-1)' : 'none' }
    });
  }

  DC.custom['live-video'] = LiveVideo;
  window.Media = Media;
})();
