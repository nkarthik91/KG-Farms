KG FARMS - v59
==============

I found three genuine bugs. All three were real code faults, not
deployment problems. Details below, in the order they matter.


BUG 1 - THE APP STOPS REFRESHING AFTER THE FIRST LOAD
-----------------------------------------------------
This is the big one. It explains "loading is very slow" and is also
half the reason cancel appeared not to work.

A variable (FORCE_LIVE_NEXT_LOAD) was used in three places but never
actually created anywhere. In the loading function it is read on a
line that sits OUTSIDE the error handling, so:

  - First load after opening the app: works (nothing cached yet).
  - Every load after that: crashes instantly with
    "FORCE_LIVE_NEXT_LOAD is not defined".

The crash is silent. Nothing appears on screen. The app simply keeps
showing whatever it had cached, forever. The Refresh button does
nothing. The 5-minute auto-sync does nothing.

So the app was not "slow" - it had stopped loading entirely and you
were looking at old data.

I proved this rather than guessing. I ran the same test against the
v58 files I sent you last time:

    v58 after reload  -> errors: ["FORCE_LIVE_NEXT_LOAD is not defined"]
    v58 Refresh button -> load() THREW: FORCE_LIVE_NEXT_LOAD is not defined
    v58 total data fetches: 1        <- never fetched again

    v59 after reload  -> errors: []
    v59 Refresh button -> load() ok
    v59 forced refresh -> fetches fresh data

Important: this bug is in the v55 you uploaded as well, so it has been
there the whole time, through v56, v57 and v58.


BUG 2 - EVERY ORDER IN ONE CART GOT THE SAME ORDER NUMBER
----------------------------------------------------------
Look at your own Orders screenshot: all five rows say FO0017.

Cause: the order number is worked out by looking at the sheet for the
highest number so far. But when you order several batches at once,
all the rows are built first and written to the sheet together at the
end. So each row looked at the sheet, saw the same "highest number",
and every one of them became FO0017.

Then, when you press Cancel on FO0017, the code finds the FIRST row
with that number and cancels only that one. The other four stay
PENDING. From your side: you cancel it, and it is still there.

The same fault affected Supply, Approve and Reject - they all acted on
the first matching row, not the one you clicked.

Fixed in two parts:

  a) New orders now get proper sequential numbers. Verified:
     a 5-item cart after FO0016 now produces
     FO0017, FO0018, FO0019, FO0020, FO0021 - all unique, and the
     next cart continues from FO0022 with no overlap.

  b) Your sheet ALREADY contains five rows numbered FO0017, and fixing
     the numbering does not repair those. So Cancel / Supply / Approve
     / Reject now also send the farm and feed type, and the server
     matches on all three. This means the existing FO0017 rows can now
     be cancelled individually.

     Verified with your real data shape - clicking Cancel on the third
     row now sends:
       orderNo=FO0017 & batchId=SI0002 & feedType=BSC
     instead of blindly hitting the first row. Confirmed on both
     desktop and mobile.


BUG 3 - THE FIREBASE SPEED-UP WAS NOT IN THE APP AT ALL
--------------------------------------------------------
We set up Firebase together - database, service account, security
rules, the 5-minute sync. The backend still sends data to Firebase
every 5 minutes.

But the app had no Firebase code in it whatsoever. No SDK, no config,
no fast-read path. It was lost when the v55 branch was made, and I
built v56-v58 on top of that without noticing.

So Firebase has been filling up with data that nothing ever read, and
every load went the slow route.

Restored, and it fails safe: if Firebase is unavailable, blocked, or
not signed in, it silently uses the normal route exactly as now. I
tested with the Firebase SDK completely blocked and the app worked
normally with zero errors.

NOTE: the fast path only activates once Firebase Authentication is
switched on in your Firebase project (Build > Authentication > Get
started > enable "Anonymous"). Until then it will keep using the
normal route - working, just not faster.


ALSO FIXED
----------
- Service worker was failing to update its cache ("Failed to execute
  'clone'"). It made the copy too late, after the page had already
  read the response. Fixed, and cache name bumped so old files are
  cleared out.
- Refresh button now always fetches fresh data. Previously it would
  do nothing if data was under 2 minutes old.
- Two duplicated, unreachable entries removed from the server's action
  list (getBatchHistory, saveAssumptions).


NEW: YOU CAN NOW SEE WHAT IS HAPPENING
---------------------------------------
Settings now shows one line:

    App build v59  •  Backend build v59  •  Last load: Firebase 120ms

- "App build" not v59       -> app.js/index.html upload did not work
- "Backend build not deployed (old Code.gs)" -> Apps Script not redeployed
- "Last load" tells you where the data came from and how long it took:
    "Firebase 120ms"              = fast path working
    "Apps Script 2400ms"          = slow path
    "from local cache (synced 1 minute ago)" = served from cache
    "Firebase not signed in -> Apps Script" = Firebase Auth not enabled

If it is ever slow again, just read that line and tell me what it says.


TESTED
------
Real browser, desktop (1400px) and mobile (390px), with your actual
data shape including the five duplicate FO0017 rows:
  - Cancel targets the correct row (desktop and mobile)
  - Supply targets the correct row
  - Feed Order Image generates correctly (all 5 farms, totals correct)
  - Reload with cached data: no errors
  - Refresh forces a real fetch
  - Firebase SDK fully blocked: app still works, zero errors
Zero JavaScript errors in every test.


DEPLOY
------
Upload ALL of these: app.js, index.html, styles.css, sw.js
(sw.js matters - it clears the old cache)

Apps Script: paste Code.gs, then
  Deploy > Manage deployments > Edit > New version > Deploy

Then close the app completely, reopen, and check Settings.
It should read: App build v59 • Backend build v59
