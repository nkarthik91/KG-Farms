KG Farms + Sales - User-Friendliness Pass

Five focused enhancements this round, each built, tested, and verified
working - not just added and assumed correct.

====================================================================
WHAT'S NEW
====================================================================

1. ONLINE/OFFLINE + "LAST SYNCED" INDICATOR
   A thin status bar now appears at the top of every page - but only
   when it has something useful to say. When everything's fresh and
   connected, it stays hidden entirely so it doesn't clutter the UI.
   Goes red and shows "Offline - showing data from X ago" the moment
   the connection drops (tested by actually simulating offline mode,
   not just reading the code), so you always know if what you're
   looking at might be stale before you act on it. Comes back and
   auto-refreshes the moment connectivity returns.

2. SESSION-EXPIRY WARNING
   Your login token is refreshed automatically on every action, so it
   only actually expires after ~6 hours of true inactivity. The app
   now warns you once, proactively, if you've been idle for a while
   and are approaching that cutoff - "save any work in progress and
   refresh" - instead of you finding out the hard way when a save
   suddenly fails.

3. APP SHORTCUTS
   Long-press (or right-click, on desktop PWA installs) the KG Farms
   icon and you'll now see "Daily Entry" and "New Sale" as direct
   shortcuts straight to those pages - skips the trip through the app
   for the two things you probably do most often.

4. SEARCH ON THE FARMS PAGE
   A search box now sits above the batch list - type a farm name or
   batch ID and the list filters instantly, both the desktop table and
   mobile cards. Shows a clear "no matches" message rather than a
   blank list if nothing's found. This is the page that will matter
   most as your batch history grows.

5. ICON FILE SIZE - CUT BY ~90%
   Your app icons and logo were larger than they needed to be for flat
   two-color graphics (a combined ~600KB across all sizes). Recompressed
   with proper palette optimization - visually identical at every size
   I checked, now a combined ~60KB. Every install and every cache
   refresh is now meaningfully lighter.

====================================================================
FULL ENGAGEMENT SUMMARY - WHERE THIS APP STANDS NOW
====================================================================

Across this whole review-and-fix process, here's everything that
changed, grouped by what it actually fixed or added:

REAL BUGS FOUND AND FIXED
- Edit Batch / Batch History were completely non-functional (a quote-
  collision in generated HTML broke the click handlers entirely) -
  this was the "editing farms isn't working" / "bs is not defined"
  issue, tracked down by actually clicking the buttons, not just
  reading the code.
- Mobile header was wrapping onto two lines on every page - the real
  cause behind what looked like "Farms page is broken" at a glance.
- A previous incomplete edit had left 3 buttons rendering as
  completely blank, invisible clickable boxes.
- Service worker was cache-first, meaning updates could get stuck
  indefinitely behind old cached files - switched to network-first.
- Auth token was exposed in a URL (now in the request body, where
  the rest of the app already correctly kept it).
- Version numbers were out of sync between the app and its own cache
  keys, meaning some updates might not have reached already-cached
  users.
- A stray duplicate HTML tag, two functions each defined twice, and a
  dead duplicate Code.js file - all cleaned up.
- An entire "FCR Slabs" feature was dead code end to end - a stub
  that did nothing, functions that were never actually wired up, and
  a data field the app never read. Removed rather than left to
  confuse anyone reading the code later.
- An unused, redundant duplicate of the farm-rename logic - removed.

USER-FRIENDLINESS / UI
- Every Add, Delete, and Edit action across the whole app converted
  to compact icon buttons - with delete specifically given a red tint
  so a destructive action still reads as different from a routine one
  even without the word "Delete" next to it.
- Navigation buttons deliberately left as text-only, as asked.
- The five enhancements above.

DEPLOYMENT / RELIABILITY
- Every round of changes was verified by actually rendering the app
  and clicking through the real flows - login, editing a batch,
  generating reports, searching, going offline - rather than trusting
  that code which "looks right" behaves right. Several real bugs in
  this app were only found this way.
- Not touched, and worth someone's attention eventually: a few sales-
  sheet column names that are a bit misleading if you're reading the
  raw spreadsheet directly, and a pre-existing single unclosed HTML
  tag that's present but harmless (every page still renders correctly
  around it).

WHERE I'D LOOK NEXT, IF YOU WANT TO KEEP GOING
- An offline write queue, so a save attempted with no signal isn't
  simply lost.
- An audit trail on sales/payouts - who changed what, and when -
  since this app now handles real money.
- A review-before-finalizing step on generated payouts.
- Splitting the 125KB app.js so pages you don't use don't have to
  load before the app is usable.

====================================================================
DEPLOY
====================================================================

1. Replace app.js, index.html, styles.css, sw.js, manifest.json, the
   icons/ folder, favicon.ico, and favicon-32.png on GitHub Pages.
2. Update Code.gs in Apps Script and redeploy: Deploy > Manage
   deployments > Edit > New version > Deploy.
3. No manual cache-clearing should be needed this time - the network-
   first service worker means updates reach users automatically the
   next time they open the app with a connection.
