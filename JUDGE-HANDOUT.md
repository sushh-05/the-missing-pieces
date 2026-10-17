# The Missing Pieces

## The idea

A 45-second interactive ad that helps adults in India prepare better questions about medical weight-management care. Users choose the topic they care about, explore three parts of care in a concern-led order, and leave with a question card they can keep. An optional, sourced explainer introduces GLP-1 in plain language.

## Three required answers

- **Trigger:** “Everyone talks about the injection. What’s missing from the conversation?”
- **Value:** Users explore three parts of medical weight-management care and save a question card tailored to their concern.
- **Next step:** Users can continue to Steer and take their questions with them. This prototype does not transmit personal answers.

## Demo links / files

- `placement.html` — mock social-feed placement with the playable embedded.
- `playable.html` — compact 320 × 480 playable-style experience.
- `playable.html?hook=question` — alternate hook concept for a future A/B test.
- `index.html` — full website entry-point experience.

Open `placement.html` for the clearest judge walkthrough. Keep all files in the same folder when hosting. See `HOSTING-AND-DEMO.md` for local preview steps and Loom timing.

## Why the experience is useful

The user chooses their concern first, which changes the order of the learning pieces and the questions on the final card. Every answer produces a relevant explanation; the educational content has source notes. Users can copy or download the card without providing contact details.

## Accuracy and limits

- Product indications vary. The diabetes question points to CDSCO product-specific information and does not imply that every medicine in a class has the same approved use.
- The muscle note reflects general dietary weight-loss research on resistance exercise; it is not a promise or evidence specific to a medicine or Steer programme.
- The STEP 1 extension is described as a study observation after treatment and structured support ended, not an individual prediction.
- NICE is UK guidance and is labelled as general clinical context, not Indian prescribing guidance.
- This is educational, not medical advice. No eligibility check, diagnosis, drug promotion, weight-loss promise, or data transmission is included.

## Tools and build

Vanilla HTML, CSS and JavaScript. No package install, login, external font request, or live AI call. AI assistance (Codex) was used for implementation and copy drafting; sources were checked and the health wording was kept product-neutral.

## Suggested 2-minute Loom

1. Show the feed placement and opening hook.
2. Choose “muscle and strength” and point out that muscle appears first.
3. Select an answer and show the explanation, source note, and piece animation.
4. Open the GLP-1 explainer and diabetes question disclosure.
5. Complete the remaining pieces; copy or save the question card.
6. Show the back control and alternate hook URL; explain the alternate is a hypothesis to test, not a performance claim.

Clinician review and participant usability sessions are pending. Use `REVIEW-AND-TEST.md` before presenting health copy publicly.

## Hook test hypothesis

Compare the injection-led hook with the question-led hook. If the ad platform is connected in a future deployment, compare tap-through and completion rates. Do not present any winner until real test data exists.
