# LACE–CRAFT project website

Static research project website for **LACE–CRAFT: Robot Co-Design with Actor Inheritance and Blackboard Collaboration**.

No build step, third-party scripts, tracking, remote fonts, or external runtime dependencies. All URLs are relative so the site works under a GitHub Pages project subpath.

## Local preview

From this directory, run `node preview.cjs` and open `http://127.0.0.1:8766/`. This local-only server supports byte-range requests so video chapters seek correctly.

## Deployment

Repository: `DeemosTech/lace-craft`. GitHub Pages serves **main → /(root)**.

Website: `https://deemostech.github.io/lace-craft/`.

## Authors and media

- Five-author order is Yuhan Wen, Jiawei Wang, Qixuan Zhang, Yusen Qin, Lan Xu.
- Confirmed affiliations: Yuhan Wen, Qixuan Zhang and Lan Xu (Deemos Corporation and ShanghaiTech University); Jiawei Wang (Deemos Corporation and University of Cambridge); Yusen Qin (D-Robotics). Superscripts 1–4 follow this institution order.
- Only Lan Xu's corresponding-author email is displayed.
- `demo-hd.mp4` is the existing approved 1080p video, including 8× physical playback, not the 20 MB submission-compressed copy.
- `results.json` contains only public table values, not internal paths, raw API requests, or checkpoint identifiers.
- This repository contains the project website, not the research training implementation.

## Maintenance

Edit `index.html`, `styles.css`, and `site.js`. Update `assets/results.json` only from the corresponding paper tables. Figures enlarge in an accessible dialog; method tabs support arrow keys; the walking preview respects reduced-motion and data-saver preferences. The narrated demo uses native video controls, chapter seeking, and an English WebVTT caption track.
