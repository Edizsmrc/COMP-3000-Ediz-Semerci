# PhishGuard AI for Gmail

PhishGuard AI for Gmail is a Manifest V3 Chrome extension that scans the currently opened Gmail message, scores it with a locally executed machine-learning model, applies explainable link and domain checks, injects a warning banner into Gmail, and stores scan history locally.

## What this project does

- Reads the visible body of the currently opened Gmail message
- Extracts message text and visible hyperlinks
- Runs a trained logistic-regression text classifier locally in the browser
- Applies explainable link-analysis rules to visible URLs
- Produces a hybrid phishing score from 0 to 100
- Highlights suspicious links in Gmail
- Shows a popup dashboard with AI probability, rule score, and recent history
- Stores scan history with `chrome.storage.local`

## Architecture

- `manifest.json` defines the extension, popup, permissions, and service worker
- `background.js` stores history and updates the extension badge
- `mlModel.js` contains the trained local machine-learning model and inference logic
- `rules.js` combines ML output with explainable phishing checks
- `contentScript.js` extracts Gmail message content, runs scans, injects the banner, and highlights suspicious links
- `popup.html`, `popup.css`, and `popup.js` provide the user interface

## Installation

1. Unzip the project folder
2. Open `chrome://extensions`
3. Turn on **Developer mode**
4. Click **Load unpacked**
5. Select this project folder
6. Open Gmail and open an email
7. Click the extension icon or look for the banner at the top of the opened message

## Machine-learning model

The text classifier is a logistic-regression model trained offline on the public `PhishFinderDatasetID.unique.train.csv` dataset and evaluated on `PhishFinderDatasetID.unique.test.csv`.

Evaluation at the packaged threshold of `0.55`:

- Accuracy: 0.928
- Precision: 0.904
- Recall: 0.912
- F1 score: 0.908
- True negatives: 5465
- False positives: 359
- False negatives: 325
- True positives: 3380

The extension uses a hybrid score so that machine-learning output is combined with explainable link and domain checks.

## Privacy, legal, and ethics position

- The extension does not use any external API for inference
- Scanning is performed locally in the browser
- No real inboxes were scraped for model training
- The packaged model is based on a public dataset and local feature extraction
- The user-facing banner explains why content was flagged
- History is stored locally in the browser extension storage

## Limitations

- The extension only scans the visible Gmail message content in the browser
- It is a client-side prototype and not a production mail gateway
- Dataset bias can still affect results
- Trusted-domain reduction is used to reduce obvious false positives, but the tool can still make mistakes
- The model does not inspect attachments or remote message headers

## Retraining

`train_model.py` is included so the model can be retrained from the public dataset files. The script writes a new `mlModel.js` file for use in the browser.

## Dataset and licensing

The packaged model was trained using the public `phishing-compilation` repository dataset, which is published under an MIT license and compiles phishing and ham messages from multiple public sources. The repository lists Enron, SMS phishing, phishing email, phishing and ham email, and spam-detection sources in its README.

## Chrome extension basis

The extension is built on Chrome Manifest V3 with a service worker and content scripts, and stores local state with `chrome.storage.local`.
