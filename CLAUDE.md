# Joe Profit - Claude Rules

See also: [Global Rules](../CLAUDE.md)

---

## Scroll & Keyboard Navigation

Follow the global SOP. This project audited clean (2026-04-01) - all `overflow: hidden` instances are on `position: relative` section/card containers, not page wrappers. The body scrolls naturally.

Watch for: hero sections use parallax (`position: relative + overflow: hidden`) - that's correct and should stay.

---

## Project Essentials

- Known audio race condition on rapid chapter switching - deferred, fix only if a buyer reports it
- Email sender: all emails send from joeprofitneverbroken.com (verified 2026-04-25)
