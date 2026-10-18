# The Missing Pieces

## One-line submission answers

- **Trigger:** “Everyone talks about the injection. What’s missing from the conversation?”
- **Value:** In under a minute, people explore three parts of medical weight-management care and leave with a concern-specific question card for a doctor.
- **Next step:** They can save or copy their questions, then choose to continue to Steer and bring the card with them.

## Why it stands out

It turns a familiar Indian-life scene into a short game: choose a concern, explore a question, then place that piece into the picture to unlock the next. There is no score or wrong-answer penalty. Each reveal links to its source, and the user leaves with a question card even if they never contact Steer.

## Demo formats

- `index.html` is the full mobile-first website experience.
- `playable.html` is the compact playable prototype designed around a 320 × 480 frame. Host the files together and open `playable.html` for the ad-style demo.
- `placement.html` embeds the playable in a feed-style mockup for the Loom.

The experiences run without an account. The card is downloaded as an SVG image. Continuing to Steer opens `steerclub.com`; this prototype does not transmit answers or integrate with a CRM. Event logs are local to the current browser session (`window.steerEvents` and `window.playableEvents`) and are not sent to a tracking service.

## Evidence notes

- The NICE link is UK guidance and is identified as general context, not Indian prescribing guidance.
- The resistance-exercise statement is qualified as potential support with variable results, not a guarantee.
- The STEP 1 extension is described as a study observation after treatment and structured lifestyle support ended, not a prediction for an individual.
- The experience does not screen for treatment eligibility or recommend a medicine.
- The diabetes question links to CDSCO product information and explains that approved uses vary by product.
- The optional GLP-1 explainer links to NIDDK and avoids product-specific treatment advice.

## 2-minute Loom structure

1. **0:00–0:20 — Hook:** Show the incomplete table scene and explain the question: “Everyone talks about the injection. What’s missing?”
2. **0:20–0:45 — Personal concern:** Choose muscle, long-term care or whether treatment is right for me.
3. **0:45–1:20 — Play:** Answer the three gentle either/or prompts. Show that there is no score or shame; each answer reveals another part of care.
4. **1:20–1:45 — Payoff:** Show the generated question card and copy/save actions.
5. **1:45–2:00 — Handoff:** Show the saved question card and explain that continuing opens Steer’s website; the prototype does not send personal answers.

## Question-generation prompt for a future content layer

```text
You are a careful health-content editor for Steer, an India-focused, doctor-led metabolic health programme.

Task: Create 3 practical questions a person can take to a doctor based on their selected concern.

Selected concern: {concern}
Approved educational content: {approved_content}
Source references: {sources}

Rules:
- Questions must help someone have a better clinical conversation, not diagnose, screen, or decide eligibility.
- Do not recommend a named prescription medicine or imply that treatment is right for the person.
- Do not promise weight loss, muscle preservation, safety, or prevention of regain.
- Use plain, warm English that sounds natural in India.
- Be specific enough to be useful and short enough to fit on a phone card.
- Ask about monitoring, trade-offs, support, and what happens if the plan changes where relevant.
- Return valid JSON only in this shape:
  {"questions":["...","...","..."],"disclaimer":"..."}
```

## Run it

Open `index.html` in a browser or follow `HOSTING-AND-DEMO.md` to preview the feed mockup and playable locally. There is no package install, external font request, or backend. Clinical review, participant testing, public hosting, and the recorded Loom remain submission tasks; see `REVIEW-AND-TEST.md`.
