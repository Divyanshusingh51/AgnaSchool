/*
 * Agna School — landing page with the log in / sign up popup.
 * Layout: "tpl-landing" template in index.html.
 */
class LandingScreen extends DC.DCLogic {
  state = { modal: null, name: '', email: '', password: '', error: '', busy: false };

  async finish(promise) {
    if (this.state.busy) return;
    this.setState({ busy: true, error: '' });
    const res = await promise;
    if (res.user) { this.setState({ busy: false, modal: null, password: '' }); window.scrollTo(0, 0); this.props.onSignedIn(res.user); }
    else this.setState({ busy: false, error: res.error || 'Something went wrong. Please try again.', modal: this.state.modal || 'login' });
  }

  renderVals() {
    const s = this.state, signup = s.modal === 'signup';
    const open = mode => this.setState({ modal: mode, error: '' });
    return {
      onLanding: true,
      showModal: !!s.modal,
      openLogin: () => open('login'),
      openSignup: () => open('signup'),
      closeModal: () => this.setState({ modal: null, error: '' }),
      stop: e => e.stopPropagation(),
      google: () => this.finish(Auth.google()),
      enter: e => {
        if (e && e.preventDefault) e.preventDefault();
        this.finish(signup ? Auth.signup(s.name, s.email, s.password) : Auth.login(s.email, s.password));
      },
      isSignup: signup,
      name: s.name, onName: e => this.setState({ name: e.target.value }),
      email: s.email, onEmail: e => this.setState({ email: e.target.value }),
      password: s.password, onPassword: e => this.setState({ password: e.target.value }),
      pwAutocomplete: signup ? 'new-password' : 'current-password',
      hasError: !!s.error, error: s.error,
      modalTitle: signup ? 'Create your account' : 'Welcome back',
      modalSub: signup ? 'Join your school on Agna School.' : 'Log in to continue learning.',
      googleLabel: signup ? 'Sign up with Google' : 'Log in with Google',
      submitLabel: s.busy ? 'Please wait…' : signup ? 'Create account' : 'Log in',
      switchText: signup ? 'Already have an account?' : 'New here?',
      switchLink: signup ? 'Log in' : 'Create an account',
      switchMode: () => open(signup ? 'login' : 'signup'),
      features: [
        { label: 'Home', color: '#c2417a', tint: '#fbeef3', img: 'images/screenshots/home.jpg', title: 'Share and connect', body: 'An easy feed like the apps you already know. Post what you made, like, comment and follow topic circles such as Science Lab or Art Studio.' },
        { label: 'Classwork', color: '#3d7ea6', tint: '#e9f2f8', img: 'images/screenshots/lesson.jpg', title: 'Learn, practice, test', body: 'Every chapter is broken into a simple lesson, practice questions with hints, and a short test. Progress shows up as a % for each chapter.' },
        { label: 'Launchpad', color: '#a0741f', tint: '#f8f1e3', img: 'images/screenshots/launchpad.jpg', title: 'Try real-world skills', body: '22 paths like drones, 3D printing and coding, each with free resources, a starter shopping list and the cost in rupees.' },
        { label: 'Voice rooms', color: '#23867a', tint: '#e6f4f2', img: 'images/screenshots/voice.jpg', title: 'Study together, live', body: 'Hop into a voice room to study with friends or ask a teacher. Mute, turn on video, share your screen or raise your hand.' }
      ],
      steps: [
        { n: 1, title: 'Sign in with Google', body: 'Use your school Google account. No new passwords to remember.' },
        { n: 2, title: 'Pick your class and circles', body: 'Your subjects and chapters load for your class. Join the circles you care about.' },
        { n: 3, title: 'Learn, share and explore', body: 'Work through chapters, post your projects, join voice rooms and try a Launchpad topic.' }
      ],
      audiences: [
        { who: 'For students', color: '#2f6fde', tint: '#e8effc', points: ['Clear steps for every chapter', 'A safe place to share your work', 'Find new interests and real skills'] },
        { who: 'For teachers', color: '#1e8a4c', tint: '#e8f6ee', points: ['See chapter progress at a glance', 'Share study material in one place', 'Host live help in voice rooms'] },
        { who: 'For parents', color: '#a0741f', tint: '#f8f1e3', points: ['Clear safety and grown-up help notes', 'Know what each hobby costs in ₹', 'See what your child is learning'] }
      ]
    };
  }
}
