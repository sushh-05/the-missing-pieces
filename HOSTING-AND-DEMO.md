# Run and present the prototype

## Local preview

Keep all project files in one folder. From that folder, run:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000/placement.html` for the mock feed, `http://localhost:8000/index.html` for the full website, or `http://localhost:8000/playable.html` for the compact playable. To preview the question-led hook, open `http://localhost:8000/playable.html?hook=question`.

Stop the local server with Ctrl+C in its terminal.

## Public hosting

This is a static site with no build step or server-side data. A minimal `netlify.toml` is included with the publish directory set to the project root. Upload the project folder to a static hosting service, then share the hosted `placement.html` URL. Keep the HTML, CSS, and JavaScript files together so relative links and the embedded playable work. The public URL and hosting account are not part of this local project yet.

## Two-minute walkthrough

- **0:00–0:15:** Show the feed placement and opening hook.
- **0:15–0:35:** Choose “muscle and strength”; point out that muscle appears first.
- **0:35–1:05:** Choose an answer, show the explanation, source note, and piece landing in the illustration.
- **1:05–1:20:** Open “GLP-1, in plain language” and the diabetes disclosure.
- **1:20–1:45:** Finish the pieces; copy or save the doctor question card.
- **1:45–2:00:** Show the change-concern control and alternate hook. Describe the alternate as a test hypothesis, not a proven winner.
