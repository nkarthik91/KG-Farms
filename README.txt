KG FARMS - MINIMAL + FASTER (v60)
=================================
APP FILES (this folder): upload to the GitHub repo, replacing the old ones.
SCRIPT FILE (Code.gs, sent separately): paste into Apps Script, then Deploy > Manage deployments > Edit > New version > Deploy.

What got faster
 1. Uses a small "lean" data action (skips daily entries, sales, payouts, traders). Falls back to the old action if Code.gs is not updated yet.
 2. Ticking vaccines redraws only the vaccine list (before: every screen).
 3. The Farms table is only redrawn when you are on the Farms screen.
 4. Saved data is painted immediately on opening, without waiting for Firebase.
 5. App files open from the phone's saved copy instantly and refresh quietly in the background.

v62 additions
 - Farms page: "Close Batch" button closes a batch WITHOUT a sale (needs the updated Code.gs). Edit / Close are now labelled buttons; cards also show live birds, age and a tap-to-call number.
 - Farms is now a main tab in the bottom bar (with icons).
 - Vaccine page: "Select all" and "Clear" buttons.
