KG FARMS - v56
==============

FIXED
-----

1. ORDERS PAGE (was completely broken)
   Three functions were missing from v55 entirely: cancelOrder,
   approveFeedOrderConfirm, rejectFeedOrderConfirm. The rows were
   rendering fine, but every Cancel / Approve / Reject button threw
   an error on click. Restored. The backend actions for all three
   already existed, so only the frontend was missing.

2. 5-MINUTE SYNC (two separate causes)
   - There were TWO timers: the correct one that honours your
     Assumptions setting, plus a leftover hardcoded 5-minute timer
     calling load() unconditionally. Removed the leftover.
   - The remaining timer was being silently blocked by the cache
     guard (skips fetching if data is under 2 min old). Auto-sync
     now forces a live fetch.
   Both needed fixing - either alone would not have worked.

3. ORDER APPROVAL RULE
   Now triggers only when the order EXCEEDS (required - supplied).
   Ordering less is allowed with no warning.
   The hard block on BPSC/BSC is removed - all three feed types can
   now be ordered above requirement with approval, same as BFP.

4. STAGE AUTO-SUPPLY (new)
   When a later feed type is ordered, any earlier feed type short by
   no more than the tolerance is automatically marked SUPPLIED and
   stops showing as pending.
   Tolerance default changed 3 -> 5 bags, editable in Assumptions.
   Tested against 5 cases: within tolerance closes, beyond tolerance
   does not, ordering BFP closes both BPSC and BSC, ordering the
   first stage does nothing, and cancelled orders are never revived.

5. VEHICLE NUMBER (root cause was the data structure)
   The Sale Entries sheet had NO vehicle column - vehicle was stored
   once per SALE, which is why editing it changed every entry. There
   was no way to fix this in the UI alone.
   Added a "Vehicle No" column to Sale Entries and wired it through
   all three write points and both read points. Each entry now keeps
   its own vehicle. Verified with two entries on different vehicles.

6. SALES ENTRY SIMPLIFIED
   - Supervisor removed completely.
   - Vehicle is now a plain optional text box, typed when needed.
     It carries over to the next entry but stays editable.
   - Fields reordered: Trader -> Kg -> Birds first (the common path),
     date and vehicle below.
   - New "Save & Add Another" button keeps the form open and clears
     only kg and birds, so several traders can be entered quickly.
   - Cursor lands in Kg automatically.

7. AVERAGE WEIGHT -> 3 DECIMALS
   Applied at all 7 display points. Also fixed a separate bug found
   on the way: the sale entries table was printing the raw unrounded
   number (0.8571428571428571) instead of a rounded one.

8. ASSUMPTIONS MOVED
   Out of the top-right header, now a button on the Settings page.

ALSO CLEANED UP
---------------
Removed 5 dead functions (selectedSaleMeta, selectedSaleMetaFromModal,
toggleSaleOther, toggleSaleModalOther, saleOptionValues). These
referenced page elements that no longer exist anywhere - leftovers
from an earlier version.

NOT DONE - FEED TRACKING
------------------------
I diagnosed it but did not change it. v55 rewrote this page to:
  (a) show nothing until you pick a date, and
  (b) fetch from the server via a getFeedTracking action instead of
      using data already loaded.
That action DOES exist in the Code.gs you have. So "not working"
could mean the empty-until-you-pick-a-date behaviour looking broken,
or a real server error.

Please open Feed Tracking, pick a From date, and tell me exactly what
appears on screen. I did not want to guess and rewrite a working page.

TESTING
-------
Ran in a real browser: Orders page (rows + all buttons), the full
sales flow with two different vehicles, the approval warning firing
only when exceeding, Assumptions in its new location, Feed page stage
display with the 5-bag tolerance, and mobile layout at 390px.
Zero JavaScript errors in every test.

DEPLOY
------
Code.gs CHANGED - needs a real redeploy, not just a save:
  Deploy > Manage deployments > Edit > New version > Deploy
The new "Vehicle No" column is added to Sale Entries automatically
on first use. Existing sale entries keep working - they just show
the sale-level vehicle until new entries are added.

Then replace app.js, index.html, styles.css as usual.
