KG Farms + Sales - Vaccine Sort Fixed + Reminder Added
(checkpoint - your full request is much bigger than one round, see
note at the bottom)

====================================================================
DONE THIS ROUND - VACCINE SCHEDULE
====================================================================

1. FIXED THE SORT ORDER
   Confirmed the cause: vaccine dates are stored as text ("12-09-2026")
   and were being sorted as TEXT, not as actual dates - so "01-09"
   would sort before "25-08" even though August comes first. This is
   the same underlying bug I found and fixed on the Farms page a few
   rounds back. While fixing it here, I checked the rest of the app
   for the same mistake and found it in FIVE more places that had
   never been reported as broken: sale-date sorting (two separate
   spots), the per-batch vaccine list on Batch Details, daily entries
   on Batch Details, and rate entries on Rate Fixing. All seven fixed
   with the same one proven date-parsing approach, not seven different
   patches.

2. ADDED THE 1-DAY-BEFORE REMINDER
   A new banner - "Vaccine due tomorrow: [farm] — [vaccine]" - now
   shows on the Daily Entry page (the first thing anyone sees) and
   again on the Vaccine page itself, listing every vaccine scheduled
   for exactly tomorrow. Tested with vaccines due today, tomorrow, in
   5 days and in 10 days in the same batch of data, and confirmed only
   the "tomorrow" one triggers the reminder while the sort order
   correctly shows all four in the right sequence.

====================================================================
ABOUT THE REST OF YOUR REQUEST
====================================================================

You asked for a lot in one message: all 8 enhancements from last
round's list, a full bug sweep, mobile UX that feels like a native
app, more speed work, and the vaccine fixes above. I did the vaccine
work first since it was the most specific and immediately actionable,
plus a real bug hunt (the sort bug above, found in 7 places, not just
the 1 you flagged).

I'm sending this now rather than trying to push through the rest
(mobile polish, the remaining enhancements, more speed work) in the
same pass. Every fix in this app so far that actually mattered was
caught by testing it for real - clicking through it, checking actual
computed values, not just reading code and assuming it's right. Mobile
UX changes especially need that same care across every page, and
rushing that risks the exact kind of thing I've had to catch and
undo earlier in this project. I'd rather hand you something solid now
and keep going properly, than hand you more surface area with less
confidence behind it.

Send "continue" and I'll keep working through the list - happy to
take direction on order if you want something specific first (the
mobile pass is probably the highest-impact next step given what you
described).

====================================================================
DEPLOY
====================================================================

Only app.js, index.html, and styles.css changed this round. Code.gs
is untouched - no Apps Script redeploy needed.
