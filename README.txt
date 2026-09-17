KG FARMS - v57
==============

ALL 7 ITEMS FIXED. Each one was traced to an actual cause and
verified in a real browser, not just changed and hoped for.

1. FEED ORDER IMAGE CRASH ("colWidthFromTexts is not defined")
   Cause found: the Feed Order image generator was calling a helper
   that only exists inside the Vaccination image generator. It was a
   private helper to each one, and the Feed Order copy had gone
   missing. Restored it. Image now generates correctly.

2. SALE ENTRY - EDIT BUTTON INVISIBLE
   Cause found: the button was always there and clickable - it was
   rendering WHITE TEXT ON A WHITE BACKGROUND. Inherited styling was
   forcing the text colour to white. It now reads "Edit" in green.
   (Confirmed by reading the actual computed colour in the browser:
   it was rgb(255,255,255) on rgb(255,255,255).)

3. SALE ENTRY - COLUMN ALIGNMENT
   Cause found: five different conflicting CSS rules for the same
   row, two of which defined only 5 columns while the row actually
   renders 6 cells. Removed the two stale rules. Header and data
   columns now match exactly - verified 6 vs 6 on both desktop and
   mobile.

4. REMAINING BIRDS
   Added a "REMAINING BIRDS" tile right after SALE AVG. Counts down
   live as entries are added (live birds minus birds sold so far).

5. TRADER STATEMENT PDF
   - Farm column removed.
   - All table data centre-aligned (Remarks stays left, as it wraps).
   - Compacted for A4: tighter padding, smaller font, 8mm margins.

6. WHATSAPP BUTTON REMOVED from the Payout page, along with the now
   unused function behind it.

7. CLOSED BATCH HISTORY - "No completed sale history yet"
   Cause found: closed batches are deliberately excluded from the
   main data load, so the history screen had nothing to read. There
   was no way to fix this in the app alone.
   Added a new backend action (getBatchHistory) that fetches a closed
   batch's sales, mortality and payouts on demand. The history screen
   now falls back to it automatically when local data is empty.
   Note: I verified the exact spreadsheet column positions before
   writing this rather than assuming - my first attempt had them
   wrong and would have shown blank/incorrect figures.

8. FEED TRACKING NOT WORKING
   Cause found: the page asks you to "select a date before loading",
   but the date inputs were NEVER ADDED to the page. It was asking
   for something impossible to give it.
   Added the From / To date pickers, a Farm dropdown and a Clear
   button. Verified data now loads.

TESTING
-------
Real browser, desktop (1300px) and mobile (390px):
Orders page + all buttons, Feed Order image generation, Feed Tracking
loading data, sale entry flow with per-entry vehicles, column
alignment, Edit button visibility (checked computed colour values),
remaining birds tile, trader statement PDF headers and alignment,
payout page, closed batch history via the new server action.
Zero JavaScript errors in every test.

DEPLOY
------
Code.gs CHANGED - needs a real redeploy, not just a save:
  Deploy > Manage deployments > Edit > New version > Deploy
Then replace app.js, index.html and styles.css.

Both Feed Tracking and Closed Batch History depend on the new
Code.gs, so they will not work until it is redeployed.
