# PREventClinic Vascular Screening Scorecard

A point-of-care decision-support tool for cardiovascular providers. Click through risk factors, symptoms, screening triggers, and the patient's insurance, and the scorecard returns a per-study traffic-light verdict (green / yellow / red) for the five non-invasive vascular studies, an estimate of the likelihood the payor will cover each one, suggested CPT and supporting ICD-10 codes, a benign chart-paste note, and short behavioral-economics talking points for each indicated study.

**Live app:** https://scintillating-daffodil-4fabc3.netlify.app

## What it scores

| Study | Default CPT |
|---|---|
| Carotid duplex | 93880 / 93882 |
| Abdominal aorta US (AAA SBE / diagnostic) | 76706 / 76770 / 76775 |
| Lower-extremity arterial / ABI | 93925 / 93926 / 93922 / 93923 |
| Renal duplex | 93975 / 93976 |
| Venous duplex | 93970 / 93971 |

Scoring follows the rules baked into `src/data/scorecard.config.ts` and `src/data/payors.ts`:

1. Each active criterion contributes its `+N` points to every study it supports.
2. The clinical sum is multiplied by a payor factor — symptomatic indications get a boost on major payors (×1.0–1.2); screening-only requests get discounted (×0.4–0.85) because payors are stricter without a symptom. Traditional Medicare AAA SBE for an eligible patient referred via AWV is treated as a covered indication and uses the symptom multiplier.
3. Hard gates can force a red verdict (e.g., once-in-lifetime Medicare AAA SBE already used; USPSTF-D carotid screening in asymptomatic patients with no risk factors; venous duplex without symptoms).
4. Verdict bands: **green** ≥ 10, **yellow** 5–9.9, **red** < 5 or hard-gated.

## No PHI

The app keeps each session in `localStorage` only — chip selections, payor, and the AAA-prior-SBE flag. Nothing leaves the browser. "New Patient" clears the session. The footer carries the decision-support disclaimer on every screen.

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # vitest run
npm run build     # production bundle in dist/
```

## Deployment

Netlify auto-deploys `main` to the live URL above. Preview deploys are created for every PR. Configuration lives in `netlify.toml`.

## Editing the scoring logic

- **Add or weight a criterion:** `src/data/criteria.ts`
- **Tune verdict thresholds:** `src/data/scorecard.config.ts`
- **Adjust payor multipliers or labels:** `src/data/payors.ts`
- **Add a hard gate:** `src/engine/gates.ts`
- **Reword a talking point or chart rationale:** `src/data/blurbs.ts`

The scoring engine in `src/engine/score.ts` is pure and unit-tested; all 16 tests run with `npm test`.

---

_Decision-support only. Not a substitute for clinical judgment. Verify coverage with the patient's specific plan._
