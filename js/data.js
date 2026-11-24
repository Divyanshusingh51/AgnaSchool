/*
 * Agna School — content.
 * Everything students see (circles, subjects, chapters, practice questions,
 * Launchpad topics, events) lives here. Edit this file to change content.
 * Image credits for images/launchpad/ are listed in README.md.
 */
const CIRCLES = [
  { id: 'lounge', name: 'Student Lounge', color: '#e07a5f', preview: 'Welcome to the Lounge! Say hi…', unread: 0 },
  { id: 'science', name: 'Science Lab', color: '#3d7ea6', preview: 'Ms. Rao: Who wants to build a…', unread: 2 },
  { id: 'art', name: 'Art Studio', color: '#b5838d', preview: 'Share your sketches here…', unread: 0 },
  { id: 'code', name: 'Coding Corner', color: '#2a9d8f', preview: 'Mr. Okafor: Python challenge…', unread: 4 },
  { id: 'books', name: 'Book Club', color: '#8d6a9f', preview: 'This month: The Giver', unread: 0 },
  { id: 'math', name: 'Math Help Desk', color: '#d4a24c', preview: 'Stuck on algebra? Ask away…', unread: 1 }
];
const BG = { lounge:'#7a3b2e', science:'#1f4e6b', art:'#6d4c57', code:'#1b5e57', books:'#4e3a5c', math:'#7a5a1e' };
const INITIAL_POSTS = [
  { id: 1, author: 'Priya Rao', initials: 'PR', avatarColor: '#3d7ea6', role: 'Teacher', circle: 'science', ts: 3, time: '2 hours ago', likes: 14, hasImage: true,
    body: "Welcome to Science Lab! I'm Ms. Rao, and I'll be guiding this circle. Here we'll run experiments, share cool discoveries, and plan our projects for the Science Fair. Curious about something? Start a thread — no question is too small.", comments: [{ author: 'Leo', initials: 'LM', text: 'Can we do the volcano one again but bigger?' }] },
  { id: 2, author: 'Daniel Okafor', initials: 'DO', avatarColor: '#2a9d8f', role: 'Teacher', circle: 'code', ts: 2, time: '5 hours ago', likes: 22, hasImage: true,
    body: "Hi coders! This week's challenge: write a program that prints the multiplication table for any number you choose. Post your solution in the thread — bonus points if you make it colorful.", comments: [] },
  { id: 3, author: 'Ava Chen', initials: 'AC', avatarColor: '#b5838d', role: 'Student', circle: 'art', ts: 1, time: 'Yesterday', likes: 9, hasImage: false,
    body: 'Finished my watercolor of the school garden! Anyone have tips for painting leaves that don\'t look blurry?', comments: [] }
];
const LEVEL_OF = { maths: 8, science: 8, english: 8, social: 8, computer: 7, hindi: 8 };
const CH_PROG = { 'maths-2': 40, 'maths-3': 15, 'science-1': 60, 'science-2': 25, 'english-0': 80, 'english-1': 35, 'social-0': 50, 'computer-0': 70, 'computer-1': 30, 'hindi-0': 45 };
const SUBJECTS = [
  { id: 'maths', name: 'Maths', color: '#3d7ea6', chapters: ['Rational Numbers', 'Linear Equations', 'Understanding Quadrilaterals', 'Data Handling', 'Squares & Square Roots', 'Cubes & Cube Roots', 'Comparing Quantities', 'Algebraic Expressions', 'Mensuration'] },
  { id: 'science', name: 'Science', color: '#4f7f3f', chapters: ['Crop Production', 'Microorganisms', 'Synthetic Fibres & Plastics', 'Metals & Non-metals', 'Coal & Petroleum', 'Combustion & Flame', 'Cell Structure', 'Force & Pressure', 'Friction', 'Sound', 'Light'] },
  { id: 'english', name: 'English', color: '#a8687a', chapters: ['Reading Comprehension', 'Grammar: Tenses', 'Grammar: Active & Passive Voice', 'Letter Writing', 'Story Writing', 'Poetry Appreciation'] },
  { id: 'social', name: 'Social Science', color: '#a0741f', chapters: ['Resources', 'Land, Soil & Water', 'Agriculture', 'From Trade to Territory', 'The Indian Constitution', 'Understanding Parliament', 'Women, Caste & Reform'] },
  { id: 'computer', name: 'Computer Science', color: '#23867a', chapters: ['How Computers Work', 'Internet Safety', 'Intro to Scratch', 'Loops & Conditions', 'Intro to Python', 'Spreadsheets'] },
  { id: 'hindi', name: 'Hindi', color: '#5f64b8', chapters: ['Gadya: Kahani', 'Padya: Kavita', 'Vyakaran: Sangya & Sarvanaam', 'Patra Lekhan', 'Nibandh Lekhan'] }
];
const PRACTICE = [
  { q: 'x + 7 = 15', a: 8, hint: 'Take away 7 from both sides.' },
  { q: '3x = 21', a: 7, hint: 'Divide both sides by 3.' },
  { q: '4x − 5 = 11', a: 4, hint: 'First add 5 to both sides. Then divide by 4.' },
  { q: '2x + 9 = x + 14', a: 5, hint: 'Take away x from both sides first.' },
  { q: 'x ÷ 3 + 2 = 6', a: 12, hint: 'Take away 2. Then multiply both sides by 3.' }
];
const TEST = [
  { q: 'Which one is a linear equation?', opts: ['x² + 1 = 5', '3x − 2 = 7', 'xy = 4', '1 ÷ x = 2'], a: 1, why: 'Only 3x − 2 = 7 has x on its own: not squared, not under a fraction, not times another letter.' },
  { q: 'Solve: 6x = 42', opts: ['6', '7', '8', '36'], a: 1, why: 'Divide both sides by 6: 42 ÷ 6 = 7.' },
  { q: 'Solve: 5x + 3 = 2x + 18', opts: ['3', '5', '7', '15'], a: 1, why: 'Take away 2x: 3x + 3 = 18. Take away 3: 3x = 15. So x = 5.' },
  { q: 'If 2(x − 3) = 10, what is x?', opts: ['2', '5', '8', '13'], a: 2, why: 'Divide by 2: x − 3 = 5. Add 3: x = 8.' },
  { q: 'Two numbers in a row add up to 41. What is the smaller number?', opts: ['19', '20', '21', '22'], a: 1, why: 'x + (x + 1) = 41, so 2x = 40 and x = 20.' }
];
const ASSIGNMENTS = [
  { id: 'a1', title: 'Lab report: Plant growth & sunlight', kind: 'Assignment', due: 'Nov 20', circle: 'science', icon: '✎' },
  { id: 'a2', title: 'Python: Multiplication table', kind: 'Challenge', due: 'Nov 22', circle: 'code', icon: '</>' },
  { id: 'a3', title: 'Read chapters 1–5 of The Giver', kind: 'Reading', due: 'Nov 25', circle: 'books', icon: '▤' },
  { id: 'a4', title: 'Fractions practice sheet', kind: 'Study material', due: 'Nov 27', circle: 'math', icon: '½' }
];
const EV = [
  // annual
  { g:'annual', date:'2027-01-02', mon:'JAN', day:'2–6', when:'Every January · next Jan 2027', title:'Shaastra, IIT Madras', org:'IIT Madras', city:'Chennai', type:'College fest', what:'One of India’s biggest student tech festivals: robots, rockets, workshops and science shows.', cost:'Many events free', url:'https://shaastra.org' },
  { g:'annual', date:'2027-01-07', mon:'JAN', day:'7–19', when:'Every January · 50th edition 2027', title:'Chennai Book Fair', org:'BAPASI', city:'Chennai', type:'Book fair', what:'India’s second-biggest book fair, at YMCA Ground, Nandanam. Hundreds of stalls in Tamil and English.', cost:'Small entry fee', url:'https://www.bapasi.com' },
  { g:'annual', date:'2027-01-26', mon:'JAN', day:'26', when:'Every January & August', title:'Lalbagh Flower Show', org:'Dept. of Horticulture, Karnataka', city:'Bengaluru', type:'Government', what:'Huge flower displays at the Glass House for Republic Day and Independence Day. Great for botany fans.', cost:'Small entry fee', url:'https://horticulturedir.karnataka.gov.in' },
  { g:'annual', date:'2027-02-12', mon:'FEB', day:'Mid', when:'Every February · 4 days', title:'Great Backyard Bird Count', org:'Cornell Lab & Audubon', city:'Online', type:'Citizen science', what:'Count birds for 15 minutes anywhere and upload them. Your sightings help real scientists.', cost:'Free', url:'https://www.birdcount.org' },
  { g:'annual', date:'2027-02-27', mon:'MAR', day:'~1', when:'Every year · Saturday near 3 March', title:'IISc Open Day', org:'Indian Institute of Science', city:'Bengaluru', type:'College open day', what:'IISc opens its labs to everyone. Demos, experiments, talks and quizzes all day.', cost:'Free', url:'https://www.iisc.ac.in' },
  { g:'annual', date:'2027-08-22', mon:'AUG', day:'~22', when:'Every August', title:'Madras Week', org:'City heritage groups', city:'Chennai', type:'Heritage', what:'A week of heritage walks, talks and quizzes celebrating the city’s birthday.', cost:'Mostly free', url:'https://www.madrasday.in' },
  { g:'annual', date:'2027-11-17', mon:'NOV', day:'Mid', when:'Every November · next Nov 2027', title:'Bengaluru Tech Summit', org:'Government of Karnataka', city:'Bengaluru', type:'Expo', what:'Asia’s big tech expo at BIEC. AI, robots, startups and student pavilions.', cost:'Some passes free', url:'https://www.bengalurutechsummit.com' },
  // upcoming
  { g:'up', date:'2026-12-11', mon:'DEC', day:'11–13', when:'Dec 11–13, 2026 · Freedom Park', title:'Bangalore Literature Festival', org:'BLF', city:'Bengaluru', type:'Festival', what:'Meet authors, hear stories and browse books. Has sessions for kids and families.', cost:'Free, register online', url:'https://bangaloreliteraturefestival.org' },
  { g:'up', date:'2027-01-02', deadline:'2026-11-30', mon:'JAN', day:'2–4', when:'Jan 2–4, 2027 · IIT Madras campus', title:'IIT Madras Institute Open House', org:'IIT Madras', city:'Chennai', type:'College open day', what:'Visit 100+ research labs and around 80 project stalls with live demos.', cost:'Free, register', url:'https://shaastra.org/open-house' },
  { g:'up', date:'2027-01-07', mon:'JAN', day:'7–19', when:'Jan 7–19, 2027 · YMCA Ground, Nandanam', title:'50th Chennai Book Fair', org:'BAPASI', city:'Chennai', type:'Book fair', what:'The golden jubilee edition with special guests from around the world.', cost:'Small entry fee', url:'https://www.bapasi.com' },
  { g:'up', date:'2027-01-16', mon:'JAN', day:'16–18', when:'Jan 16–18, 2027', title:'Chennai International Book Fair', org:'Government of Tamil Nadu', city:'Chennai', type:'Government', what:'Publishers from 100+ countries. A good look at how books travel between languages.', cost:'Check site', url:'https://www.chennaiinternationalbookfair.com' },
  { g:'up', date:'2026-12-01', mon:'EVERY', day:'Mo', when:'Monthly meetup', title:'BangPypers (Python Bengaluru)', org:'Python community', city:'Bengaluru', type:'Meetup', what:'Friendly talks and workshops on Python. Good for teens who code. Go with a parent.', cost:'Free', url:'https://bangpypers.org', who:'Teens + parent' },
  { g:'up', date:'2026-12-02', mon:'EVERY', day:'Mo', when:'Monthly meetup', title:'Chennaipy (Python Chennai)', org:'Python community', city:'Chennai', type:'Meetup', what:'Monthly Python meetup with beginner-friendly talks.', cost:'Free', url:'https://chennaipy.org', who:'Teens + parent' },
  // competitions
  { g:'comp', date:'2026-11-28', deadline:'2026-11-28', mon:'NOV', day:'28', when:'Online contest · Shaastra 2027', title:'Shaastra Programming Contest', org:'IIT Madras', city:'Online', type:'Coding', what:'Solve coding problems in Python or C++ from home.', cost:'Free', url:'https://shaastra.org', who:'Students' },
  { g:'comp', date:'2027-01-02', deadline:'2026-12-09', mon:'JAN', day:'2', when:'Jan 2, 2027 · IIT Madras', title:'Aerofloat (Shaastra 2027)', org:'IIT Madras', city:'Chennai', type:'Drones', what:'Fly your aircraft or drone through a challenge. First round is a flight video.', cost:'Free · prize ₹5K', url:'https://shaastra.org', who:'Teams of up to 3' },
  { g:'comp', date:'2027-01-03', deadline:'2026-12-10', mon:'JAN', day:'Early', when:'Jan 2027 · IIT Madras', title:'Roboceana (Shaastra 2027)', org:'IIT Madras', city:'Chennai', type:'Robotics', what:'Build and test an underwater robot. Check if school teams can join.', cost:'Free · prize pool ₹75K', url:'https://shaastra.org', who:'Check eligibility' },
  { g:'comp', date:'2027-02-27', mon:'FEB', day:'~27', when:'Applications usually late Feb – Mar', title:'ISRO YUVIKA Young Scientist Programme', org:'ISRO', city:'Online', type:'Government', what:'A 2-week space camp at an ISRO centre. Apply online; ISRO pays for stay and food.', cost:'Free', url:'https://jigyasa.iirs.gov.in/yuvika', who:'Class 9 students' },
  { g:'comp', date:'2027-06-01', mon:'MID', day:'Yr', when:'Nominations open mid-year via school', title:'INSPIRE-MANAK Awards', org:'Govt. of India (DST)', city:'Online', type:'Government', what:'Send in your best idea. Selected students get ₹10,000 to build it.', cost:'Free · ₹10,000 award', url:'https://www.inspireawards-dst.gov.in', who:'Class 6–10' },
  { g:'comp', date:'2027-10-02', mon:'OCT', day:'Early', when:'Every October · online + local hubs', title:'NASA Space Apps Challenge', org:'NASA', city:'Online', type:'Hackathon', what:'A weekend hackathon using real NASA data. Chennai and Bengaluru usually have local hubs.', cost:'Free', url:'https://www.spaceappschallenge.org', who:'All ages with a team' }
];
const EV_TYPE_COLOR = { 'College fest':'#2f6fde', 'Book fair':'#a8687a', 'Government':'#a0741f', 'Citizen science':'#4f7f3f', 'College open day':'#3d7ea6', 'Heritage':'#a8687a', 'Expo':'#5f64b8', 'Festival':'#a8687a', 'Meetup':'#23867a', 'Coding':'#23867a', 'Drones':'#3d7ea6', 'Robotics':'#5f64b8', 'Hackathon':'#2f6fde' };
const EVENTS = [
  { month: 'NOV', day: '19', title: 'Science Fair Kickoff', meta: 'Auditorium · 2:00 PM' },
  { month: 'NOV', day: '24', title: 'Coding Club Hack Hour', meta: 'Computer Lab · 3:30 PM' },
  { month: 'DEC', day: '02', title: 'Art Showcase', meta: 'Main Hall · 1:00 PM' }
];
const VOICE = [
  { id: 'study', name: 'Study Hall', people: [{ name: 'Leo M.', initials: 'LM', color: '#f4a261', speaking: true }, { name: 'Ava C.', initials: 'AC', color: '#b5838d', muted: true }] },
  { id: 'homework', name: 'Homework Help', people: [{ name: 'Ms. Rao', initials: 'PR', color: '#3d7ea6', cam: true }] },
  { id: 'jam', name: 'Project Jam', people: [] },
  { id: 'music', name: 'Music Room', people: [{ name: 'Sam K.', initials: 'SK', color: '#7aa5d8' }, { name: 'Noor A.', initials: 'NA', color: '#8bc48a', muted: true }, { name: 'Jay P.', initials: 'JP', color: '#c39bd3', speaking: true }] }
];
const GROUPS = {
  teach: { label: "Help Others", color: "#3d7ea6", circle: "math" },
  create: { label: "Create", color: "#a8687a", circle: "art" },
  code: { label: "Code & AI", color: "#23867a", circle: "code" },
  make: { label: "Build & Fix", color: "#a0741f", circle: "science" },
  grow: { label: "Nature & Space", color: "#4f7f3f", circle: "science" },
  compete: { label: "Contests", color: "#5f64b8", circle: "lounge" }
};
const TRACKS = [
 { id:"tutoring", group:"teach", title:"Help Classmates Learn", term:"Peer tutoring", kw:"tutoring,classroom", level:"Easy", time:"1–2 hrs a week", age:"10+", sup:"Teacher helps", budget:"₹0 – ₹550",
   what:"Explain a subject you're good at to a friend who's stuck.",
   steps:["Pick one subject you really like","Help one friend with homework for free","Make a simple sign-up sheet for more friends"],
   learn:[["Khan Academy","Free lessons to brush up any topic","https://www.khanacademy.org"],["Google Forms","Make a free sign-up sheet","https://forms.google.com"]],
   buy:[["Notebook & markers","₹150",true],["Small whiteboard","₹400",false]],
   safe:"Meet in school or online with a grown-up nearby.", skills:["Explaining","Patience","Planning"], jobs:["Teacher","Coach","Trainer"], later:"With a parent's OK, charge ₹150–300 a session." },
 { id:"playtest", group:"teach", title:"Test Games & Find Bugs", term:"Playtesting & bug hunting", kw:"videogame,controller", level:"Easy", time:"1–3 hrs a week", age:"12+", sup:"Tell a parent", budget:"₹0 – ₹100",
   what:"Play new games and report what's broken so makers can fix it.",
   steps:["Play a free game on itch.io","Write down anything weird: what you did, what happened","Send a clear bug report to the game maker"],
   learn:[["itch.io","Thousands of free indie games to test","https://itch.io"],["Bug report template","Steps → what you expected → what happened","https://itch.io"]],
   buy:[["Notebook for notes","₹100",false]],
   safe:"Only join tester programs with a parent. Never share passwords.", skills:["Noticing details","Clear writing","Problem solving"], jobs:["Game tester","Game producer"], later:"At 16+, join paid testing panels." },
 { id:"design", group:"create", title:"Design Apps & 3D Models", term:"Digital design, UI & 3D assets", kw:"graphicdesign,3d", level:"Medium", time:"2–4 hrs a week", age:"11+", sup:"On your own", budget:"₹0 – ₹4,500",
   what:"Draw app screens, icons and 3D objects on a computer.",
   steps:["Copy the home screen of an app you use","Make a 3D donut in Blender (famous first project)","Put your 3 best designs in one folder"],
   learn:[["Figma","Free design tool for students","https://www.figma.com/education/"],["Blender","Free 3D modeling app","https://www.blender.org"],["Canva Design School","Short free design lessons","https://www.canva.com/learn/"]],
   buy:[["Computer mouse","₹400",true],["Drawing tablet (basic)","₹2,500 – ₹4,000",false]],
   safe:"Take a 10-minute screen break every hour.", skills:["Drawing on screen","Colors & layout","3D thinking"], jobs:["App designer","3D artist","Animator"], later:"Sell icon or 3D packs online with a parent." },
 { id:"content", group:"create", title:"Make Videos (with a Parent)", term:"Supervised content creation", kw:"vlogging,camera", level:"Easy", time:"2–3 hrs a week", age:"10+", sup:"Grown-up needed", budget:"₹0 – ₹1,900",
   what:"Film short videos about something you love. A parent runs the account.",
   steps:["Pick a topic you could talk about 20 times","Film one 60-second video on a phone","Check privacy settings with a parent before posting"],
   learn:[["CapCut","Free, easy video editor","https://www.capcut.com"],["Be Internet Awesome","Google's free online safety lessons","https://beinternetawesome.withgoogle.com"]],
   buy:[["Phone tripod","₹500",true],["Clip-on mic","₹600",false],["Small ring light","₹800",false]],
   safe:"Never show your school, address or full name on camera.", skills:["Storytelling","Video editing","Speaking"], jobs:["Video editor","Journalist","Marketer"], later:"Grow a channel your parent manages." },
 { id:"music", group:"create", title:"Make Music & Sounds", term:"Music & audio production", kw:"musicstudio,headphones", level:"Easy", time:"2–4 hrs a week", age:"9+", sup:"On your own", budget:"₹0 – ₹6,500",
   what:"Make beats, songs and sound effects on a phone or computer.",
   steps:["Play with Chrome Music Lab","Make a 30-second beat in BandLab","Make sound effects for a friend's game"],
   learn:[["Chrome Music Lab","Fun music experiments in your browser","https://musiclab.chromeexperiments.com"],["BandLab","Free music studio app","https://www.bandlab.com"]],
   buy:[["Headphones","₹1,000",true],["USB microphone","₹2,000",false],["Mini MIDI keyboard","₹3,500",false]],
   safe:"Keep headphone volume below half to protect your ears.", skills:["Rhythm","Mixing","Creativity"], jobs:["Music producer","Sound designer"], later:"Make background music for school videos." },
 { id:"drones", group:"create", title:"Fly Drones & Film from the Sky", term:"Drones & aerial media", kw:"drone,aerial", level:"Medium", time:"2–3 hrs a week", age:"12+", sup:"Grown-up needed", budget:"₹2,500 – ₹33,000",
   what:"Fly small drones and take photos and videos from above.",
   steps:["Practice on a free drone simulator app","Fly a small toy drone in an open field","Film a school event with permission"],
   learn:[["DGCA Digital Sky","India's official drone rules","https://digitalsky.dgca.gov.in"],["Drone simulator apps","Practice flying for free on a phone","https://play.google.com"]],
   buy:[["Mini toy drone","₹2,500",true],["Beginner camera drone (under 250 g)","₹15,000 – ₹30,000",false],["Spare batteries","₹1,500",false]],
   safe:"In India, start with drones under 250 g. Never fly near airports or crowds.", skills:["Flying","Photography","Following rules"], jobs:["Drone pilot","Filmmaker","Map maker"], later:"Film events for school and family." },
 { id:"edutain", group:"create", title:"Teach with Videos (No Face Needed)", term:"Edutainment & faceless channels", kw:"animation,storyboard", level:"Easy", time:"2–3 hrs a week", age:"11+", sup:"Tell a parent", budget:"₹0 – ₹600",
   what:"Explain cool facts using your voice, slides and drawings.",
   steps:["Pick a topic: space, history, animals…","Write a 2-minute script","Turn it into a video with Canva"],
   learn:[["Canva","Free slides and simple animations","https://www.canva.com"],["Khan Academy","Research your facts","https://www.khanacademy.org"]],
   buy:[["Clip-on mic","₹600",false]],
   safe:"Always check your facts with 2 trusted sources.", skills:["Research","Writing","Animation"], jobs:["Science communicator","Writer","Animator"], later:"Start a learning channel your parent manages." },
 { id:"aitools", group:"code", title:"Build Small AI Helpers", term:"AI projects & micro-tools", kw:"robot,computer", level:"Medium", time:"2–3 hrs a week", age:"11+", sup:"Teacher helps", budget:"₹0",
   what:"Make tiny apps that use AI to help with one small job.",
   steps:["Write down 5 boring tasks you do every day","Train a simple AI in Teachable Machine","Show it in Coding Corner"],
   learn:[["Teachable Machine","Train an AI with your webcam — free","https://teachablemachine.withgoogle.com"],["Elements of AI","Free beginner AI course","https://www.elementsofai.com"]],
   buy:[],
   safe:"Don't put personal info into AI tools.", skills:["Thinking like a builder","Basic coding","Asking good questions"], jobs:["AI engineer","App developer"], later:"Build tools for your school clubs." },
 { id:"aidata", group:"code", title:"Find Patterns in Data", term:"Custom AI & data projects", kw:"chart,data", level:"Medium", time:"1–2 hrs a week", age:"12+", sup:"On your own", budget:"₹0",
   what:"Collect numbers about something, then find out what they say.",
   steps:["Ask a question, like 'Which plant grows fastest?'","Write the numbers in a sheet for 2 weeks","Make a chart and share what you found"],
   learn:[["Google Sheets","Free spreadsheets and charts","https://sheets.google.com"],["Kaggle Learn","Free short Python and data lessons","https://www.kaggle.com/learn"]],
   buy:[],
   safe:"Ask before collecting info about other people.", skills:["Math","Python","Charts"], jobs:["Data scientist","Researcher"], later:"Enter your project in a science fair." },
 { id:"microgames", group:"code", title:"Make Tiny Games", term:"Indie micro-games", kw:"pixelart,game", level:"Easy", time:"2–4 hrs a week", age:"9+", sup:"Tell a parent", budget:"₹0",
   what:"Build small games that friends can play in a browser.",
   steps:["Make a game in Scratch","Make a one-button game in a weekend","Share it with friends to play"],
   learn:[["Scratch","Free drag-and-drop coding","https://scratch.mit.edu"],["Godot","Free real game engine","https://godotengine.org"]],
   buy:[],
   safe:"Publish games online only with a parent's account.", skills:["Game design","Coding","Fixing mistakes"], jobs:["Game developer","Programmer"], later:"Publish on itch.io with a parent." },
 { id:"gameeco", group:"code", title:"Build Roblox & Minecraft Worlds", term:"Game economy assets", kw:"minecraft,blocks", level:"Medium", time:"2–4 hrs a week", age:"12+", sup:"Tell a parent", budget:"₹0 – ₹2,500",
   what:"Make maps, items and skins for games you already play.",
   steps:["Do the first lesson on Roblox Creator Hub","Build one small map","Let friends test it and give tips"],
   learn:[["Roblox Creator Hub","Free lessons for Roblox Studio","https://create.roblox.com"],["Minecraft Education","Coding lessons inside Minecraft","https://education.minecraft.net"]],
   buy:[["Minecraft Java (optional)","₹2,000 – ₹2,500",false]],
   safe:"Read the game's rules with a parent. Never buy things without asking.", skills:["3D building","Lua coding","Game money basics"], jobs:["Game designer","Level designer"], later:"Sell items in-game with a parent (13+)." },
 { id:"microsites", group:"code", title:"Make Websites for Local Shops", term:"Micro-websites for small businesses", kw:"website,laptop", level:"Medium", time:"2–3 hrs a week", age:"12+", sup:"Grown-up needed", budget:"₹0 – ₹1,000",
   what:"Build simple one-page websites for small shops near you.",
   steps:["Make a practice site for a pretend bakery","Make a free site for a family member's shop","Ask them for a review"],
   learn:[["freeCodeCamp","Free HTML & CSS lessons","https://www.freecodecamp.org"],["Google Sites","Make a site with no code","https://sites.google.com"]],
   buy:[["Website name (domain), 1 year","₹500 – ₹1,000",false]],
   safe:"A grown-up should always join talks with shop owners.", skills:["HTML & CSS","Talking to clients","Design"], jobs:["Web developer","Freelancer"], later:"Charge ₹1,000–3,000 per site with a parent." },
 { id:"automations", group:"code", title:"Automate Your Study Routine", term:"Study automations (Notion/Python)", kw:"planner,desk", level:"Medium", time:"1–2 hrs a week", age:"12+", sup:"On your own", budget:"₹0",
   what:"Make planners and quizzes that do the boring work for you.",
   steps:["Build a homework tracker in Notion","Write a Python quiz that tests you","Share your template with the class"],
   learn:[["Notion","Free planner app for students","https://www.notion.so"],["Automate the Boring Stuff","Free Python book online","https://automatetheboringstuff.com"]],
   buy:[],
   safe:"Keep your accounts private.", skills:["Organizing","Python","Saving time"], jobs:["Software engineer","Product manager"], later:"Share study templates with other schools." },
 { id:"printing", group:"make", title:"3D Print Things", term:"On-demand 3D printing", kw:"3dprinter", level:"Medium", time:"2–3 hrs a week", age:"11+", sup:"Teacher helps", budget:"₹0 – ₹26,000",
   what:"Design an object on a computer, then print it in plastic.",
   steps:["Design a keychain in Tinkercad","Print it on the school lab printer","Print something useful for a teacher"],
   learn:[["Tinkercad","Free, easy 3D design","https://www.tinkercad.com"],["Printables","Free models to download","https://www.printables.com"]],
   buy:[["Use the school printer","₹0",true],["Beginner 3D printer","₹15,000 – ₹25,000",false],["Plastic filament (1 kg)","₹800 – ₹1,200",false]],
   safe:"The nozzle gets very hot. Don't touch it while printing.", skills:["3D design","Measuring","Patience"], jobs:["Engineer","Product designer"], later:"Take small print orders from clubs." },
 { id:"repair", group:"make", title:"Fix Old Gadgets", term:"Basic tech repair & refurbishing", kw:"electronics,repair", level:"Medium", time:"2–3 hrs a week", age:"13+", sup:"Grown-up needed", budget:"₹1,050 – ₹1,550",
   what:"Open up old phones, laptops and controllers and make them work again.",
   steps:["Learn tool and battery safety","Clean and fix an old keyboard or controller","Fix up a donated laptop for someone"],
   learn:[["iFixit","Free step-by-step repair guides","https://www.ifixit.com"]],
   buy:[["Screwdriver kit","₹500 – ₹1,000",true],["Multimeter","₹400",false],["Anti-static wrist strap","₹150",true]],
   safe:"Never open puffy batteries or anything plugged in.", skills:["Electronics","Problem solving","Careful hands"], jobs:["Hardware engineer","Repair technician"], later:"Fix friends' gadgets for a small fee." },
 { id:"arduino", group:"make", title:"Build Smart Gadgets", term:"Arduino & IoT kits", kw:"arduino,circuit", level:"Medium", time:"2–3 hrs a week", age:"10+", sup:"Teacher helps", budget:"₹1,200 – ₹3,400",
   what:"Connect lights, sensors and tiny computers to build gadgets.",
   steps:["Make an LED blink","Build a plant 'water me' alarm","Write easy instructions so a friend can build it"],
   learn:[["Tinkercad Circuits","Try circuits online for free","https://www.tinkercad.com/circuits"],["Arduino Project Hub","Thousands of free project ideas","https://projecthub.arduino.cc"]],
   buy:[["Arduino starter kit","₹1,200 – ₹2,500",true],["Sensor pack","₹500",false],["ESP32 Wi-Fi board","₹400",false]],
   safe:"Use only low-voltage batteries or USB. Never mains power.", skills:["Circuits","Coding","Instructions"], jobs:["Robotics engineer","Inventor"], later:"Use your school's Atal Tinkering Lab if it has one." },
 { id:"products", group:"make", title:"Make Flashcards, Guides & Stickers", term:"Niche digital & physical products", kw:"stickers,stationery", level:"Easy", time:"1–3 hrs a week", age:"10+", sup:"Tell a parent", budget:"₹300 – ₹1,500",
   what:"Turn what you love into things people can use or collect.",
   steps:["Pick a topic you know a lot about","Design 10 flashcards in Canva","Print a few for the school fair"],
   learn:[["Canva","Free design templates","https://www.canva.com"]],
   buy:[["Printing","₹300 – ₹1,000",true],["Sticker paper","₹300",false],["Paper cutter","₹200",false]],
   safe:"Only use pictures you made or have permission to use.", skills:["Design","Pricing","Selling"], jobs:["Entrepreneur","Illustrator"], later:"Sell at school fairs or local shops." },
 { id:"mushrooms", group:"grow", title:"Grow Mushrooms", term:"Micro-cultivation (gourmet mushrooms)", kw:"mushroom", level:"Easy", time:"15 min a day", age:"10+", sup:"Grown-up needed", budget:"₹300 – ₹1,000",
   what:"Grow tasty oyster mushrooms at home from a simple kit.",
   steps:["Start with a ready-to-grow kit","Spray water and write notes every day","Show your harvest in Science Lab"],
   learn:[["Krishi Vigyan Kendra","Your local farm centre often runs mushroom classes","https://kvk.icar.gov.in"]],
   buy:[["Oyster mushroom kit","₹300 – ₹600",true],["Spray bottle","₹100",true],["Humidity meter","₹300",false]],
   safe:"Never eat wild mushrooms. Only eat kit mushrooms after a grown-up checks.", skills:["Biology","Daily habits","Taking notes"], jobs:["Farmer","Food scientist"], later:"Sell fresh mushrooms to neighbours." },
 { id:"terrarium", group:"grow", title:"Build a Tiny Bug World", term:"Entomology & closed terrariums", kw:"terrarium", level:"Easy", time:"30 min a week", age:"9+", sup:"Tell a parent", budget:"₹650 – ₹1,450",
   what:"Make a sealed jar garden that looks after itself, and study tiny bugs.",
   steps:["Fill a jar with soil, moss and small plants","Add tiny helper bugs (springtails)","Draw what you see every week"],
   learn:[["iNaturalist","Snap a photo, learn the bug's name","https://www.inaturalist.org"]],
   buy:[["Glass jar","₹200 – ₹500",true],["Moss & soil","₹300",true],["Springtails or isopods","₹300 – ₹500",false],["Magnifying glass","₹150",false]],
   safe:"Wash hands after touching soil or bugs.", skills:["Ecology","Observation","Drawing"], jobs:["Biologist","Zoologist"], later:"Make terrariums as gifts." },
 { id:"astro", group:"grow", title:"Photograph Stars & Planets", term:"Astronomy & astrophotography", kw:"stars,nightsky", level:"Medium", time:"1–2 nights a week", age:"10+", sup:"Grown-up needed", budget:"₹0 – ₹19,500",
   what:"Find planets and stars in the night sky and take photos of them.",
   steps:["Find 5 things in the sky with Stellarium","Photograph the Moon through binoculars with a phone","Go to a night-sky event"],
   learn:[["Stellarium","Free sky map app","https://stellarium.org"],["NASA Space Place","Easy space lessons","https://spaceplace.nasa.gov"]],
   buy:[["Binoculars","₹2,000 – ₹4,000",false],["Phone adapter","₹500",false],["Beginner telescope","₹8,000 – ₹15,000",false]],
   safe:"Never look at the Sun. Go out at night only with a grown-up.", skills:["Optics","Photo editing","Physics"], jobs:["Astronomer","Space scientist"], later:"Join an astronomy club." },
 { id:"botany", group:"grow", title:"Grow New Plants from Cuttings", term:"Botany & rare plant propagation", kw:"houseplant,leaves", level:"Easy", time:"20 min a week", age:"9+", sup:"On your own", budget:"₹500 – ₹1,300",
   what:"Cut a small piece of a plant and grow a whole new plant from it.",
   steps:["Put a money-plant cutting in water","Try 3 ways to grow cuttings and compare","Swap plants at a plant fair"],
   learn:[["Seek by iNaturalist","Identify any plant with your camera","https://www.inaturalist.org/pages/seek_app"]],
   buy:[["Small pots","₹200",true],["Cocopeat (soil)","₹150",true],["Rooting powder","₹150",false],["Rare plant cutting","₹200 – ₹800",false]],
   safe:"Some plants are poisonous. Wash hands after handling.", skills:["Botany","Experiments","Patience"], jobs:["Botanist","Gardener"], later:"Sell baby plants to friends." },
 { id:"stem", group:"compete", title:"Win Science Contests & Awards", term:"STEM competitions & grants", kw:"sciencefair,trophy", level:"Medium", time:"2–4 hrs a week", age:"10+", sup:"Teacher helps", budget:"₹0 – ₹2,000",
   what:"Enter science fairs and contests. Some give money for your idea.",
   steps:["Look at open contests with a teacher","Pick a project from another Launchpad topic","Make your entry and get feedback"],
   learn:[["INSPIRE-MANAK","Govt. award for student ideas — selected ideas get ₹10,000","https://www.inspireawards-dst.gov.in"],["Science Olympiad Foundation","School olympiads in many subjects","https://sofworld.org"]],
   buy:[["Project materials & entry fees","₹0 – ₹2,000",false]],
   safe:"Only apply through your school or official websites.", skills:["Research","Presenting","Writing"], jobs:["Scientist","Inventor","Engineer"], later:"Win prize money for your project." }
];
const IMG = Object.fromEntries(TRACKS.map(t => [t.id, 'images/launchpad/' + t.id + '.' + ({"design": "png", "aidata": "png", "arduino": "png"}[t.id] || 'jpg')]));
const cName = id => (CIRCLES.find(c => c.id === id) || {}).name || '';
const cColor = id => (CIRCLES.find(c => c.id === id) || {}).color || '#999';
