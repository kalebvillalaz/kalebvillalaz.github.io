/* ==========================================================================
   config.js — ALL of your content lives here. Edit this file, not app.js.
   ========================================================================== */

window.SITE = {
  /* ---- identity (shown as silkscreen text) ---------------------------- */
  name: "Kaleb Villalaz Diaz",                      
  boardId: "Portfolio",                         
  rev: "A",                                     // bump this when you redo the site
  role: "Computer Engineering student",
  tagline: "Computer Engineering · Cal State East Bay · Class of 2027",
  grad: "2027",
  siteTitle: "Kaleb Villalaz Diaz | Computer Engineering",
  description: "Computer engineering student. Projects and build log.",

  /* ---- about (the big chip, U1) --------------------------------------- */
  bio: [
    "Computer engineering student at Cal State East Bay, graduating in 2027. I am an officer for my campus's IEEE Club, I work on all sorts of projects in my spare time, and write up what I leanrned on this site."
  ],
  specs: [                                      // [label, value] pairs
    ["Degree", "B.S. Computer Engineering"],
    ["School", "Cal State East Bay"],
    ["Graduating", "2027"]
  ],

  /* ---- socials (the pin header, J1) -----------------------------------
     Entries with an empty href are hidden. To add your resume, drop a
     resume.pdf next to index.html and set href: "resume.pdf".            */
  socials: [
    { label: "GitHub",   handle: "github.com/kalebvillalaz",     href: "https://github.com/kalebvillalaz" },
    { label: "LinkedIn", handle: "linkedin.com/in/rodolfokvillalaz", href: "https://www.linkedin.com/in/rodolfokvillalaz" },
    { label: "Email",    handle: "rodolfokvillalaz@gmail.com",              href: "mailto:rodolfokvillalaz@gmail.com" },
    { label: "Resume",   handle: "resume.pdf",                   href: "resume.pdf" }
  ],

  /* ---- projects (one IC each, U2, U3, ...) ----------------------------
     links: repo / demo are external URLs. post is the slug of a blog post
     (see posts below). The first link that exists is the main click target. */
  projects: [
    {
      name: "PiHole; Ad/Tracker Blocker",
      status: "Completed",
      desc: "With the use of a Raspberry Pi, a network-wide Ad and Tracker blocker is created.",
      tags: ["Raspberry Pi", "Network", "Terminal"],
      post: "PiHole"
    },
    {
      name: "Project 02",
      status: "Placeholder",
      desc: "Description.",
      tags: ["Tag", "Tag"],
      repo: "https://github.com/your-username/project-03"
    }
  ],

  /* ---- skills (SMD parts). prefix: R = resistor, C = capacitor, L = inductor */
  skills: [
      { group: "Languages", prefix: "R", items: ["C / C++", "Python", "HTML / CSS", "JavaScript"] },
      { group: "Spoken Languages", prefix: "R", items: ["English", "Spanish"]},
      { group: "Tools",     prefix: "C", items: ["Git", "Linux", "VS Code", "MipSYM"] },
      { group: "Hardware",  prefix: "L", items: ["Raspberry Pi", "Networking", "Home lab", "Soldering"] }
   ],

  /* ---- blog posts ------------------------------------------------------
     Each post = a Markdown file at posts/<slug>.md plus an entry here.
     date is YYYY-MM-DD. Newest date is listed first.                      */
   posts: [
     {
         slug: "welcome",
         title: "Welcome to the board",
         date: "2026-11-22",
         tags: ["meta"],
         summary: "How this site was made."
     },
     {   
        slug: "PiHole",
        title: "Making a built-in ad blocker",
        date: "2026-11-23",
        tags: ["Raspberry Pi", "Network", "Terminal"],
        summary: "Process, What I learned, and Was it worth it?"
     }  
  ],

  /* ---- footer ----------------------------------------------------------- */
  repo: "https://github.com/kalebvillalaz/kalebvillalaz.github.io"   // "View source" link; "" to hide
};
