# Agna School

A website for students to learn, share and try new things: a social feed with
topic circles, Classwork (Learn → Practice → Test), 22 Launchpad real-world
skills, an Events list, and voice rooms.

It's a **static website**: just HTML, CSS and JavaScript files. There's no
server to run, so it can be hosted for free on **GitHub Pages**.

---

## Put it online with GitHub Pages (about 5 minutes, no command line)

1. Sign in at **github.com** and click **+** (top right) → **New repository**.
2. Name it, for example `agna-school`. Choose **Public**. Click **Create repository**.
3. On the new repository page, click **uploading an existing file**.
4. Unzip `agna-school.zip` on your computer. Open the `agna-school` folder, select
   **everything inside it** (`index.html`, the `css`, `js`, `images`, `fonts`,
   `vendor` folders and the other files) and drag it all into the GitHub page.
   Upload the *contents* of the folder, not the folder itself, so `index.html`
   sits at the top level.
5. Click **Commit changes**.
6. Go to **Settings** → **Pages** (left menu). Under **Branch**, choose `main`
   and `/ (root)`, then **Save**.
7. Wait about a minute and refresh. GitHub shows your link, for example
   `https://YOUR-USERNAME.github.io/agna-school/`.

To update the site later, upload the changed files again in the same way.

> Tip: the hidden `.nojekyll` file tells GitHub to serve the files as they
> are. If your computer hides it and it doesn't get uploaded, the site still works.

### Try it on your computer first
Double-click `index.html` to open it in Chrome or Edge. Everything works,
except the camera and screen sharing, which browsers only allow on `https`
sites like GitHub Pages.

---

## What works

| Feature | How it works |
|---|---|
| **Sign up / Log in** | Name, email and password. Wrong passwords and duplicate emails are caught. Passwords are stored as a salted SHA-256 hash, never as plain text. |
| **Continue with Google** | Off until you add a Google client ID (see below). Until then it asks people to use email. |
| **Saved progress** | Posts, photos, likes, comments, saved posts, chapter ticks, practice answers, test scores, “Mark done”, Launchpad “I want to try this” and event reminders are all saved **per account** and survive a page refresh. |
| **Feed** | Post text and/or a photo to a circle, like (or double-click the photo), comment, save, filter by circle, sort. |
| **Classwork** | Linear Equations has a full Learn → Practice (checked answers + hints) → Test (scored with explanations). Other chapters can be ticked off. Subject progress % updates live. |
| **Launchpad** | 22 topics with costs in ₹, steps, free resources and safety notes. |
| **Events** | Coming up / Every year / Competitions, city filter, real “register in N days” countdowns based on today's date. |
| **Voice rooms** | Join, mute, deafen, raise hand. **Video** turns on your real webcam and **Present** really shares your screen. |
| **Phones** | On small screens the sidebar becomes a slide-in menu. |
| **Log out** | Button at the bottom of the sidebar. |

### Limits of a free static site (good to know)
GitHub Pages only serves files and can't store data on a server, so:

- **Accounts and progress live in each person's browser.** A student who logs in
  on a different phone or computer starts fresh there, and students can't see
  each other's new posts.
- **Voice rooms show the sample classmates.** You see your own camera and screen,
  but live audio and video between real students needs a server.

If you want real shared accounts, a shared feed and live voice later, the usual
next step is adding a free backend such as **Firebase** or **Supabase** (for
accounts and data) and **LiveKit** or **Daily** (for voice and video). The code is
organised so that only `js/auth.js` (accounts and saving) and `js/media.js`
(calls) would need to change.

---

## Turn on “Continue with Google” (optional)

1. Go to **console.cloud.google.com** and create a project.
2. Open **APIs & Services → OAuth consent screen**, choose **External**, and fill
   in the app name and your email.
3. Open **APIs & Services → Credentials → Create credentials → OAuth client ID**.
   Choose **Web application**.
4. Under **Authorized JavaScript origins**, add your Pages address with no path,
   for example `https://YOUR-USERNAME.github.io`.
5. Copy the **Client ID** (it ends in `.apps.googleusercontent.com`).
6. Open `js/config.js` and paste it between the quotes:
   `googleClientId: '1234-abc.apps.googleusercontent.com'`
7. Upload `js/config.js` to GitHub again.

A client ID is meant to be public, so it's safe to put in this file.

---

## Where things are

```
index.html          The page, plus both screen layouts (landing + app) as templates
css/                Fonts and base styles (including the phone layout)
js/config.js        Settings (Google client ID)
js/data.js          All content: circles, subjects, chapters, questions,
                    Launchpad topics, events  ← edit this to change content
js/app.js           How the app behaves (feed, classwork, calls…)
js/landing.js       How the landing page and login popup behave
js/auth.js          Accounts and saving progress
js/media.js         Camera and screen sharing
js/engine.js        Turns the design's templates into the live page
vendor/             React 18.3.1 (MIT licence)
images/, fonts/     Pictures and fonts, all stored locally
```

The layouts come straight from the Claude Design file, so the site looks
exactly like the design.

## Credits
- Fonts: Manrope and JetBrains Mono (SIL Open Font License), self-hosted.
- React 18.3.1 (MIT licence).
- Launchpad photos come from Wikimedia Commons. Each file's page shows its
  author and licence (most need attribution):

- `images/launchpad/tutoring.jpg` — [Elementary classroom in Alaska.jpg](https://commons.wikimedia.org/wiki/File:Elementary_classroom_in_Alaska.jpg)
- `images/launchpad/playtest.jpg` — [Nintendo-Switch-Pro-Controller-FL.jpg](https://commons.wikimedia.org/wiki/File:Nintendo-Switch-Pro-Controller-FL.jpg)
- `images/launchpad/design.png` — [Hand-painted house 3D model stages.png](https://commons.wikimedia.org/wiki/File:Hand-painted_house_3D_model_stages.png)
- `images/launchpad/content.jpg` — [Tripod 0840.jpg](https://commons.wikimedia.org/wiki/File:Tripod_0840.jpg)
- `images/launchpad/music.jpg` — [AugustRecordingSonJarochoWikiLearning020.jpg](https://commons.wikimedia.org/wiki/File:AugustRecordingSonJarochoWikiLearning020.jpg)
- `images/launchpad/drones.jpg` — [Quadcopter camera drone in flight.jpg](https://commons.wikimedia.org/wiki/File:Quadcopter_camera_drone_in_flight.jpg)
- `images/launchpad/edutain.jpg` — [Storyboard for The Radio Adventures of Dr. Floyd.jpg](https://commons.wikimedia.org/wiki/File:Storyboard_for_The_Radio_Adventures_of_Dr._Floyd.jpg)
- `images/launchpad/aitools.jpg` — [Puma Robotic Arm - GPN-2000-001817.jpg](https://commons.wikimedia.org/wiki/File:Puma_Robotic_Arm_-_GPN-2000-001817.jpg)
- `images/launchpad/aidata.png` — [Anscombe's quartet 3.svg](https://commons.wikimedia.org/wiki/File:Anscombe%27s_quartet_3.svg)
- `images/launchpad/microgames.jpg` — [Fliperama.jpg](https://commons.wikimedia.org/wiki/File:Fliperama.jpg)
- `images/launchpad/gameeco.jpg` — [Toyblocks.JPG](https://commons.wikimedia.org/wiki/File:Toyblocks.JPG)
- `images/launchpad/microsites.jpg` — [Laptop collage.jpg](https://commons.wikimedia.org/wiki/File:Laptop_collage.jpg)
- `images/launchpad/automations.jpg` — [Agenda.jpg](https://commons.wikimedia.org/wiki/File:Agenda.jpg)
- `images/launchpad/printing.jpg` — [Robot 3D print timelapse on RepRapPro Fisher.webm](https://commons.wikimedia.org/wiki/File:Robot_3D_print_timelapse_on_RepRapPro_Fisher.webm)
- `images/launchpad/repair.jpg` — [Desoldering.jpg](https://commons.wikimedia.org/wiki/File:Desoldering.jpg)
- `images/launchpad/arduino.png` — [Breadboard.png](https://commons.wikimedia.org/wiki/File:Breadboard.png)
- `images/launchpad/products.jpg` — [Flash cards for language learning.jpg](https://commons.wikimedia.org/wiki/File:Flash_cards_for_language_learning.jpg)
- `images/launchpad/mushrooms.jpg` — [Pleurotus ostreatus JPG7.jpg](https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus_JPG7.jpg)
- `images/launchpad/terrarium.jpg` — [Regenwaldterrarium.jpg](https://commons.wikimedia.org/wiki/File:Regenwaldterrarium.jpg)
- `images/launchpad/astro.jpg` — [Orion Belt.jpg](https://commons.wikimedia.org/wiki/File:Orion_Belt.jpg)
- `images/launchpad/botany.jpg` — [Gentiana punctata seedlings (13900812284).jpg](https://commons.wikimedia.org/wiki/File:Gentiana_punctata_seedlings_%2813900812284%29.jpg)
- `images/launchpad/stem.jpg` — [US Navy 100416-N-5539C-006 Construction Electrician 3rd Class Jill Johnston and Lt. Col. Johnny Lizama listen to third-graders from Harry S. Truman Elementary School explain their science projects.jpg](https://commons.wikimedia.org/wiki/File:US_Navy_100416-N-5539C-006_Construction_Electrician_3rd_Class_Jill_Johnston_and_Lt._Col._Johnny_Lizama_listen_to_third-graders_from_Harry_S._Truman_Elementary_School_explain_their_science_projects.jpg)
