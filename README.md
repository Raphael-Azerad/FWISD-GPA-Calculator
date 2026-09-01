# FWISD GPA and Final Grade Calculator

[![CI](https://github.com/Raphael-Azerad/FWISD-GPA-Calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/Raphael-Azerad/FWISD-GPA-Calculator/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open-green.svg)](https://fwisd-gpa-calculator.mysterious-flute.workers.dev/)
[![Unofficial](https://img.shields.io/badge/FWISD-Unofficial-orange.svg)](#important-disclaimer)

An unofficial, student-built Fort Worth ISD calculator for GPA estimates, FOCUS CSV grade breakdowns, semester grades, and required exam scores.

Live site: <https://fwisd-gpa-calculator.mysterious-flute.workers.dev/>

## What It Does

- Estimates FWISD weighted GPA, unweighted GPA, and Core/Class-Rank GPA.
- Imports course-history CSV exports from FOCUS and explains which courses affected the estimate.
- Downloads an anonymized sample FOCUS-style CSV for testing the importer.
- Exports the edited course breakdown as a CSV.
- Copies a plain-English GPA summary for easy sharing.
- Prints a simple GPA report.
- Includes a report page for formula or CSV mistakes.
- Calculates high-school six-weeks and nine-weeks semester grades.
- Calculates the semester exam score needed to reach a target semester grade.
- Calculates yearly grades from two semester grades.
- Provides standalone About, Privacy, and Terms pages.
- Runs entirely in the browser for CSV parsing. No account or project database is used.

## Important Disclaimer

This project is not an official Fort Worth ISD, I.M. Terrell Academy, or FOCUS product. It may contain mistakes, outdated policy assumptions, CSV parsing errors, or edge cases that do not match an official transcript. Use it for learning and estimation only. Official GPA, credit, rank, honors, and transcript decisions are made by FWISD.

The project is provided as-is, without warranties or liability to the fullest extent allowed by law.

## FWISD Formula Notes

The calculator is based on public FWISD guidance for the 2026-2027 school year, including:

- FWISD Bulletin 100
- FWISD Secondary Guide to Grade Reporting 2026-2027
- I.M. Terrell Academy's GPA and Class Rank overview

Weighted GPA uses FWISD Tier I, Tier II, and Tier III grade-point bands:

| Grade       | Tier I | Tier II | Tier III |
| ----------- | -----: | ------: | -------: |
| 97-100      |    5.0 |     4.5 |      4.0 |
| 94-96       |    4.8 |     4.3 |      3.8 |
| 90-93       |    4.6 |     4.1 |      3.6 |
| 87-89       |    4.4 |     3.9 |      3.4 |
| 84-86       |    4.2 |     3.7 |      3.2 |
| 80-83       |    4.0 |     3.5 |      3.0 |
| 77-79       |    3.8 |     3.3 |      2.8 |
| 74-76       |    3.6 |     3.1 |      2.6 |
| 71-73       |    3.4 |     2.9 |      2.4 |
| 70          |    3.0 |     2.5 |      2.0 |
| 69 or below |    0.0 |     0.0 |      0.0 |

Unweighted GPA uses FWISD's simple 4.0 scale:

| Grade       | Points |
| ----------- | -----: |
| 90-100      |    4.0 |
| 80-89       |    3.0 |
| 70-79       |    2.0 |
| 69 or below |    0.0 |

High school six-weeks semester grade:

```text
(six1 * 2 + six2 * 2 + six3 * 2 + semesterExam) / 7
```

High school nine-weeks semester grade:

```text
(nine1 * 3 + nine2 * 3 + semesterExam) / 7
```

Yearly grade:

```text
(semester1 + semester2) / 2
```

## Core/Class-Rank GPA

FWISD's Core/Class-Rank GPA is different from cumulative weighted GPA. Public district guidance says class rank uses the highest eligible semester grades in these subjects:

- English language arts
- Mathematics
- Science
- Social studies

The app handles Core/Class-Rank GPA automatically. For complete records, FWISD guidance points to the highest eight eligible semester grades in each core subject. For in-progress records, the app uses the best available eligible core grades without asking students to choose a separate setting.

Known exclusions include local-credit courses, pass/fail courses, credit by exam, and other records that FOCUS or FWISD marks as not affecting GPA.

## CSV Import

Use the Upload CSV button on the GPA tab. For FOCUS exports, the app uses these columns when available:

- `Percent` for the numeric grade
- `Cred. Earned` for credits
- `Grade Scale` for Tier I, Tier II, or Tier III handling
- `Grad Subject` for core-subject grouping
- `GPA PTS` and `Weighted GPA` for official point values shown by FOCUS
- `Affects GPA` to decide whether a course counts in cumulative GPA

Total credits earned can be higher than GPA-counted credits. A course can award credit without affecting GPA or class rank.

The importer also makes best-effort guesses for generic CSVs with columns such as `Course`, `Grade`, `Credits`, `Tier`, `Subject`, or `Included in GPA`. Students can edit every imported course before using the estimate.

## Privacy

CSV files are parsed locally in the browser. This project does not create user accounts, store uploaded grade files, or send course data to a project database. The hosting provider may keep normal server logs, such as page requests, browser type, rough location, and error information.

## Local Development

Requirements:

- Node.js 22.13 or newer
- npm

Install and run:

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run test
npm run build
```

Deploy to Cloudflare Workers after authenticating Wrangler or setting GitHub
Actions secrets:

```bash
npm run deploy:cloudflare
```

## Project Structure

```text
app/page.tsx       Main calculator UI
app/layout.tsx     Page metadata
app/about          Project background page
app/privacy        Privacy policy page
app/terms          Terms and disclaimer page
app/globals.css    Theme tokens and Tailwind setup
components/ui      Small set of shadcn-style UI primitives used by the app
lib/gpa.ts         GPA, CSV, and final-grade utilities
lib/gpa.test.ts    Anonymized formula and importer tests
.github            CI, issue templates, Dependabot, and PR template
docs               Policy notes and import notes
```

## Deployment

The production app is deployed to Cloudflare Workers:

<https://fwisd-gpa-calculator.mysterious-flute.workers.dev/>

See [Cloudflare Deployment](docs/CLOUDFLARE_DEPLOYMENT.md).

## Contributing

Contributions are welcome, especially:

- Better FOCUS CSV detection for other FWISD exports
- More official source references
- Accessibility improvements
- Tests for GPA edge cases
- Clearer student-facing explanations

Before opening a pull request, run:

```bash
npm run lint
npm run test
npm run build
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contributor guide.

## License

MIT. See [LICENSE](LICENSE).

## Maintainer Notes

- Dependabot is configured for weekly npm and GitHub Actions updates.
- CodeRabbit configuration is included in `.coderabbit.yaml`; install the CodeRabbit GitHub app after the repository is published.
- Cloudflare deployment is prepared through a manual GitHub Actions workflow.
