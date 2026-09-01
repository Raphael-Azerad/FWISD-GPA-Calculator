export type Tier = 'tier1' | 'tier2' | 'tier3';
export type Subject = 'elar' | 'math' | 'science' | 'socialStudies' | 'other';

export type Course = {
  id: number;
  name: string;
  grade: number;
  credit: number;
  tier: Tier;
  subject: Subject;
  counts: boolean;
  sourceWeightedPoints?: number;
  sourceUnweightedPoints?: number;
};

export type ImportSummary = {
  fileName: string;
  imported: number;
  skipped: number;
  columns: string[];
  detected: Record<string, string | null>;
  notes: string[];
};

export type TermMode = 'sixWeeks' | 'nineWeeks' | 'middleSchool' | 'yearly';

export const weightedBands = [
  { min: 97, label: '97-100', tier1: 5.0, tier2: 4.5, tier3: 4.0 },
  { min: 94, label: '94-96', tier1: 4.8, tier2: 4.3, tier3: 3.8 },
  { min: 90, label: '90-93', tier1: 4.6, tier2: 4.1, tier3: 3.6 },
  { min: 87, label: '87-89', tier1: 4.4, tier2: 3.9, tier3: 3.4 },
  { min: 84, label: '84-86', tier1: 4.2, tier2: 3.7, tier3: 3.2 },
  { min: 80, label: '80-83', tier1: 4.0, tier2: 3.5, tier3: 3.0 },
  { min: 77, label: '77-79', tier1: 3.8, tier2: 3.3, tier3: 2.8 },
  { min: 74, label: '74-76', tier1: 3.6, tier2: 3.1, tier3: 2.6 },
  { min: 71, label: '71-73', tier1: 3.4, tier2: 2.9, tier3: 2.4 },
  { min: 70, label: '70', tier1: 3.0, tier2: 2.5, tier3: 2.0 },
] as const;

export const defaultCourses: Course[] = [
  {
    id: 1,
    name: 'English',
    grade: 92,
    credit: 0.5,
    tier: 'tier3',
    subject: 'elar',
    counts: true,
  },
  {
    id: 2,
    name: 'AP Biology',
    grade: 88,
    credit: 0.5,
    tier: 'tier1',
    subject: 'science',
    counts: true,
  },
  {
    id: 3,
    name: 'Honors Algebra',
    grade: 95,
    credit: 0.5,
    tier: 'tier2',
    subject: 'math',
    counts: true,
  },
  {
    id: 4,
    name: 'Local elective',
    grade: 99,
    credit: 0.5,
    tier: 'tier3',
    subject: 'other',
    counts: false,
  },
];

export const sampleFocusCsv = [
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
  ['English I S1', '95', '0.5', 'Unweighted', 'ELAR', 'Y', '4.0', '3.8'],
  ['Honors Geometry S1', '92', '0.5', 'Honors/Pre-AP', 'Math', 'Y', '4.0', '4.1'],
  ['AP Biology S1', '88', '0.5', 'AP/IB/DC', 'Science', 'Y', '3.0', '4.4'],
  [
    'World Geography S1',
    '90',
    '0.5',
    'Unweighted',
    'Social Studies',
    'Y',
    '4.0',
    '3.6',
  ],
  ['Office Aide', '100', '0.0', 'Unweighted', 'Other', 'N', '0.0', '0.0'],
]
  .map((row) => row.map((cell) => `"${cell}"`).join(','))
  .join('\n');

export const subjectLabels: Record<Subject, string> = {
  elar: 'ELAR',
  math: 'Math',
  science: 'Science',
  socialStudies: 'Social studies',
  other: 'Other',
};

export const tierLabels: Record<Tier, string> = {
  tier1: 'Tier I - AP, OnRamps, Dual Credit',
  tier2: 'Tier II - Honors, Pre-IB',
  tier3: 'Tier III - On level / other',
};

export function clampGrade(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

export function weightedPoints(grade: number, tier: Tier) {
  const numeric = clampGrade(grade);
  const band = weightedBands.find((entry) => numeric >= entry.min);

  return band ? band[tier] : 0;
}

export function courseWeightedPoints(course: Course) {
  return course.sourceWeightedPoints ?? weightedPoints(course.grade, course.tier);
}

export function unweightedPoints(grade: number) {
  const numeric = clampGrade(grade);

  if (numeric >= 90) {
    return 4;
  }
  if (numeric >= 80) {
    return 3;
  }
  if (numeric >= 70) {
    return 2;
  }

  return 0;
}

export function courseUnweightedPoints(course: Course) {
  return course.sourceUnweightedPoints ?? unweightedPoints(course.grade);
}

export function formatNumber(value: number, digits = 3) {
  if (!Number.isFinite(value)) {
    return '0.000';
  }

  return value.toFixed(digits);
}

export function getLetterGrade(grade: number) {
  const numeric = clampGrade(grade);

  if (numeric >= 90) {
    return 'A';
  }
  if (numeric >= 80) {
    return 'B';
  }
  if (numeric >= 70) {
    return 'C';
  }

  return 'F';
}

export function calculateGpa(courses: Course[], coreOnly = false) {
  const eligible = courses.filter((course) => {
    const isCore = course.subject !== 'other';
    return course.counts && (!coreOnly || isCore) && course.credit > 0;
  });

  const credits = eligible.reduce((sum, course) => sum + course.credit, 0);
  const weightedTotal = eligible.reduce(
    (sum, course) => sum + courseWeightedPoints(course) * course.credit,
    0,
  );
  const unweightedTotal = eligible.reduce(
    (sum, course) => sum + courseUnweightedPoints(course) * course.credit,
    0,
  );

  return {
    count: eligible.length,
    credits,
    weightedTotal,
    unweightedTotal,
    weighted: credits ? weightedTotal / credits : 0,
    unweighted: credits ? unweightedTotal / credits : 0,
  };
}

export function getCoreSubjectCounts(courses: Course[]) {
  const counts: Record<Subject, number> = {
    elar: 0,
    math: 0,
    science: 0,
    socialStudies: 0,
    other: 0,
  };

  courses.forEach((course) => {
    if (course.counts && course.subject !== 'other') {
      counts[course.subject] += 1;
    }
  });

  return counts;
}

export function getAutoCoreLimit(courses: Course[]) {
  const coreCounts = Object.entries(getCoreSubjectCounts(courses))
    .filter(([subject]) => subject !== 'other')
    .map(([, count]) => count)
    .filter((count) => count > 0);

  return coreCounts.length ? Math.min(8, Math.min(...coreCounts)) : 8;
}

export function calculateCoreRankGpa(courses: Course[], limit: number) {
  const selected: Course[] = [];

  (['elar', 'math', 'science', 'socialStudies'] as Subject[]).forEach((subject) => {
    const subjectCourses = courses
      .filter((course) => course.counts && course.subject === subject)
      .sort((a, b) => {
        const weightedDiff = courseWeightedPoints(b) - courseWeightedPoints(a);
        return weightedDiff || b.grade - a.grade;
      })
      .slice(0, limit);

    selected.push(...subjectCourses);
  });

  const result = calculateGpa(selected);

  return {
    ...result,
    selectedIds: new Set(selected.map((course) => course.id)),
    limit,
  };
}

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function splitCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === ',' && !quoted) {
      row.push(cell.trim());
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') {
        index += 1;
      }
      row.push(cell.trim());
      if (row.some(Boolean)) {
        rows.push(row);
      }
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());
  if (row.some(Boolean)) {
    rows.push(row);
  }

  return rows;
}

function findColumn(headers: string[], candidates: string[]) {
  const normalized = headers.map(normalizeHeader);
  const exact = candidates
    .map(normalizeHeader)
    .map((candidate) => normalized.indexOf(candidate))
    .find((index) => index >= 0);

  if (exact !== undefined) {
    return exact;
  }

  return normalized.findIndex((header) =>
    candidates.some((candidate) => header.includes(normalizeHeader(candidate))),
  );
}

function getCell(row: string[], index: number) {
  return index >= 0 ? row[index] : undefined;
}

function parseNumeric(value: string | undefined, fallback = 0) {
  if (!value) {
    return fallback;
  }

  const cleaned = value.replace(/%/g, '').match(/-?\d+(\.\d+)?/);
  return cleaned ? Number(cleaned[0]) : fallback;
}

function parseGradeValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  const numeric = value.replace(/%/g, '').match(/\d+(\.\d+)?/);
  if (numeric) {
    return clampGrade(Number(numeric[0]));
  }

  const letter = value.trim().toUpperCase();
  const letterGrades: Record<string, number> = {
    'A+': 99,
    A: 96,
    'A-': 92,
    'B+': 89,
    B: 86,
    'B-': 82,
    'C+': 79,
    C: 76,
    'C-': 72,
    D: 70,
    F: 65,
  };

  return letterGrades[letter] ?? null;
}

function inferTier(...values: string[]): Tier {
  const text = values.join(' ').toLowerCase();

  if (/\b(ap|advanced placement|onramps|dual credit|dual enrollment|dc|ib)\b/.test(text)) {
    return 'tier1';
  }
  if (/\b(honors|honour|pre[-\s]?ib|pre[-\s]?ap)\b/.test(text)) {
    return 'tier2';
  }

  return 'tier3';
}

function inferSubject(...values: string[]): Subject {
  const text = values.join(' ').toLowerCase();

  if (/\b(english|ela|elar|reading|writing|literature|composition)\b/.test(text)) {
    return 'elar';
  }
  if (/\b(algebra|geometry|calculus|statistics|math|precal|pre-cal)\b/.test(text)) {
    return 'math';
  }
  if (/\b(biology|chemistry|physics|science|environmental|anatomy|astronomy)\b/.test(text)) {
    return 'science';
  }
  if (/\b(history|government|economics|geography|social studies|world history|us history)\b/.test(text)) {
    return 'socialStudies';
  }

  return 'other';
}

function inferCounts(...values: string[]) {
  const text = values.join(' ').toLowerCase();

  if (/\b(no|false|excluded|not included|local credit|pass\/fail|pass fail|cbe|credit by exam|correspondence)\b/.test(text)) {
    return false;
  }

  return true;
}

function parseFocusCounts(value: string | undefined, fallbackText: string) {
  if (value !== undefined) {
    return /^(y|yes|true|1)$/i.test(value.trim());
  }

  return inferCounts(fallbackText);
}

function parseTier(value: string | undefined, fallbackText: string) {
  const text = `${value ?? ''} ${fallbackText}`.toLowerCase();

  if (/ap\/ib\/dc|advanced placement|dual credit|onramps|international baccalaureate/.test(text)) {
    return 'tier1';
  }
  if (/honors\/pre-ap|honors|pre[-\s]?ap|pre[-\s]?ib/.test(text)) {
    return 'tier2';
  }
  if (/unweighted|tier iii|tier 3|on level|regular/.test(text)) {
    return 'tier3';
  }
  if (text.includes('tier i') || text.includes('tier 1')) {
    return 'tier1';
  }
  if (text.includes('tier ii') || text.includes('tier 2')) {
    return 'tier2';
  }
  if (text.includes('tier iii') || text.includes('tier 3')) {
    return 'tier3';
  }

  return inferTier(text);
}

function parseSubject(value: string | undefined, fallbackText: string) {
  const text = `${value ?? ''} ${fallbackText}`.toLowerCase();

  if (text.includes('elar') || text.includes('english')) {
    return 'elar';
  }
  if (text.includes('math')) {
    return 'math';
  }
  if (text.includes('science')) {
    return 'science';
  }
  if (text.includes('social')) {
    return 'socialStudies';
  }

  return inferSubject(text);
}

export function importCoursesFromCsv(text: string, fileName: string) {
  const rows = splitCsv(text);
  const headers = rows[0] ?? [];
  const dataRows = rows.slice(1);

  const courseIndex = findColumn(headers, [
    'course',
    'course name',
    'course title',
    'class',
    'class name',
    'section',
    'description',
  ]);
  const gradeIndex = findColumn(headers, [
    'percent',
    'percentage',
    'grade',
    'final grade',
    'semester grade',
    'term grade',
    'average',
    'mark',
    'score',
    's1',
    's2',
  ]);
  const creditIndex = findColumn(headers, [
    'credit earned',
    'credits earned',
    'cred earned',
    'cred. earned',
    'credit',
    'credits',
    'credit attempted',
    'credits attempted',
    'cred attempted',
    'cred. attempted',
  ]);
  const sourceWeightedIndex = findColumn(headers, [
    'weighted gpa',
    'weighted points',
    'weighted grade points',
  ]);
  const sourceUnweightedIndex = findColumn(headers, [
    'gpa pts',
    'gpa points',
    'unweighted gpa',
    'unweighted points',
  ]);
  const tierIndex = findColumn(headers, [
    'grade scale',
    'tier',
    'level',
    'course level',
    'weighted',
    'weight',
    'type',
  ]);
  const subjectIndex = findColumn(headers, [
    'grad subject',
    'graduation subject',
    'subject',
    'department',
    'content area',
    'area',
  ]);
  const countsIndex = findColumn(headers, [
    'affects gpa',
    'affects',
    'include gpa',
    'included in gpa',
    'counts',
    'credit type',
    'gpa',
  ]);

  const imported: Course[] = [];
  let skipped = 0;

  dataRows.forEach((row, index) => {
    const rowText = row.join(' ');
    const name =
      getCell(row, courseIndex) ||
      row.find((cell) => /[a-z]/i.test(cell) && !/\d{2,3}/.test(cell)) ||
      `Imported course ${index + 1}`;
    const grade = parseGradeValue(getCell(row, gradeIndex) ?? rowText);

    if (grade === null) {
      skipped += 1;
      return;
    }

    const credit = Math.max(0, parseNumeric(getCell(row, creditIndex), 0.5));
    const tier = parseTier(getCell(row, tierIndex), rowText);
    const subject = parseSubject(getCell(row, subjectIndex), rowText);
    const counts = parseFocusCounts(getCell(row, countsIndex), rowText);
    const sourceWeightedPoints = parseNumeric(getCell(row, sourceWeightedIndex), NaN);
    const sourceUnweightedPoints = parseNumeric(getCell(row, sourceUnweightedIndex), NaN);

    imported.push({
      id: index + 1,
      name,
      grade,
      credit,
      tier,
      subject,
      counts,
      sourceWeightedPoints: Number.isFinite(sourceWeightedPoints)
        ? sourceWeightedPoints
        : undefined,
      sourceUnweightedPoints: Number.isFinite(sourceUnweightedPoints)
        ? sourceUnweightedPoints
        : undefined,
    });
  });

  return {
    courses: imported,
    summary: {
      fileName,
      imported: imported.length,
      skipped,
      columns: headers,
      detected: {
        course: headers[courseIndex] ?? null,
        grade: headers[gradeIndex] ?? null,
        credit: headers[creditIndex] ?? null,
        tier: headers[tierIndex] ?? null,
        subject: headers[subjectIndex] ?? null,
        counts: headers[countsIndex] ?? null,
        weightedPoints: headers[sourceWeightedIndex] ?? null,
        unweightedPoints: headers[sourceUnweightedIndex] ?? null,
      },
      notes: [
        'FOCUS exports use the Affects GPA column: only Y rows count in cumulative GPA.',
        'FOCUS weighted and unweighted point columns are used when present.',
        'AP, OnRamps, Dual Credit, and IB names are treated as Tier I when no tier column is found.',
        'Honors, Pre-IB, and Pre-AP names are treated as Tier II when no tier column is found.',
        'Rows that look like local credit, pass/fail, CBE, or excluded GPA records are unchecked.',
      ],
    } satisfies ImportSummary,
  };
}

export function makeExportCsv(courses: Course[]) {
  const rows = [
    [
      'Course',
      'Grade',
      'Credit',
      'Tier',
      'Subject',
      'Counts in GPA',
      'Weighted Points',
      'Unweighted Points',
    ],
    ...courses.map((course) => [
      course.name,
      String(course.grade),
      String(course.credit),
      tierLabels[course.tier],
      subjectLabels[course.subject],
      course.counts ? 'Yes' : 'No',
      courseWeightedPoints(course).toFixed(1),
      courseUnweightedPoints(course).toFixed(1),
    ]),
  ];

  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\n');
}

export function semesterGrade(mode: TermMode, values: Record<string, number>) {
  if (mode === 'sixWeeks') {
    return (
      (values.six1 * 2 + values.six2 * 2 + values.six3 * 2 + values.exam) / 7
    );
  }

  if (mode === 'nineWeeks') {
    return (values.nine1 * 3 + values.nine2 * 3 + values.exam) / 7;
  }

  if (mode === 'middleSchool') {
    return (values.six1 + values.six2 + values.six3) / 3;
  }

  return (values.semester1 + values.semester2) / 2;
}

export function requiredExamScore(mode: TermMode, values: Record<string, number>) {
  if (mode === 'sixWeeks') {
    return values.target * 7 - values.six1 * 2 - values.six2 * 2 - values.six3 * 2;
  }

  if (mode === 'nineWeeks') {
    return values.target * 7 - values.nine1 * 3 - values.nine2 * 3;
  }

  return null;
}
