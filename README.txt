KG Farms + Sales - Rate-Limiting, Password Rules, Preconnect Hints
(3 of 4 done and tested - honest status on the 4th below, please read it)

====================================================================
1. LOGIN RATE-LIMITING - DONE, VERIFIED
====================================================================

5 wrong password attempts on the same username now locks that account
out for 15 minutes, regardless of whether the 6th attempt happens to
be correct. A successful login clears the counter, so normal typos
don't accumulate toward a lockout. Different usernames don't affect
each other.

How I verified this without being able to run real Apps Script code
directly: I extracted the exact state-machine logic and ran it against
a small simulation that mimics Google's CacheService behavior
precisely (get/put/remove with real time-based expiry), then tested
four scenarios explicitly - normal use with some typos, an actual
lockout, confirming a successful login resets the counter, and
confirming two different users don't interfere with each other. All
four passed.

====================================================================
2. MINIMUM PASSWORD LENGTH - DONE, VERIFIED
====================================================================

New users (and password changes) now require at least 6 characters,
enforced on both ends - instant feedback in the Add/Change User form,
and the real enforcement on the server so it can't be bypassed.
Tested live: a 3-character password is correctly rejected before it
ever reaches the server; a valid one goes through normally.

====================================================================
3. PRECONNECT HINTS - DONE
====================================================================

Added hints so the browser starts connecting to Apps Script and
Firebase before it actually needs to, shaving a bit of time off every
request rather than just the first one. Zero risk, this is a purely
additive browser hint with no behavior to break.

====================================================================
4. SPLITTING APP.JS BY PAGE - NOT DONE, AND HERE'S EXACTLY WHY
====================================================================

I want to be straightforward here rather than either rush this or
just quietly drop it.

I spent real effort trying to do this properly - building an actual
dependency map of which of the app's ~175 functions are only used by
which pages, so I could confidently move the unused-most-of-the-time
ones (Sales, Payout, Farms, Settings, etc.) into separate files that
only load when someone actually visits those pages.

What I found: the app's page-navigation function currently references
every single page's functions directly and by name in one shared
place. That's not a problem for how the app runs today, but it means
a real split isn't just "move some code to another file" - it
requires also rewriting how navigation decides what to load, so it
can fetch a page's code on demand instead of assuming everything is
already there. That's a meaningfully bigger and riskier change than
the other three items here, and my usual way of gaining confidence in
something like this - careful automated analysis of the code, cross-
checked against real behavior - kept surfacing edge cases (a stray
line of setup code between two functions was enough to make an
automated check think two unrelated pages depended on each other,
which they don't).

Given how much of this app now handles real money - sales, payouts,
approvals - I didn't think it was right to push that through in the
same pass as three clean, verified wins, on the theory that a
half-confident navigation change could silently break a page for
someone in a way that's hard to notice from the outside.

I'd like to come back to this properly rather than abandon it - happy
to talk through it more, or take a run at it with more room to test
thoroughly rather than exploring and building at the same time.

====================================================================
DEPLOY
====================================================================

Code.gs changed (rate-limiting, password length) - needs an actual
redeploy: Deploy > Manage deployments > Edit > New version > Deploy.
app.js and index.html changed too (password validation, preconnect
hints) - replace as usual.
