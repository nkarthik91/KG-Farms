KG Farms + Sales - Feed Transfer + Farms Page Enhancements

I want to be upfront about something first: while building this, I made
a real mistake mid-edit - a str_replace meant only as an insertion point
accidentally deleted two working branches from a function
(refreshCurrentPage), which would have broken refresh-after-action on
the Batch Details and Sales pages. I caught it by re-reading the
function immediately after the edit, before testing or packaging
anything - fixed it, verified it against what the function should be,
and then separately re-tested all six page branches individually to
confirm each one actually works. Telling you this because I'd rather
you know it happened and was caught than not mention it.

====================================================================
NEW: FEED TRANSFER BETWEEN BATCHES
====================================================================

New "Transfer Feed" button on the Feed page. Pick a source batch, a
destination batch, a feed type (BPSC/BSC/BFP), and a quantity - the
transfer:
- Reduces the SOURCE batch's available stock
- Increases the DESTINATION batch's supplied total (which correctly
  feeds into their required-vs-supplied balance, exactly like a normal
  delivery would)

A live "Available at source: X bags" hint updates as you change the
source batch or feed type, so you can see what's actually available
before attempting the transfer. Validated both client-side (instant
feedback - can't pick the same batch twice, can't submit a zero
quantity) and server-side (can't exceed what's actually available,
can't transfer to/from a closed batch) - server-side is the real
source of truth, client-side is just for a faster, friendlier no-
round-trip response on obvious mistakes.

A new "Feed Transfer History" section on the Feed page shows every
transfer that's happened - who gave, who received, when, how much,
and any remarks.

HOW THIS WAS BUILT TO NOT CONFLICT WITH EXISTING DATA: rather than
overwrite a farmer's actual reported stock number, transfers are
tracked in their own ledger and layered on top of the existing
calculation - a batch's available stock is now "what was last reported
in a Daily Entry, minus any transfers out since that report." This
means a farmer's own daily entries stay exactly as they reported them;
transfers are additional, separate history, not edits to existing
records.

====================================================================
FARMS PAGE - SORTING, STATUS, SEARCH
====================================================================

- Fixed a real bug: batch dates were being sorted as plain text, so
  "01-09" sorted before "25-08" even though August comes first
  chronologically. Now parsed and compared as actual dates.
- Defaults to oldest-first; a dropdown lets you switch to Newest
  First, Farm Name A-Z, or Batch ID A-Z.
- Active / Closed / All filter tabs, plus a status badge and a one-tap
  close/reopen button per row - this reuses backend logic that already
  existed and was already tested, it just wasn't surfaced on this page
  before.
- The search box added previously still works alongside all of this.

Caught and fixed two real CSS bugs while building this (found by
screenshotting, not by guessing): a status badge crowding into the
neighboring table column on desktop, and a completely different bug
on mobile where an existing, unrelated CSS rule (meant only for the
batch ID text) was also grabbing the new badge and stretching it full
width.

====================================================================
WHAT I DIDN'T GET TO THIS ROUND
====================================================================

Still outstanding from your fuller list: IndexedDB migration, splitting
app.js by page, a payout confirmation/review step, and PDF export for
Trader Statement and Payout. None of these touch what shipped here -
happy to pick any of them up next.

====================================================================
DEPLOY
====================================================================

1. Replace app.js, index.html, styles.css, sw.js, manifest.json, the
   icons/ folder, favicon.ico, and favicon-32.png on GitHub Pages.
2. Update Code.gs in Apps Script and redeploy: Deploy > Manage
   deployments > Edit > New version > Deploy. This round added a new
   sheet ("Feed Transfers") and new backend functions - saving alone
   will not push this live.
3. The new "Feed Transfers" sheet will be created automatically the
   first time it's needed (same as how other sheets in this app already
   work) - no manual spreadsheet setup required.
