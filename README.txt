KG Farms + Sales - Fixed & Polished

Everything reviewed, fixed, tested by actually rendering pages (not
just reading code), and packaged. Code.js is intentionally NOT
included - it was a byte-identical duplicate of Code.gs, pure dead
weight, safe to just delete from your repo.

====================================================================
BUGS FIXED
====================================================================

1. MOBILE "MORE" MENU WAS A RED HERRING, BUT I FOUND THE REAL BUG
   I initially suspected the More menu (which hides Farms, Sales,
   Payout, Rate Fixing, Trader Statement, Batch Details, Settings on
   mobile) was completely broken. I tested it three separate ways
   before concluding it actually works fine - my first test just
   clicked too fast, before the app's own post-login page routing had
   settled. Real users won't hit this.

   The REAL mobile problem: the header (logo + "KG Farms" + ADMIN
   badge + Logout + Refresh) genuinely doesn't fit in a ~390px phone
   screen and was wrapping onto two lines on every single page - most
   noticeable on content-heavy pages like Farms, which is almost
   certainly what looked "broken" to you. Fixed by making Logout and
   Refresh icon-only on mobile (a power icon and a refresh icon) while
   keeping full text on desktop. Verified: header now fits on one line
   on a 390px-wide screen.

2. FOUND A 4TH BUG WHILE DOING THE ICON CONVERSION YOU ASKED FOR
   A previous edit (a code comment literally said "v48 requested UI
   cleanup") had already tried to convert 3 buttons to icon-only, but
   only did half the job: it hid the button TEXT but never actually
   added an icon to replace it. Those 3 buttons (2x Edit on Daily
   Entry, 1x Delete Batch) were rendering as completely blank,
   invisible clickable boxes. Fixed as part of the icon conversion
   below.

3. Service worker was cache-first (serves old cached files before
   ever checking for updates) - same class of bug I've already found
   and fixed in the other KG Farms app. Switched to network-first:
   always fetches the latest files when online, falls back to cache
   only when offline.

4. Auth token was being sent as a URL query parameter on the main data
   load (ends up in logs/browser history). Moved to the POST body,
   matching how every other authenticated action in the app already
   correctly does it. Verified with a network-level check that the
   token no longer appears in any URL.

5. Version mismatch: this was labeled v48 but internally still used
   v47's cache-key strings, meaning already-cached users may not have
   picked up whatever changed between those versions. Bumped
   everything to v49, consistently, in both the service worker and the
   app's local storage keys.

6. Duplicate `</head></head>` tag in index.html - fixed.

7. Two functions were each defined twice, byte-identical
   (selectedSaleMetaFromModal, colWidthFromTexts) - real risk if
   someone edits one copy later without knowing the other exists.
   Removed the redundant copies.

8. Backend: the entire "FCR Slabs" feature was dead code - a stub
   initializer that did nothing, two management functions that were
   never wired up to anything callable, and a bundle field that always
   returned empty regardless of what was in the sheet. The real FCR
   calculation uses a completely different formula and never touched
   this table. Removed all of it - confirmed the frontend never read
   any of it first.

9. Backend: `renameFarm` was dead code too (frontend only ever calls
   the newer `updateFarm`). Removed.

====================================================================
ADD / DELETE / EDIT - NOW ICON-ONLY, EVERYWHERE
====================================================================

Converted every text-labeled Add/Delete/Edit button across the whole
app - Daily Entry, Vaccine, Farms (both desktop table and mobile
card), Sales, Settings (users, incentive reasons) - to compact icon
buttons with a tooltip and screen-reader label, so nothing is lost for
accessibility even though the visible text is gone:
- Add -> ＋ (green, since it's a constructive action)
- Edit -> ✎
- Delete -> 🗑, with a red-tinted border/color specifically for delete
  buttons, so a destructive action still visually reads as different
  from Edit even without the word "Delete" - this matters once text is
  gone, since two neutral-looking icon buttons sitting side by side
  invites mis-taps.

Two page-level "add" buttons (+ Daily Entry, + Add Vaccine) I treated
slightly differently: they now follow the same responsive pattern this
app already used for "+ Add Batch" - full text on desktop, icon-only
on mobile - since these are the single primary action for their whole
page, and desktop has the room to keep them clear.

Standardized all of this on one CSS pattern (.iconBtn) instead of the
two different, partially-broken approaches that existed before.

Navigation buttons (Daily Entry, Feed, Orders, etc.) were not touched
- confirmed they were already text-only with no icons.

====================================================================
LOADING SPEED
====================================================================

Fixed: network-first service worker (see bug #3) - the biggest lever
available purely on the frontend.

ALTERNATE IDEA FOR MUCH FASTER LOADING (bigger change, your call)

The real ceiling on speed right now is Google Apps Script itself -
every data load has to spin up an Apps Script execution, open your
Spreadsheet, read and process every sheet, and return JSON. That
round-trip is commonly 1-3+ seconds no matter how clean the code is,
and worse on a cold start.

The architectural fix: keep Google Sheets exactly as it is today (all
your existing data entry, formulas, and Apps Script business logic
stay untouched), but add a lightweight one-way sync - a time-based
Apps Script trigger running every 1-2 minutes (or firing after every
save) - that pushes a snapshot of the bundle to Firebase Realtime
Database (free tier is generous for this data size). The app's data
LOAD would then read from Firebase instead of calling Apps Script's
doGet - Firebase reads typically respond in well under 200ms, globally,
versus Apps Script's multi-second round trip.

Writes (creating a sale, marking a vaccine done, etc.) would still go
through Apps Script exactly as now, since that's where your validation
and business logic lives - only the READ path changes. This means data
could be up to ~1-2 minutes old on load (same tradeoff the app already
makes today with its 2-minute cache-skip logic), in exchange for the
initial load and every refresh feeling close to instant.

This is a real infrastructure change - a few hours of setup (a Firebase
project, the sync trigger, swapping the load() function's data source)
- not a small tweak, so I'd want your go-ahead before building it. But
it's the only lever left that would make this "much much faster"
rather than just "somewhat faster."

====================================================================
NOT CHANGED / WORTH KNOWING
====================================================================

- A single pre-existing, harmless HTML tag-count mismatch in
  index.html (1 unclosed <div> somewhere) was already present in the
  original v48 file, before any of my edits - confirmed by checking
  the untouched original. Every page rendered and tested cleanly
  despite it, so I left it alone rather than risk a speculative fix
  hunting for it in an already-large round of changes. Flagging it so
  it's not a surprise later.
- Sales sheet's "Incentive Rate/Amount" naming is still a bit
  misleading (flagged in the last review) - left untouched since it
  affects live spreadsheet column headers and needs your call before
  touching.

====================================================================
DEPLOY
====================================================================

1. Replace index.html, app.js, styles.css, sw.js, manifest.json, and
   the icons/ + favicon files on GitHub Pages.
2. Do NOT re-upload Code.js - delete it from your repo if it's there;
   it was always just a duplicate of Code.gs and served no purpose.
3. Update Code.gs in Apps Script and redeploy: Deploy > Manage
   deployments > Edit > New version > Deploy. This round removed
   backend functions, so saving alone won't update the live app.
4. Because of the version bump and service worker fix, existing users
   should get the update automatically next time they open the app
   with a connection - no manual cache-clearing should be needed this
   time (that was a one-off fix for the OTHER app's specific history).
