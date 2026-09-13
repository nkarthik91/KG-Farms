KG Farms + Sales - Assumptions Feature + Auto-Sync

====================================================================
TWO OF YOUR FOUR REQUESTS WERE ALREADY DONE
====================================================================

Checked both carefully before building anything new:

- "Synced" indicator near the role badge - already there, confirmed
  with a real screenshot on a busy page (not just an empty one where
  it might coincidentally look right).
- Feed Tracking date filter - already built (From/To date fields,
  "Clear dates" button), confirmed it actually narrows results
  correctly.

Given the pattern from your last two messages, this is very likely
the same deployment gap as the vaccine sort issue - your live site
probably just hasn't picked up the files from a recent round yet.
Worth checking with the same incognito-window test as before.

====================================================================
NEW: AUTO-SYNC EVERY 5 MINUTES
====================================================================

The app now checks for new data automatically in the background,
every 5 minutes by default, only while the tab is actually visible
(won't waste your data/battery syncing a backgrounded tab).

====================================================================
NEW: THE "ASSUMPTIONS" FEATURE
====================================================================

New "Assumptions" button in the header (next to Refresh, admin only).
Click it to see every built-in threshold this app uses to make
automatic decisions, in plain language, with the ability to change
each one:

- Feed stage completion tolerance (bags) - currently 3
- Bird reconciliation variance (birds) - currently 20
- Vaccine reminder (days before) - currently 1
- Auto-sync interval (minutes) - currently 5
- Cache freshness window (minutes) - currently 2
- Session warning (minutes before expiry) - currently 15

A REAL BUG THIS UNCOVERED: while building this, I found that two of
these values (stage tolerance and bird reconciliation) already had
full, working backend storage - they were being saved and returned
correctly - but the app's frontend was never actually reading them.
It was using its own separate hardcoded copies instead. This means if
anyone had ever tried to customize these before, it would have
silently done nothing. That's fixed now - all six values are properly
connected end to end, save to the same place, and take effect
immediately.

Verified specifically, not just assumed: confirmed the button is
hidden for Supervisor accounts, confirmed all six fields show the
correct current values when opened, confirmed saving sends exactly
what was typed, and - most importantly - confirmed that changing a
value (tested with feed stage tolerance) actually changes the app's
real behavior immediately, not just what's displayed in the modal.

====================================================================
DEPLOY
====================================================================

Code.gs changed significantly this round (new saveAssumptions action,
new settings fields) - needs an actual redeploy in Apps Script:
Deploy > Manage deployments > Edit > New version > Deploy. app.js,
index.html, and styles.css changed too - replace as usual.

Given the last couple of rounds, it's worth double-checking after
deploying: open the Assumptions modal and confirm it shows real
numbers (3, 20, 1, 5, 2, 15) rather than blanks or zeros - that
confirms Code.gs actually went live.
