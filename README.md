# The Missing Pieces

**PS1 - The Ad People Want to Tap** · Steer Hackathon

The Missing Pieces is a mobile-first playable ad and short interactive guide about medical weight-management care. Players tap three animated paper pieces: personal fit, strength, and long-term care, to complete the picture, then explore their concern and leave with questions they can take to a doctor.

## Try it

- **Live experience:** [the-missing-pieces.netlify.app](https://the-missing-pieces.netlify.app/)
- **Demo video / walkthrough:** [Watch on Google Drive](https://drive.google.com/file/d/1-1OhQDjw_4wrMvP6Dc1Drq8212n7PFN-/view?usp=drive_link)
- **Source code:** [GitHub repository](https://github.com/sushh-05/the-missing-pieces)

## What the experience does

1. Opens with a short tap-to-play game that asks, “Everyone talks about the injection. What’s missing?”
2. Lets a visitor choose what they want explained: personal fit, muscle and strength, or the longer view.
3. Uses three gentle prompts and source-linked explanations to complete the picture of care.
4. Creates a concern-specific question card that can be copied or saved, without requiring login or contact details.
5. Offers an optional Steer handoff. The prototype does not transmit the visitor’s answers or question card.

There is no score and no wrong-answer penalty. The experience is educational, not a diagnosis, eligibility check, or treatment recommendation.

## Submission summary

- **Trigger:** “Everyone talks about the injection. What’s missing from the conversation?”
- **Value:** In under a minute, people explore three parts of care and leave with practical, concern-specific questions for a doctor.
- **Next step:** Save or copy the question card, then optionally explore Steer or bring the questions to a clinician.

## Team and contribution disclosure

This is a combined project by **THADI SUSHMITHA MANI** and **Devi J**. Sushmitha led and completed most of the product design and implementation, including the concept, visual direction, front-end build, interactions, animation, content integration, and debugging. Devi J is a project teammate and co-contributor. Please describe her specific contribution in the submission form as agreed by the team; it is not detailed here to avoid guessing.

**AI assistance:** OpenAI ChatGPT/Codex was used for brainstorming, copy refinement, coding assistance, and debugging. The project team reviewed and integrated the output.

**Visual assets:** The paper pieces, icons, and illustrations are implemented in the project using HTML/CSS/SVG. No external stock-image assets are required.

## Sources and health-content notes

The experience links to its supporting references in the interface and distinguishes general educational context from individual medical advice:

- [NICE weight-management guidance](https://www.nice.org.uk/guidance/ng246/chapter/medicines-and-surgery) — UK guidance, used as general context, not Indian prescribing guidance.
- [NIDDK: prescription medicines to treat overweight and obesity](https://www.niddk.nih.gov/health-information/weight-management/prescription-medications-treat-overweight-obesity).
- [CDSCO product information](https://cdsco.gov.in/opencms/resources/UploadCDSCOWeb/2018/UploadBiologicalrDNA/Form%2045%20Jul%202021%20to%20Aug%202022%20Final.pdf) — product indications vary; users are encouraged to ask a clinician about the specific product.
- [Resistance exercise systematic review](https://bmjopensem.bmj.com/content/11/3/e002363) — phrased as potential support, not a guarantee of muscle preservation.
- [Wilding et al., STEP 1 extension](https://pubmed.ncbi.nlm.nih.gov/35441470/) — reported study outcomes after treatment and structured lifestyle support were withdrawn; not a prediction for any individual.

## Run locally

This is a static site with no build step, package installation, or backend. Keep the project files together and serve the folder locally:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/` for the full experience. Other useful entry points are `/playable.html` for the compact playable and `/placement.html` for the feed-style mockup. Stop the server with `Ctrl+C`.

## Target and completion

- **Target:** Mobile-first web experience; also usable on desktop browsers.
- **Browser:** Current versions of Chrome, Edge, Firefox, or Safari with JavaScript enabled.
- **Status:** Deployed static prototype; core playable flow, guided experience, source notes, question-card actions, and optional handoff are implemented.
- **Data handling:** No account or backend is used. Answers stay in the current browser session and are not sent to Steer.
