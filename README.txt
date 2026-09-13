KG Farms + Sales - Firebase Fast-Loading (Frontend Complete)

====================================================================
WHAT THIS ROUND ACTUALLY DELIVERS
====================================================================

This is the piece that makes loading genuinely fast. Login now signs
you into Firebase automatically (using the credential your backend
already mints), and every subsequent load tries Firebase first -
falling back to Apps Script instantly and invisibly if anything about
Firebase isn't available for any reason. You should never be able to
tell the difference except that it's faster.

====================================================================
HOW I TESTED THIS, GIVEN I CAN'T REACH YOUR REAL FIREBASE PROJECT
====================================================================

My environment has no internet access, so I couldn't test this
against your actual live Firebase project the way I test everything
else in this app. What I did instead: built a fully controllable fake
version of the Firebase SDK and ran the app against it, checking every
branch of the logic individually:

- No Firebase session yet -> correctly uses Apps Script (this is what
  everyone will see immediately after this update, until they log out
  and back in once - expected, not a bug, see below)
- Firebase signed in, working -> uses Firebase exclusively, confirmed
  Apps Script is not even called
- Firebase signed in, but the read fails -> falls back to Apps Script
  cleanly
- Firebase signed in, but slow/hanging -> gives up after 4 seconds and
  falls back, rather than leaving you waiting indefinitely
- Login actually calls Firebase sign-in with the exact token your
  backend generates
- Logout actually clears the Firebase session (so a different person
  logging in on the same device doesn't inherit it)
- The Firebase SDK failing to load at all (blocked, offline, whatever)
  - confirmed the entire app still works completely normally

A REAL BUG THIS TESTING CAUGHT: while checking "does my own save show
up immediately after I make it," I found that right after saving
something, if you reload within the app's existing 2-minute cache
window, it could skip fetching ANYTHING new - not just skip Firebase,
skip the update entirely. This bug already existed before any of the
Firebase work, I just hadn't had a reason to test that specific
sequence before. Fixed now: right after any save, the very next load
always fetches fresh data, guaranteed, regardless of Firebase or the
cache window.

====================================================================
WHAT TO EXPECT WHEN THIS GOES LIVE
====================================================================

- Anyone already logged in when you deploy this will keep working
  exactly as before (Apps Script) until they next log out and back in
  - that's when they'll get a Firebase credential and start getting
  the speed benefit. This is intentional, not a bug - no one gets
  disrupted mid-session.
- Once someone has logged in after this update, their loads should
  feel noticeably faster - especially the very first load after
  opening the app, and the background auto-sync every 5 minutes.
- If Firebase is ever slow, misconfigured, or unreachable for any
  reason, the app quietly falls back to Apps Script - there is no
  failure mode where the app stops working because of this feature.

====================================================================
DEPLOY
====================================================================

app.js, index.html, and Code.gs all changed. Update Code.gs in Apps
Script and redeploy (Deploy > Manage deployments > Edit > New version
> Deploy), then replace the rest of the files as usual.

After deploying, log out and back in once yourself to pick up the
Firebase credential, then try a normal load - if you want to actually
see the speed difference, open your browser's developer tools Network
tab before reloading and compare how long the data request takes.
