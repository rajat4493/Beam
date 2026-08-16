# Mobile context-switch risk: decision record

**Status:** validated platform constraint; device test pending

## Question

Can Beam eliminate the YouTube-to-external-payment interruption while retaining YouTube’s native live experience?

## What the platforms allow

YouTube permits an embedded video player, including inline playback on mobile when the player is configured accordingly. That is **not** equivalent to embedding the native live experience.

- YouTube says Live Chat is available on YouTube watch pages, not embedded players.
- Its own embedded live-chat option is not available on mobile web.
- Browsers may block scripted/autoplay playback, so an embedded player cannot promise uninterrupted video.
- Android YouTube picture-in-picture can keep a video in a floating window while the user uses another app, subject to the viewer’s YouTube/device settings. This is a possible mitigation, not a Beam-controlled guarantee.
- We do not have evidence that a similar YouTube-app PiP handoff is reliably available for every iPhone viewer. Do not market it as a solution until real-device tests prove it.

## Decision

Do **not** build an embedded YouTube player as a workaround. It would fragment the experience, lose mobile native live chat, and fail to guarantee uninterrupted playback.

Beam must instead earn a brief context switch with a distinctly valuable interaction. The product promise is **paid participation**, not cheaper payment or a generic tip.

## Next evidence gate: real-phone test

After YouTube enables the founder’s unlisted live stream, run each test once with screen recording enabled.

1. **iPhone:** open the YouTube live watch page → Beam link → Stripe sandbox Checkout → Beam return → YouTube. Record whether the stream resumes, where it resumes, and whether any critical moment is missed.
2. **Android:** repeat with YouTube picture-in-picture enabled. Record whether the live video remains perceptually present while Beam and the payment page are open.
3. Measure: link tap to Checkout, Checkout completion to YouTube return, payment to OBS, number of switches/taps, and stated reason if the journey feels irritating.

## Pass / kill signals

- **Proceed:** the interaction is compelling enough that founders/viewers accept the interruption, and repeat supporters do so voluntarily.
- **Mitigate:** Android PiP materially reduces friction; present it as an optional viewer convenience, never a guarantee.
- **Stop / redesign:** viewers consistently reach Checkout but abandon because leaving YouTube is irritating. More animation, AI, or badges do not solve that structural problem.

## Sources

- [YouTube live-stream help](https://support.google.com/youtube/answer/15270973): native Live Chat is only on YouTube watch pages, not embedded players.
- [YouTube embedded live-chat help](https://support.google.com/youtube/answer/2524549): embedded live chat is unavailable on mobile web.
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference): embeds exist, but autoplay/scripted playback can be blocked.
- [YouTube Android PiP help](https://support.google.com/youtube/answer/7552722): PiP may continue playback over other apps when enabled.
