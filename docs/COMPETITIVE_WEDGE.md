# Competitive wedge and narrow V1 decision

**Research date:** 2026-08-16  
**Status:** research and recommendation only. No product functionality is proposed by this document.

## Executive conclusion

Beam's existing direct-payment + OBS alert path is **table stakes**, not differentiation. Stream Alert and StreamTipz already target Indian UPI alerts; StreamElements is a mature global version of the broader category; YouTube owns the lowest-friction native interaction.

The narrowest plausible wedge is not “cheaper tips.” It is:

1. a **creator-controlled Support Inbox** that turns every paid interaction into manageable work rather than noisy alerts; and
2. a manually validated **Your Moment** workflow that gives a fan a lasting artifact when the creator chooses to answer them.

Neither should be sold as a guaranteed answer. Both must be tested with a creator before costly automation.

## A. Competitor baseline

Legend: **YES** = explicitly documented; **PARTIAL** = limited/adjacent evidence; **NO EVIDENCE FOUND** = public material reviewed does not substantiate it; **UNKNOWN** = source does not establish the claim.

| Capability | Stream Alert India | StreamTipz | YouTube Supers/Gifts | StreamElements (global) |
| --- | --- | --- | --- | --- |
| Direct creator payment | YES (UPI directly to creator) | YES (claims direct UPI / merchant routing) | NO (platform fan-funding revenue share) | PARTIAL (PayPal or SE.Pay; ownership/custody model varies) |
| Creator payment ownership | YES (claimed creator UPI) | PARTIAL (direct routes claimed; central QR also advertised) | NO | UNKNOWN |
| Fan payment page | PARTIAL (QR/UPI ID) | YES | YES (native purchase) | YES |
| QR | YES | YES | NO EVIDENCE FOUND | NO EVIDENCE FOUND |
| OBS/browser alerts | YES | YES | NO (native chat, not OBS alert product) | YES |
| TTS | YES | YES | NO EVIDENCE FOUND | YES |
| Indian-language TTS | YES (Hindi/regional language claim) | PARTIAL (custom TTS claim; language coverage not proven) | NO EVIDENCE FOUND | NO EVIDENCE FOUND |
| Support/tip history | NO EVIDENCE FOUND | YES (supporter receipts / leaderboard claims) | YES | YES (activity/moderation feed) |
| Analytics | NO EVIDENCE FOUND | PARTIAL (leaderboards shown) | YES | YES |
| Supporter identity/history | PARTIAL (notification-derived) | YES (leaderboard/supporter receipts) | YES | PARTIAL |
| Answered/unanswered workflow | NO EVIDENCE FOUND | NO EVIDENCE FOUND | PARTIAL (creator can filter/reply; not a workflow) | NO EVIDENCE FOUND |
| Question queue / AI grouping | NO EVIDENCE FOUND | NO EVIDENCE FOUND | NO EVIDENCE FOUND | NO EVIDENCE FOUND |
| Creator-defined interactions | NO EVIDENCE FOUND | NO EVIDENCE FOUND | PARTIAL (Supers, Gifts, goals) | PARTIAL (song/video requests) |
| Automatic answer clipping / fan souvenir | NO EVIDENCE FOUND | NO EVIDENCE FOUND | NO EVIDENCE FOUND | PARTIAL (tip page offers “Add a clip”; answer-linked souvenir not established) |
| Topic voting/goals | NO EVIDENCE FOUND | NO EVIDENCE FOUND | YES (live goals) | NO EVIDENCE FOUND |
| Referral/community mechanics | NO EVIDENCE FOUND | PARTIAL (public leaderboards) | YES (native community/fan-funding ecosystem) | PARTIAL (chatbot/community tooling) |
| Sponsorship / matching | NO EVIDENCE FOUND | NO EVIDENCE FOUND | NO EVIDENCE FOUND | NO EVIDENCE FOUND |
| Onboarding complexity | Android app + notification permission + OBS + QR | Google/UPI + Android companion + OBS integration | Lowest: already in watch page for eligible creators | Payment/tipping configuration + overlays |
| Published pricing | ₹249/month after trial; 0% commission claim | token/route pricing shown; terms need review | Creator receives stated 70% of confirmed Supers | no added platform cut for tips claimed; processor fees apply |

### What competitors already solve

- Payment page/QR, direct UPI collection, alert overlays, custom visuals, TTS, amount thresholds, moderation, history/analytics, and some engagement mechanics are already in market.
- YouTube goes further on native identity, zero-context purchase, pinning, milestones, social reaction, and reporting.
- Therefore, “payment + alert + attractive overlay” does not justify a new creator workflow on its own.

## B. Razorpay technology-partner/OAuth verdict

| Question | Verdict | Evidence / implication |
| --- | --- | --- |
| Existing merchant can connect | **TECHNICALLY DOCUMENTED** | Razorpay documents a sub-merchant authorization flow where the account owner authorizes the partner application. |
| New merchant onboarding | **TECHNICALLY DOCUMENTED** | Technology-partner onboarding/custom onboarding documentation exists. Exact commercial availability must be confirmed with Razorpay. |
| Beam can access merchant resources without API-key sharing | **TECHNICALLY DOCUMENTED** | OAuth access tokens are issued after merchant consent; Razorpay explicitly says credentials need not be shared. |
| Beam can create/observe payments for creator | **TECHNICALLY DOCUMENTED** | Partner OAuth docs show access to payment/order APIs using the merchant-granted token; Payment Links have paid webhooks. |
| UPI support | **TECHNICALLY DOCUMENTED** | Razorpay documents UPI Payment Links and payment-link paid events. |
| Creator can revoke Beam | **TECHNICALLY DOCUMENTED** | `account.app.authorization_revoked` event is documented; revoked access removes partner capability. |
| Beam remains outside money custody | **TECHNICALLY DOCUMENTED IN ARCHITECTURE, NOT YET CONTRACTUALLY VERIFIED** | OAuth uses the creator merchant's account/token. Beam must not create its own wallet, take a transfer, add an application fee in the no-custody flow, or represent funds as Beam-held. Confirm settlement/merchant-of-record terms with Razorpay. |
| Partner access / production approval | **COMMERCIAL APPROVAL REQUIRED** | Razorpay says sign up as a Technology Partner by contacting support before application registration. |
| Production pricing, reserves, liability, permitted use | **UNKNOWN** | Needs written commercial confirmation from Razorpay before any production claim. |

### India payment verdict

**Proceed to partner discovery, not production build.** The technical pattern supports creator-authorized access, creator-owned accounts, payment links/orders, verified webhooks, and revocation. The business gate is Technology Partner approval plus written confirmation that the intended creator-support use and settlement model preserve Beam’s no-custody design.

## C. Guaranteed Answer red-team

| Risk | Why it matters |
| --- | --- |
| Workload/queue explosion | A live creator cannot honor unlimited paid questions without abandoning the stream. |
| Editorial independence | Political, finance, education, and spirituality creators need the right to decline, defer, or reframe questions. |
| Moderation and safety | Payment cannot force an inappropriate, defamatory, dangerous, or off-topic response. |
| Fan entitlement/refunds | “Guaranteed” creates a contractual expectation and disputes when a creator misses an item. |
| Existing YouTube baseline | YouTube already makes Supers discoverable/filterable, though it does not create a creator workflow for unresolved paid interactions. |

### Support Inbox verdict: **MANUAL TEST FIRST**

Build only a low-risk, creator-controlled prototype after interviews: retain paid interactions and let a creator set **New / Surfaced / Answered / Answer later / Skipped / Moderated**. Do not promise fans a response. Initial classification/clustering should be evaluated on real creator transcripts before an AI feature is shipped.

### Guaranteed Answer verdict: **REJECT**

Do not offer it as a default product. At most, later test a creator-defined, capped “priority question” product with explicit scope, queue limit, and creator discretion.

## D. Your Moment red-team

### Value

- **Creator:** a source for distribution and an easier way to acknowledge a supporter; potential repurposing value is real only if the creator actually uses/shares the clips.
- **Fan:** a personal, shareable proof that the creator responded to them—stronger than a transient alert.

### Feasible progression

| Stage | Method | Verdict |
| --- | --- | --- |
| V0 | Creator marks an interaction Answered and records a rough answer timestamp; Beam creates a shareable receipt/link only | **Manual test** |
| V1 | AI suggests likely answer boundaries from transcript/chat and creator confirms | Later, only after V0 shows demand |
| V2 | Automatically render branded vertical/horizontal clips | Later; requires rights, ingestion, encode, storage, deletion, and support operations |

### Cost/complexity

Do not quote a hard per-clip cost before selecting an ingest/encoding provider and clip length. Cost is dominated by source-video access/rights, transcoding minutes, storage, and egress—not text AI. At 100/1,000/10,000 clips, a naïve always-on video pipeline scales linearly in both encoding and egress and becomes a material operational product. V0 has near-zero video infrastructure cost because it creates no video. A gated V1/V2 must use short clips, asynchronous jobs, strict retention, a cost cap, and creator-owned source/authorization.

### Your Moment verdict: **MANUAL TEST FIRST**

Test whether creators and fans value an answer-linked receipt before generating a single video automatically.

## E. AI edge: only workload reduction qualifies

| Capability | Creator time saved | Revenue impact | Fan impact | Cost | Failure consequence | Recommendation |
| --- | ---:| ---:| ---:| ---:| ---| ---|
| Message/question classification | Medium | Low–medium | Indirect | Low | Mislabelled item | Manual evaluation first |
| Semantic duplicate clustering | High on busy Q&A | Medium | Better chance of being addressed | Medium | Important question buried | Manual evaluation first |
| Supporter context summaries | Medium | Medium | Recognition | Low | Wrong context | Later |
| Moderation suggestions | Medium | Indirect | Safer stream | Low–medium | Unsafe display / false block | Human approval only |
| Answered/unanswered detection | Medium | Medium | Better follow-up | Medium | False promise | Creator confirms |
| Answer timestamps/clip boundaries | Medium | Medium | High if accurate | Medium | Wrong clip/attribution | Manual V0, then assist |
| Title/caption generation | Low | Low | Medium | Low | Off-brand text | Later |
| Post-stream audience summary | Medium | Low | Low | Medium | Misleading summary | Later |

Reject decorative generative messages and generic fan chatbots: neither attacks creator workload or context-switch friction.

## F–H. Later concepts

| Concept | Red-team conclusion | Verdict |
| --- | --- | ---|
| Creator-defined pledges/topics | Viable only as creator-curated choices; inappropriate when it creates political/financial conflicts or lets money dictate editorial agenda. Better framed as an interest signal/goal contribution than a purchased mandate. | **LATER** |
| Fan missions | Referrals, research, timestamps, translations and moderation invite fraud, spam, reward accounting, and creator overhead. The only plausible later manual test is creator-requested timestamp submissions for a specific stream. | **LATER** |
| Sponsors/matching | Requires sales, brand safety, disclosure, measurement, fraud controls, and a clear non-custodial funds model. No evidence justifies it before creator scale and repeat fan behavior. | **LATER** |

## I. Ruthless scorecard (1 low, 10 high; effort/cost/abuse are burdens)

| Candidate | Creator pain | Revenue | Time saved | Fan value | Retention | Differentiation | Effort | Cost | Abuse | Existing coverage | Decision |
| --- | ---:| ---:| ---:| ---:| ---:| ---:| ---:| ---:| ---:| ---:| ---|
| Creator onboarding/no-custody payments | 8 | 7 | 7 | 3 | 4 | 4 | 5 | 3 | 5 | 6 | Table stakes, execute excellently |
| Support Inbox (manual states) | 8 | 6 | 8 | 5 | 6 | 7 | 4 | 2 | 5 | 2 | Manual test first |
| Your Moment V0 receipt | 5 | 5 | 3 | 8 | 7 | 8 | 3 | 1 | 4 | 2 | Manual test first |
| Your Moment auto clips | 6 | 7 | 6 | 9 | 8 | 9 | 9 | 8 | 6 | 2 | Later |
| Guaranteed Answer | 6 | 6 | 2 | 7 | 5 | 5 | 5 | 4 | 9 | 4 | Reject |
| Pledges/topics | 4 | 5 | 2 | 5 | 4 | 6 | 6 | 3 | 8 | 4 | Later |
| Fan missions | 3 | 4 | 2 | 4 | 5 | 5 | 8 | 5 | 9 | 3 | Later |
| Sponsor matching | 5 | 9 | 2 | 6 | 4 | 8 | 10 | 7 | 8 | 2 | Later |

## Proposed V1 (narrow)

**Competitive table stakes:** frictionless creator onboarding, creator-owned direct payment, supporter link/QR, verified payments, OBS alert, basic support history, safe moderation, and simple configuration.

**At most two differentiators to validate, not fully automate:**

1. **Support Inbox:** creator-controlled states for paid questions/interactions, no answer promise.
2. **Your Moment V0:** creator marks a response and sends a branded receipt/share link, no video pipeline.

## Kill conditions

Stop or materially redesign Beam if any of these becomes true:

1. Real viewers consistently abandon at payment because the external switch is irritating, even when the offered interaction is clear.
2. Creators do not use the Support Inbox after a controlled stream or say YouTube’s existing filtering/history is sufficient.
3. Fans do not value/share an answer-linked moment more than a normal thank-you/alert.
4. Razorpay partner/commercial terms cannot support a creator-owned, non-custodial production flow.
5. The creator’s actual willingness to honor interactions is too low for the promised fan value.

## Source register

- [Stream Alert India](https://streamalert.in/blog/stream-alert-launch-india)
- [StreamTipz](https://app.streamtipz.in/) and [pricing/merchant-routing page](https://streamtipz.in/)
- [YouTube Supers management](https://support.google.com/youtube/answer/7288782) and [purchase behavior](https://support.google.com/youtube/answer/9178363)
- [YouTube Gifts India announcement](https://blog.google/intl/en-in/products/platforms/a-new-way-to-connect-and-earn-with-gifts/)
- [StreamElements tipping](https://support.streamelements.com/hc/en-us/articles/10474710869394-Tipping-Overview), [SE.Tips](https://streamelements.com/setips), and [tip moderation](https://support.streamelements.com/hc/en-us/articles/10474807584914-Tip-Moderation)
- [Razorpay Technology Partner OAuth](https://razorpay.com/docs/partners/technology-partners/onboard-businesses/integrate-oauth/), [OAuth integration steps](https://razorpay.com/docs/partners/technology-partners/onboard-businesses/integrate-oauth/integration-steps/partners-import-flow/), [revocation](https://razorpay.com/docs/webhooks/partners/oauth/), [UPI payment links](https://razorpay.com/docs/api/payments/payment-links/create-upi/), and [Payment Link webhooks](https://razorpay.com/docs/webhooks/payment-links/)
