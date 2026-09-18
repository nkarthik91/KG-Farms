KG FARMS - v60
==============

DIRECT FEED SUPPLY IS NOW A MULTI-ROW TABLE
--------------------------------------------

Feed page > Direct Supply now opens a table with exactly the columns
you asked for:

    FARM NAME        FEED TYPE   BAGS   DELIVERY DATE
    Deepa Paravalasu     BSC      25     18-09-2026    [x]
    Gunasekar Kanth...   BFP      90     18-09-2026    [x]
                       [ + Add Row ]
    Remarks (applies to all rows)

- Opens with one row ready to fill.
- "+ Add Row" adds another row underneath. It copies the farm, feed
  type and date from the row above, so entering several farms on the
  same delivery date is quick - you usually only change the farm and
  the bags.
- The [x] on each row removes it. It is hidden when only one row is
  left, so you cannot end up with an empty table.
- Remarks are entered once and applied to every row.

This records feed as ALREADY DELIVERED (same as before), just several
farms in one go instead of one at a time. Stock goes up immediately.
No order is created.

On a phone each row stacks into its own small card - farm on its own
line, then feed type and bags side by side, then the date - so nothing
is squeezed. Checked at 390px wide.


SAVING IS ONE REQUEST, NOT ONE PER ROW
---------------------------------------
A new server action (addFeedSupplies) saves the whole table in a
single call. Saving five farms is one request, not five.

Two things worth knowing about how it behaves:

1. Every row is checked BEFORE anything is written. If one row is
   wrong, nothing at all is saved and you are told which row. You
   cannot end up with half the table saved.

   Verified: closed batch, zero bags, negative bags, unknown farm,
   bad feed type, absurd quantity - each is rejected with a clear
   message naming the farm.

2. The supply numbers (FS0003, FS0004, FS0005...) are generated from
   a single sequence read and written together. This is deliberate -
   it is the exact mistake that caused the duplicate FO0017 order
   numbers, so I made sure not to repeat it here. Verified that a
   4-row save after FS0003 produces FS0004-FS0007, all unique, and
   the next save continues cleanly from there.


TESTED
------
Real browser, desktop (1300px) and mobile (390px):
 - Direct Supply button opens the table
 - + Add Row adds rows; remove takes them away
 - All four columns present and correctly labelled
 - Saved payload carries every row with its own farm/feed/bags/date
 - Existing features still fine: order rows list, Cancel, Feed Order
   Image all still work
Zero JavaScript errors in every test.

Everything fixed in v59 (the refresh crash, duplicate order numbers,
row-precise cancel/supply, Firebase fast path, service worker) is
still in here.


DEPLOY
------
Upload: app.js, index.html, styles.css, sw.js

Apps Script: paste Code.gs, then
  Deploy > Manage deployments > Edit > New version > Deploy

Code.gs MUST be redeployed this time - the multi-row save uses a new
server action and will not work without it.

Then check Settings. It should read:
    App build v60 • Backend build v60
If the backend still says v59 or "not deployed", the Apps Script step
did not take effect and Direct Supply will error when you save.
