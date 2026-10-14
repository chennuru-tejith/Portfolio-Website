# What I need from Tejith

Tick items off as you send them. Each one is a single line in `js/data.js` (shown in brackets); I can add it for you.

## Photos, voice, signature
- [x] **Portrait photo** for the hero frame. A well-lit, plain background, shoulders up. Put it in `assets/` (`photo`)
- [ ] **Signature**: sign your name 3 or 4 times on white paper with a black pen and send a clear photo. I'll turn the best one into a vector that writes itself (`signature`)
- [ ] **Voice clip**: about 10 seconds of you saying "Hi, I'm Tejith…", recorded on your phone in a quiet room (`voice`)
- [ ] **One line about Hyderabad**, shown on the map as "Home" (`homeNote`)

## Please review the drafts (written from your CV, in your voice)
- [ ] "A decision I'd make": the question and three reasoning steps (`decision`)
- [ ] "What 23 site visits taught me about reports" field note (`notes`)
- [ ] Case-study takeaways for Dr. Reddy's and Ion Exchange (`cases`)
- [ ] Recruiter Q&A answers (`faq`)
- [ ] "Building now" skills: only the GEO paper is from you; the other two are drafts (`buildingNow`)
- [ ] "Next badge" goal for each arena, all drafts (`gyms[].next`)

## Content to send
- [ ] **Interview slots** each week, in IST (`interviewSlots`); past ones hide themselves
- [ ] **LinkedIn posts**: your latest 1 to 3, with date, first lines and link (`linkedinPosts`)
- [ ] **LinkedIn endorsements or comments** you have permission to quote (`endorsements`)
- [ ] **Guestbook notes**: when one arrives by email and you approve it, paste it into `guestbook`
- [ ] **GEO paper** progress: tell me when it moves to Draft, Review or Published, and send the final link or PDF (`geoStage`, `writing`)
- [ ] **4 to 6 books** with one line each on what they changed for you (`books`)
- [ ] **Referees** per arena: name, role, organisation and LinkedIn link (`gyms[].referee`)
- [ ] **Recommendations**: written ones only, with permission to publish (`recommendations`)
- [ ] **Certificates and letters** for the Documents section, as PDFs (`documents`)
- [ ] **Scans of your honours** (JPG or PNG) for the proof wall: put them in `assets/proofs/` and add `image` to each honour (`achievements`)
- [ ] **Coursera verify link** for the Excel certificate; it currently points to LinkedIn (`certifications[0].verify`)

## Please review
- [ ] The two bios (25 and 100 words) in `bios`, used on the press kit and in llms.txt
- [ ] The change log (`changelog`): add a line each month

## Accounts (all free)
- [ ] **Calendly** booking link for "Book a 15-min call" (`bookingUrl`)
- [ ] **GoatCounter** site code for the visitor counter (`goatcounter`)
- [ ] **Vercel**: import the GitHub repo to put the site online
- [ ] **Domain** (e.g. `tejith.in`). After this I'll make the share image and canonical link absolute and add a sitemap
- [ ] *(Optional)* sign in to GitHub CLI: `& "C:\Program Files\GitHub CLI\gh.exe" auth login --web`

## SEO checklist (from the reel): what still needs you
- [ ] A domain: sitemap.xml and canonical tags switch on automatically once `siteUrl` is set
- [ ] Rewrite my drafted text in your own words (About intro, Q&A answers, case takeaways, building-now and next-badge goals): search engines and recruiters both reward genuine writing
- [ ] Backlinks: your site link on LinkedIn, GitHub, and any JGU or club page that lists you

## Getting found by AI assistants (after the site is live)
- [ ] Put the live address in `siteUrl` (js/data.js), run `node build.js`, push
- [ ] Submit the site to **Google Search Console** and **Bing Webmaster Tools** (Bing feeds ChatGPT search and others)
- [ ] Add the site link to **LinkedIn** (Contact info + Featured) and the **GitHub** profile website field + README
- [ ] Ask for a link from any JGU / club page that lists you (independent corroboration)
- [ ] When the GEO paper is published (e.g. SSRN), link it from the site and the site from it
- [ ] Re-run your own replication protocol with prompts like "Who is Chennuru Tejith?" across the five assistants
- [ ] Confirm you're happy showing the GEO study design (five assistants) publicly on the site

## Optional
- [ ] Your birthday, if you'd like a small seasonal greeting on that day (`seasons`)
