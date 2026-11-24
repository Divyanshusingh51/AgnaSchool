/*
 * Agna School — start-up. Shows the landing page, or the app if someone is
 * already signed in on this browser.
 */
(function () {
  'use strict';
  const h = React.createElement;
  const tpl = id => document.getElementById(id).textContent;
  const Landing = DC.component(tpl('tpl-landing'), LandingScreen);
  const App = DC.component(tpl('tpl-app'), AppScreen);

  function Root() {
    const [user, setUser] = React.useState(() => Auth.current());
    React.useEffect(() => {
      document.title = user ? 'Agna School' : 'Agna School — Learn, share and try new things';
      document.body.style.background = '#f3f4f6';
    }, [user]);
    if (!user) return h(Landing, { onSignedIn: u => setUser(u) });
    // key: a different account gets a fresh app with its own saved progress
    return h(App, { key: user.email, onLogout: () => { Auth.logout(); setUser(null); window.scrollTo(0, 0); } });
  }

  ReactDOM.createRoot(document.getElementById('root')).render(h(Root));
})();
