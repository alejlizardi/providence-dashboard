# evidentry-dashboard

A live dashboard for [evidentry](https://github.com/alejlizardi/evidentry) evidence
packs — AI eval results rendered with the statistics made **visible**: Wilson
confidence intervals as actual error bars, the settled-vs-unsettled
(`PASS` vs `PASS (point)`) distinction shown visually, and Holm-adjusted
drift across model versions.

**Live:** https://alejlizardi.github.io/evidentry-dashboard/

> Work in progress — the deploy skeleton and data pipeline are live; the three
> core views are landing next.

## Stack

React + Vite + TypeScript + Tailwind + Recharts. Static SPA, deployed to GitHub
Pages via Actions.

## Data

The app renders static JSON produced by `evidentry export` (see the
[backend repo](https://github.com/alejlizardi/evidentry)). The committed
`public/data/` is a build input; regenerate it with:

```bash
pip install -e ../evidentry
evidentry export ../evidentry/examples/model_history/v*/evidence/*/ -o public/data
```

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/evidentry-dashboard/
npm run build    # -> dist/
```
