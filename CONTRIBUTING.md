# Contributing

Thanks for helping make this clearer for FWISD students and families.

## Before You Start

This is an unofficial student-built calculator. Please be careful with policy claims and avoid presenting estimates as official FWISD results.

Good contributions include:

- Better FOCUS CSV import handling
- Tests or fixtures using anonymized data
- Accessibility improvements
- Documentation updates from official public sources
- Clearer explanations of GPA, rank, and final-grade math

## Privacy Rules

Do not commit real student records, screenshots, IDs, names, class ranks, or transcript data. Use anonymized examples only.

## Development

```bash
npm install
npm run dev
```

Before opening a pull request:

```bash
npm run lint
npm run test
npm run build
```

## Pull Requests

When changing GPA logic, include:

- The source or policy note you used
- The affected calculation path
- A short before/after example with anonymized data

When changing UI only, include a short screenshot or description of the affected screen.

## Source Quality

Prefer official FWISD sources, campus counseling pages, FOCUS-export behavior, or clearly anonymized examples. If a rule is inferred from a sample, label it as an inference.
