KG Farms + Sales - Feed Order Approval Workflow

Yes, this could be done - here's what changed.

====================================================================
WHAT CHANGED
====================================================================

Before this, feed ordering had an inconsistency I found while digging
into it: BPSC and BSC orders were hard-blocked from ever exceeding the
calculated requirement (no way around it, no matter the reason), while
BFP orders had no restriction at all - anyone could order any amount
of BFP with zero oversight. Neither of those was quite right.

Now, for all three feed types:
- Ordering exactly the calculated requirement works exactly as before
  - no extra steps, no friction.
- Ordering something different - less or more - is now allowed, but
  the order goes into a "Pending Approval" state and needs an admin to
  approve it before it can actually be fulfilled (before anyone can
  log a delivery against it).
- The person placing the order sees this upfront: the order popup now
  shows the calculated requirement and says plainly that anything
  different will need approval, and if they enter a different number,
  a confirmation prompt spells that out one more time before it's
  submitted.

On the Orders page, orders waiting on approval show a distinct
"PENDING APPROVAL" badge with Approve / Reject buttons (admin only).
Rejecting asks for an optional reason, which gets saved onto the order
for the record.

====================================================================
WHAT I SPECIFICALLY CHECKED, NOT JUST BUILT
====================================================================

- An order can't be fulfilled while still waiting on approval - tried
  to make sure this is airtight, including the "auto-match" path where
  feed gets logged against a batch without picking a specific order
  number (that path now skips unapproved orders entirely rather than
  accidentally grabbing one).
- Cancelling the "this needs approval" warning actually cancels it -
  doesn't sneak the order through anyway.
- The reject reason prompt correctly tells apart "left it blank" from
  "hit Cancel on the whole thing" - these are different in JavaScript
  (null vs empty string) and it's an easy bug to introduce by
  accident. Caught this while building it and fixed it before it went
  out, not after.
- Approve and Reject both send the exact order number and (for reject)
  the exact reason typed in - checked the actual network request, not
  just that a toast appeared.

Order creation permissions are unchanged - still admin-only, same as
before. This wasn't about changing who can place orders, just about
what happens when a placed order doesn't match the calculated number.

====================================================================
DEPLOY
====================================================================

app.js, Code.gs, and styles.css all changed this round. Update Code.gs
in Apps Script and redeploy: Deploy > Manage deployments > Edit > New
version > Deploy - this round added new backend actions, so saving
alone won't push it live. Then replace the rest of the files as usual.
