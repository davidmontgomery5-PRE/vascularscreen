# Vascular Screening Scorecard — Vibe Coding Prompt

Paste the prompt below into Claude Code (in a fresh chat at the repo root) to one-shot a working prototype of the Vascular Screening Scorecard. Customize the `<<< CUSTOMIZE >>>` block first with the criteria you already specified in your prior conversation.

---

## THE PROMPT (copy everything below this line into Claude Code)

You are building a clinician-facing **Vascular Screening Scorecard** — a single-page interactive web app that a cardiovascular provider clicks through at the point of care to decide whether to offer a non-invasive vascular screening study (carotid duplex, AAA ultrasound, lower-extremity arterial / ABI, renal duplex, venous duplex). The output is a traffic-light recommendation that balances **clinical indication** against **payor coverage reality**, so that providers don't pitch a study the patient will be billed for or that gets denied.

### Build target

- **Stack:** Single-page React + TypeScript + Vite + Tailwind. No backend. State lives in component state + `localStorage` (so the provider can keep a session through a clinic day). Mobile-first responsive layout — must be usable on an iPad in an exam room.
- **Output:** `npm run dev` launches it; `npm run build` produces a static bundle deployable to any static host.
- **No PHI persistence.** No patient names or MRNs stored. Each evaluation is anonymous and ephemeral (cleared on "New Patient").
- **Disclaimer footer** on every screen: *"Decision-support only. Not a substitute for clinical judgment. Verify coverage with the patient's specific plan."*

### The scorecard model

The scorecard has **four input groups**, each rendered as a panel of clickable chips/toggles (not free-text — speed matters). When a chip is active it contributes its weighted points to the running total. A live score bar at the top shows the totals and the current traffic-light verdict.

#### Group 1 — Risk Factors (demographic + comorbid)
Examples (extend as needed): age ≥65, age ≥75, male sex, current smoker, former smoker (≥100 lifetime cigarettes), HTN, DM, hyperlipidemia, CKD stage ≥3, known CAD, prior MI, prior stroke/TIA, family hx AAA in 1° relative, family hx premature CVD, BMI ≥30, sedentary, hypercoagulable state.

#### Group 2 — Symptoms (drives medical-necessity coding)
Intermittent claudication, rest pain, non-healing lower-extremity wound, cold/discolored foot, diminished pulses on exam, abdominal/flank bruit, pulsatile abdominal mass, carotid bruit, amaurosis fugax, recent TIA, syncope, exertional dizziness, leg swelling with skin changes (CVI), suspected DVT history.

#### Group 3 — Screening Triggers (the "why today")
Annual wellness visit (Medicare AWV / IPPE — AAA SBE eligible), new diabetes dx, new HTN dx, pre-op vascular clearance, abnormal ABI on prior study, abnormal lipid panel, post-revascularization surveillance, post-EVAR/CEA surveillance, patient self-request, incidental imaging finding.

#### Group 4 — Insurance / Payor
Single-select. Options: **Traditional Medicare**, **Medicare Advantage (major commercial)**, **Large Commercial PPO/HMO** (UHC, Aetna, Cigna, BCBS, Humana commercial), **Regional/Small Commercial**, **Medicaid**, **Self-pay**, **Unknown**.
Insurance acts as a **multiplier / gate**, not just additive points — see scoring rules below.

### Scoring engine — explicit rules

Use a transparent rule engine, not a black box. Each criterion has:
```ts
{
  id: string;
  label: string;
  group: 'risk' | 'symptom' | 'trigger' | 'insurance';
  points: number;              // base weight
  studies: StudyType[];        // which vascular study this supports
  icd10?: string[];            // supporting dx codes
  cptSupported?: string[];     // CPT codes whose medical necessity it strengthens
  guidelineRef?: string;       // e.g. "USPSTF B for AAA in men 65–75 ever-smokers"
  payorNote?: string;          // e.g. "Medicare covers AAA SBE once if IPPE-referred"
}
```

**Computation per study type** (compute independently for each of: carotid, AAA, LE arterial/ABI, renal, venous):

1. `clinicalScore = Σ points of active criteria whose `studies` includes this study type`
2. `payorMultiplier`:
   - Traditional Medicare → 1.2 if the active criteria match a covered indication (e.g., AAA SBE for male 65–75 ever-smoker; symptomatic carotid; symptomatic LE PAD with planned intervention); 0.6 if screening-only without symptoms.
   - Medicare Advantage (major commercial) → 1.15 if symptom present, 0.8 if screening-only.
   - Large Commercial → 1.1 if symptom present, 0.7 if screening-only.
   - Regional/Small Commercial → 1.0 / 0.6.
   - Medicaid → 0.9 / 0.4 (prior auth assumed).
   - Self-pay → 1.0 (no payor barrier, patient choice).
   - Unknown → 0.85.
3. `finalScore = clinicalScore × payorMultiplier`
4. **Hard gates** (override to RED regardless of score):
   - AAA screening repeat when already done under Medicare SBE benefit (once-in-lifetime).
   - Carotid duplex screening in truly asymptomatic patient with no risk factors (USPSTF D recommendation).
   - Venous duplex without symptoms or skin changes (not covered).
5. **Verdict bands** per study:
   - `finalScore ≥ 10` → **GREEN** ("Strong indication — discuss and strongly recommend.")
   - `5 ≤ finalScore < 10` → **YELLOW** ("Conditional — discuss if time / patient interest.")
   - `finalScore < 5` or hard-gated → **RED** ("Not indicated — no discussion unless patient requests.")

Tunable: keep all weights, multipliers, and thresholds in a single `src/data/scorecard.config.ts` file so they can be edited without touching component code.

### UI / UX requirements

- **Top bar:** logo placeholder, "New Patient" button (clears state), running per-study traffic-light pills (carotid / AAA / LE / renal / venous) that update live.
- **Main panel:** four collapsible sections (Risk Factors, Symptoms, Triggers, Insurance). Each criterion is a chip showing the label + a small "+N" badge with its point value. Active chips are highlighted. Hover/tap → tooltip with `guidelineRef` and `payorNote`.
- **Right rail (or bottom drawer on mobile):** per-study breakdown card. Each card shows: traffic-light, final score, top 3 contributing criteria, suggested CPT code(s), suggested supporting ICD-10 code(s), and a one-line payor coverage note.
- **Export:** "Copy to note" button that puts a clean text block on the clipboard summarizing the decision, contributing factors, and suggested codes — ready to paste into the EHR.
- **Accessibility:** keyboard navigable, ARIA labels on all chips, color-blind safe palette (don't rely on red/green alone — also use icons ✓ / ~ / ✕).

### Code & coverage knowledge to bake in

Seed the criterion library with these (verify and extend; cite source in `guidelineRef`):

- **AAA US (CPT 76706 screening / 76770 / 76775):** Medicare SBE covers once-in-lifetime for men 65–75 who have smoked ≥100 cigarettes, or anyone with family hx AAA, **referred during IPPE/AWV**. Diagnostic 76770 needs symptom or palpable mass (ICD-10 R19.07, I71.x).
- **Carotid duplex (CPT 93880 complete / 93882 limited):** Strong indication with carotid bruit, TIA, prior stroke, amaurosis fugax (I65.2x, G45.x, H34.x). USPSTF recommends **against** screening asymptomatic adults.
- **LE arterial duplex (93925/93926) & ABI (93922/93923):** Indicated for claudication (I70.21x), rest pain (I70.22x), non-healing ulcer (I70.23x–I70.25x), diminished pulses with risk factors. Most payors require documented symptoms or prior abnormal ABI.
- **Renal duplex (93975/93976):** Resistant HTN, new-onset HTN <30 or >55, flank bruit, unexplained renal dysfunction (I15.0, N28.0).
- **Venous duplex (93970/93971):** Symptoms of CVI with skin changes (I87.2, I83.x), suspected DVT (I82.4x). Cosmetic venous insufficiency without symptoms is not covered.

For each criterion in the library, attach the relevant CPT + ICD-10 list so the per-study breakdown card auto-suggests the right codes.

### File layout

```
src/
  App.tsx
  main.tsx
  components/
    Scorecard.tsx
    CriterionChip.tsx
    StudyBreakdownCard.tsx
    TopBar.tsx
    Disclaimer.tsx
  data/
    scorecard.config.ts      // weights, thresholds, multipliers
    criteria.ts              // full criterion library
    payors.ts                // payor list + multiplier tables
    studies.ts               // study metadata + CPT bundles
  engine/
    score.ts                 // pure scoring functions + unit tests
    gates.ts                 // hard-gate logic
  hooks/
    usePatientSession.ts     // local state + localStorage
  styles/
    index.css                // Tailwind directives
```

### Quality bar

- All scoring logic in `engine/` is pure and unit-tested with Vitest. Include tests for: each verdict band, each hard gate, each payor multiplier, and a few realistic vignettes (e.g., "68 y/o male ever-smoker on Traditional Medicare at AWV → GREEN for AAA, RED for venous").
- TypeScript strict mode on. No `any`.
- Run `npm run build` clean. Run tests clean.

### <<< CUSTOMIZE — paste before running >>>

Before sending this prompt to Claude Code, **replace this block** with the specific criteria, weights, or guideline citations you already settled on in your prior conversation. Format each as:

```
- group: risk | symptom | trigger
  label: <human label>
  points: <number>
  studies: [carotid|aaa|le|renal|venous]
  icd10: [..]
  cptSupported: [..]
  guidelineRef: <citation>
  payorNote: <coverage caveat>
```

Anything you leave blank, fill from the seeded knowledge above — but your custom entries win on conflict.

### Deliverable

Build the app, run the test suite, run `npm run build`, then start `npm run dev` and walk through three vignettes in the browser to confirm GREEN / YELLOW / RED each fire correctly. Report what you ran and what you saw. Commit on the working branch and open a draft PR.

---

*End of prompt.*
