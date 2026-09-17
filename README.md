# ioannavalsamara — portfolio site

Plain HTML, CSS and a little JavaScript. No build step.

## Put it online with GitHub Pages (free)

1. Create a GitHub account if you don't have one.
2. Create a new **public** repository named exactly `YOURUSERNAME.github.io`
   (replace YOURUSERNAME with your GitHub username).
3. On the repository page choose **Add file → Upload files**, and drag in
   everything from this folder: `index.html`, `style.css`, `script.js`,
   `.nojekyll`, `README.md` and the `images` folder. Commit.
4. Go to **Settings → Pages**. Under "Build and deployment" pick
   **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
5. After a minute or two the site is live at `https://YOURUSERNAME.github.io`.

Tip: `.nojekyll` is a hidden file. If the upload skips it, create it on GitHub
with **Add file → Create new file**, name it `.nojekyll`, leave it empty.

## Editing

The home page (`index.html`) shows only the name and the circular staff.
Each menu item is its own page: `scores.html`, `recordings.html`,
`performances.html`, `about.html` (with publications and press), `contact.html`.
The menu is repeated at the top of every page, so change it in all six files.

- **Add a score:** in `scores.html`, copy an `<article class="score">` block,
  change its `id`, image, text and link. Put the image in `images/`.
- **Add a record:** in `recordings.html`, copy an `<li>` in the recordings list, give it a new
  `data-record` name, and add a matching `<div id="record-NAME">` with the
  notes further down.
- **Add a performance:** in `performances.html`, add a `<tr>` row to the table.
- **Colours:** change the variables at the top of `style.css`.

## Preview locally

    cd this-folder
    python3 -m http.server
    # open http://localhost:8000

## Custom domain (optional)

If you later buy a domain, add it under Settings → Pages → Custom domain,
and follow GitHub's DNS instructions.
