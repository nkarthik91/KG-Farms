KG Farms + Sales - Feed Tracking Page + Faster Loading

====================================================================
NEW PAGE: FEED TRACKING
====================================================================

New "Feed Tracking" page (sidebar / More menu, admin only) - exactly
what was asked: a date-wise view of every bag supplied and every bag
transferred, in one unified timeline, with a farm filter.

- Grouped by date, newest first.
- Each entry is clearly tagged "Supplied" (green) or "Transferred"
  (orange) so the two don't blur together at a glance.
- Filter dropdown: "All Farms" or any single farm. For transfers, a
  farm shows up if it's on EITHER side of the transfer (sent or
  received) - tested specifically to make sure a farm's incoming
  transfers aren't missed when filtered to just that farm.
- Clean empty state when a farm has no activity yet, instead of a
  blank page.

Tested end to end: date grouping count, total entry count, and the
filtered count all verified against the actual mock data, on both
desktop and mobile layouts.

====================================================================
LOADING SPEED: MOVED THE DATA CACHE TO INDEXEDDB
====================================================================

The app's local cache (what lets it show data instantly on a repeat
visit instead of waiting on a fresh network call) was stored in
localStorage, which has two real downsides: it's synchronous (can
briefly freeze the page on larger data) and capped around 5-10MB
total. With this page adding more history to the bundle - and more
history accumulating over time regardless - that cap was only going
to matter more, not less.

Moved the actual data cache to IndexedDB (async, effectively no
practical size limit for this kind of data). The lightweight "when was
this last synced" timestamp stays in localStorage on purpose - it's
tiny and needs instant access for the sync-status indicator, so there
was no reason to move it.

Verified, not assumed: confirmed the data actually lands in IndexedDB
now, confirmed localStorage no longer holds the heavy blob, confirmed
a page reload still shows data instantly from the new cache, confirmed
the existing "don't re-fetch if synced within 2 minutes" behavior
still works with the new storage, and confirmed logging out actually
clears it.

Also found and fixed, while in this part of the code: a cache-cleanup
function (clearLegacyCache) existed in the code but was never actually
called anywhere - dead code that should have been tidying up old
cached versions on every app load and wasn't. It's wired in now, and
extended to also clean up the old localStorage bundle blobs that are
obsolete now that they live in IndexedDB instead.

====================================================================
MINOR ENHANCEMENTS - NOT BUILT, FOR YOU TO PRIORITIZE
====================================================================

Things I noticed or that were already on the list from earlier that
are still genuinely worth doing, roughly in order of what I'd tackle
first:

1. No way to undo a Feed Transfer once entered. If someone fat-fingers
   a transfer, right now there's no correction path short of a second,
   opposite transfer. Worth a "void" action with the same approval-
   style safeguard as feed orders.
2. Search/filter on Sales history and Trader Statement - Farms got
   this, those two pages didn't yet.
3. A visible count/badge for orders waiting on approval, so it doesn't
   require a manual check of the Orders page to notice one's sitting
   there.
4. Export Trader Statement and Payout to PDF - still on the list from
   before, not started.
5. A date-range filter on the new Feed Tracking page (beyond just
   farm) - not urgent today, but worth adding before the history gets
   long enough that scrolling through everything gets tedious.
6. Offline write queue, so a save attempted with no signal isn't
   simply lost - flagged before, still real value given how often farm
   connectivity actually drops.
7. Soft-delete with restore for batch deletion - currently permanent,
   no undo, flagged in an earlier round.
8. Splitting app.js so pages you don't use don't have to load before
   the app is usable - the other half of "faster loading," bigger and
   riskier than the IndexedDB change, so I kept it separate rather
   than bundle it into this round.

====================================================================
DEPLOY
====================================================================

app.js, Code.gs, index.html, and styles.css all changed this round.
Update Code.gs in Apps Script and redeploy: Deploy > Manage
deployments > Edit > New version > Deploy - this round added new
backend data (feedSupplyLog), so saving alone won't push it live.
Then replace the rest of the files as usual.
