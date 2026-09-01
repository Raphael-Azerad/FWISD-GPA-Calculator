import { describe, expect, it } from 'vitest';

import {
  calculateCoreRankGpa,
  calculateGpa,
  getAutoCoreLimit,
  importCoursesFromCsv,
  makeExportCsv,
  requiredExamScore,
  sampleFocusCsv,
  semesterGrade,
  weightedPoints,
  type Course,
} from './gpa';

describe('FWISD grade-point scales', () => {
  it('maps weighted grade bands by tier', () => {
    expect(weightedPoints(100, 'tier1')).toBe(5);
    expect(weightedPoints(95, 'tier2')).toBe(4.3);
    expect(weightedPoints(88, 'tier3')).toBe(3.4);
    expect(weightedPoints(69, 'tier1')).toBe(0);
  });
});

describe('semester grade calculators', () => {
  it('calculates high-school six-weeks semester grades', () => {
    const grade = semesterGrade('sixWeeks', {
      six1: 90,
      six2: 80,
      six3: 70,
      exam: 100,
    });

    expect(grade).toBeCloseTo(82.857, 3);
  });

  it('calculates required exam scores for a target', () => {
    const needed = requiredExamScore('nineWeeks', {
      nine1: 82,
      nine2: 84,
      target: 85,
    });

    expect(needed).toBe(97);
  });
});

describe('FOCUS CSV imports', () => {
  it('uses FOCUS point columns and preserves zero-credit rows', () => {
    const { courses } = importCoursesFromCsv(sampleFocusCsv, 'sample.csv');
    const gpa = calculateGpa(courses);

    expect(courses).toHaveLength(5);
    expect(courses[4]).toMatchObject({
      name: 'Office Aide',
      credit: 0,
      counts: false,
    });
    expect(gpa.weighted).toBeCloseTo(3.975, 3);
    expect(gpa.unweighted).toBeCloseTo(3.75, 2);
  });

  it('parses quoted course names with commas', () => {
    const csv = [
      'Course,Percent,Cred. Earned,Grade Scale,Grad Subject,Affects GPA',
      '"English, Literature I",93,0.5,Unweighted,ELAR,Y',
    ].join('\n');
    const { courses } = importCoursesFromCsv(csv, 'quoted.csv');

    expect(courses[0]?.name).toBe('English, Literature I');
    expect(courses[0]?.subject).toBe('elar');
  });

  it('infers common excluded records in generic CSV exports', () => {
    const csv = [
      'Course,Grade,Credit,Type,Subject',
      'Local Study Hall,100,0.5,Local Credit,Other',
      'Credit By Exam Algebra,95,0.5,CBE,Math',
      'English II,91,0.5,Regular,ELAR',
    ].join('\n');
    const { courses } = importCoursesFromCsv(csv, 'generic.csv');

    expect(courses.map((course) => course.counts)).toEqual([
      false,
      false,
      true,
    ]);
    expect(calculateGpa(courses).credits).toBe(0.5);
  });

  it('exports edited rows as quoted CSV', () => {
    const { courses } = importCoursesFromCsv(sampleFocusCsv, 'sample.csv');
    const csv = makeExportCsv([
      { ...courses[0], name: 'English, Literature I' },
    ]);

    expect(csv).toContain('"English, Literature I"');
    expect(csv).toContain('"Weighted Points"');
  });
});

describe('Core/Class-Rank GPA', () => {
  it('uses the highest eligible rows from each core subject', () => {
    const rows: Course[] = [
      coreRow(1, 'elar', 4.6),
      coreRow(2, 'elar', 4.1),
      coreRow(3, 'elar', 3.6),
      coreRow(4, 'math', 5.0),
      coreRow(5, 'math', 4.5),
      coreRow(6, 'math', 3.5),
      coreRow(7, 'science', 4.8),
      coreRow(8, 'science', 4.4),
      coreRow(9, 'science', 4.0),
      coreRow(10, 'socialStudies', 4.2),
      coreRow(11, 'socialStudies', 3.8),
      coreRow(12, 'socialStudies', 3.4),
      coreRow(13, 'other', 5.0),
      { ...coreRow(14, 'math', 5.0), counts: false },
    ];
    const result = calculateCoreRankGpa(rows, 2);

    expect(result.count).toBe(8);
    expect(result.weighted).toBeCloseTo(4.425, 3);
    expect(result.selectedIds.has(3)).toBe(false);
    expect(result.selectedIds.has(13)).toBe(false);
    expect(result.selectedIds.has(14)).toBe(false);
  });

  it('matches an anonymized FOCUS summary-style fixture', () => {
    const { courses } = importCoursesFromCsv(
      focusSummaryFixture,
      'focus-summary.csv',
    );
    const cumulative = calculateGpa(courses);
    const core = calculateCoreRankGpa(courses, 4);
    const totalCredits = courses.reduce(
      (sum, course) => sum + course.credit,
      0,
    );

    expect(totalCredits).toBe(22);
    expect(cumulative.unweighted).toBe(4);
    expect(cumulative.weighted).toBeCloseTo(4.67, 3);
    expect(core.weighted).toBeCloseTo(4.806, 3);
    expect(getAutoCoreLimit(courses)).toBe(4);
  });
});

function coreRow(
  id: number,
  subject: Course['subject'],
  points: number,
): Course {
  return {
    id,
    name: `Course ${id}`,
    grade: 90,
    credit: 0.5,
    tier: 'tier3',
    subject,
    counts: true,
    sourceWeightedPoints: points,
    sourceUnweightedPoints: 4,
  };
}

const focusSummaryFixture = toCsv([
  [
    'Course',
    'Percent',
    'Cred. Earned',
    'Grade Scale',
    'Grad Subject',
    'Affects GPA',
    'GPA PTS',
    'Weighted GPA',
  ],
  ['English 1 S1', '99', '0.5', 'AP/IB/DC', 'ELAR', 'Y', '4.0', '4.9'],
  ['English 1 S2', '99', '0.5', 'AP/IB/DC', 'ELAR', 'Y', '4.0', '5.0'],
  ['English 2 S1', '95', '0.5', 'AP/IB/DC', 'ELAR', 'Y', '4.0', '4.8'],
  ['English 2 S2', '94', '0.5', 'AP/IB/DC', 'ELAR', 'Y', '4.0', '4.7'],
  ['Math 1 S1', '99', '0.5', 'AP/IB/DC', 'Math', 'Y', '4.0', '5.0'],
  ['Math 1 S2', '95', '0.5', 'AP/IB/DC', 'Math', 'Y', '4.0', '4.8'],
  ['Math 2 S1', '95', '0.5', 'AP/IB/DC', 'Math', 'Y', '4.0', '4.8'],
  ['Math 2 S2', '94', '0.5', 'AP/IB/DC', 'Math', 'Y', '4.0', '4.7'],
  ['Science 1 S1', '99', '0.5', 'AP/IB/DC', 'Science', 'Y', '4.0', '5.0'],
  ['Science 1 S2', '95', '0.5', 'AP/IB/DC', 'Science', 'Y', '4.0', '4.8'],
  ['Science 2 S1', '95', '0.5', 'AP/IB/DC', 'Science', 'Y', '4.0', '4.8'],
  ['Science 2 S2', '94', '0.5', 'AP/IB/DC', 'Science', 'Y', '4.0', '4.7'],
  [
    'Social Studies 1 S1',
    '95',
    '0.5',
    'AP/IB/DC',
    'Social Studies',
    'Y',
    '4.0',
    '4.8',
  ],
  [
    'Social Studies 1 S2',
    '95',
    '0.5',
    'AP/IB/DC',
    'Social Studies',
    'Y',
    '4.0',
    '4.8',
  ],
  [
    'Social Studies 2 S1',
    '94',
    '0.5',
    'AP/IB/DC',
    'Social Studies',
    'Y',
    '4.0',
    '4.7',
  ],
  [
    'Social Studies 2 S2',
    '90',
    '0.5',
    'AP/IB/DC',
    'Social Studies',
    'Y',
    '4.0',
    '4.6',
  ],
  ['Fine Arts S1', '92', '0.5', 'Honors/Pre-AP', 'Other', 'Y', '4.0', '4.0'],
  ['Fine Arts S2', '91', '0.5', 'Honors/Pre-AP', 'Other', 'Y', '4.0', '4.1'],
  ['Technology S1', '92', '0.5', 'Honors/Pre-AP', 'Other', 'Y', '4.0', '4.2'],
  ['Technology S2', '92', '0.5', 'Honors/Pre-AP', 'Other', 'Y', '4.0', '4.2'],
  [
    'Local Credit Block',
    '100',
    '12.0',
    'Unweighted',
    'Other',
    'N',
    '0.0',
    '0.0',
  ],
]);

function toCsv(rows: string[][]) {
  return rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
    )
    .join('\n');
}
