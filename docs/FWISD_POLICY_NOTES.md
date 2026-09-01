# FWISD Policy Notes

This document explains the public policy assumptions used by the app. It is a project note, not official district guidance.

## Sources Reviewed

- FWISD Bulletin 100, Version 2, August 2026
- FWISD Secondary Guide to Grade Reporting 2026-2027
- I.M. Terrell Academy GPA and Class Rank overview: <https://imterrell.fwisd.org/counseling/academic-support/gpa-class-rank>

The attached elementary grade-reporting guide was also reviewed. It mainly describes elementary report-card and gradebook procedures, so it does not drive the GPA calculator.

## GPA Records

FOCUS course-history exports may contain both transcript-credit records and GPA-counted records. The app treats `Affects GPA = Y` as the strongest signal that a course belongs in cumulative GPA calculations.

When FOCUS provides `GPA PTS` and `Weighted GPA`, the app uses those point values instead of re-inferring them from the course name. That makes imported breakdowns closer to what FOCUS already displays.

## Core/Class-Rank GPA

Public FWISD guidance says class rank uses eligible semester grades from four core subject areas:

- English language arts
- Mathematics
- Science
- Social studies

The public overview describes the calculation as the eight highest eligible semester grades in each of those subjects. The Secondary Guide also notes that, at the senior-year recalculation, eligible grades earned before grade 9 may be used if a student has fewer than eight high-school semester grades in one of the core subjects.

Because underclassmen often have fewer than eight semester grades per subject, the app handles this automatically instead of asking the user to choose a separate setting. It uses the smallest counted grade count available across the core subjects represented in the export, capped at 8. That makes an underclassman estimate easier to compare without filling missing future courses.

## Known Exclusions

Public FWISD guidance identifies several grade sources that should not count for class rank or GPA in common cases:

- Local-credit courses
- Pass/fail courses
- Credit by examination
- Some distance learning or correspondence courses
- Some credit-recovery or web-based recovery grades
- Dual credit without required FWISD approval or partnership handling

This app cannot perfectly identify every exclusion from a generic CSV. It relies on FOCUS fields when present and otherwise makes best-effort guesses that the user can edit.

## Semester And Yearly Grades

The Secondary Guide says high-school semester exams or culminating activities are worth 1/7 of the semester grade.

For six-weeks schedules:

```text
(six1 * 2 + six2 * 2 + six3 * 2 + semesterExam) / 7
```

For nine-weeks schedules:

```text
(nine1 * 3 + nine2 * 3 + semesterExam) / 7
```

Yearly grades are computed by averaging the two semester grades:

```text
(semester1 + semester2) / 2
```

## Validation Notes

The current CSV importer was checked against one FOCUS Course History export and the matching FOCUS summary values supplied during development. That sample matched:

- Cumulative unweighted GPA
- Cumulative weighted GPA
- Total credits earned
- Core/Class-Rank GPA after automatically selecting eligible core grades for the student's completed semesters

Future contributors should avoid committing real student records. Use anonymized fixtures when adding tests.
