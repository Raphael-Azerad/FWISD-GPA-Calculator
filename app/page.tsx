'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  BookOpen,
  Bug,
  Calculator,
  ChevronDown,
  ClipboardCopy,
  FileDown,
  FileUp,
  GraduationCap,
  Info,
  Plus,
  Printer,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  calculateCoreRankGpa,
  calculateGpa,
  clampGrade,
  courseUnweightedPoints,
  courseWeightedPoints,
  defaultCourses,
  formatNumber,
  getAutoCoreLimit,
  getLetterGrade,
  importCoursesFromCsv,
  makeExportCsv,
  requiredExamScore,
  sampleFocusCsv,
  semesterGrade,
  subjectLabels,
  tierLabels,
  weightedBands,
  type Course,
  type ImportSummary,
  type Subject,
  type TermMode,
  type Tier,
} from '@/lib/gpa';
import { reportMistakeUrl } from '@/lib/site-links';

function BreakdownTable({
  courses,
  coreSelectedIds,
}: {
  courses: Course[];
  coreSelectedIds?: Set<number>;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="max-h-[360px] overflow-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="sticky top-0 bg-secondary text-left">
            <tr>
              <th className="p-2 font-medium">Course</th>
              <th className="p-2 font-medium">Grade</th>
              <th className="p-2 font-medium">Tier</th>
              <th className="p-2 font-medium">Credit</th>
              <th className="p-2 font-medium">W pts</th>
              <th className="p-2 font-medium">UW pts</th>
              <th className="p-2 font-medium">Contribution</th>
              <th className="p-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const weighted = courseWeightedPoints(course);
              const unweighted = courseUnweightedPoints(course);
              return (
                <tr key={course.id} className="border-t border-border">
                  <td className="p-2">
                    <p className="font-medium">{course.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {subjectLabels[course.subject]}
                    </p>
                  </td>
                  <td className="p-2">{course.grade}</td>
                  <td className="p-2">
                    {course.tier === 'tier1'
                      ? 'I'
                      : course.tier === 'tier2'
                        ? 'II'
                        : 'III'}
                  </td>
                  <td className="p-2">{course.credit}</td>
                  <td className="p-2">{weighted.toFixed(1)}</td>
                  <td className="p-2">{unweighted.toFixed(1)}</td>
                  <td className="p-2">
                    {(weighted * course.credit).toFixed(2)}
                  </td>
                  <td className="p-2">
                    {course.counts ? (
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="rounded-lg">
                          GPA
                        </Badge>
                        {coreSelectedIds?.has(course.id) && (
                          <Badge variant="default" className="rounded-lg">
                            Core
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <Badge variant="outline" className="rounded-lg">
                        Excluded
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-normal">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function PrintableReport({
  courses,
  allGpa,
  coreGpa,
  totalCredits,
}: {
  courses: Course[];
  allGpa: ReturnType<typeof calculateGpa>;
  coreGpa: ReturnType<typeof calculateCoreRankGpa>;
  totalCredits: number;
}) {
  return (
    <section className="print-report hidden px-8 py-8 text-black">
      <div className="border-b border-black pb-4">
        <p className="text-sm uppercase tracking-normal">Unofficial estimate</p>
        <h1 className="mt-1 text-3xl font-semibold">FWISD GPA Report</h1>
        <p className="mt-2 text-sm">
          Generated in-browser by the unofficial FWISD GPA and Final Grade
          Calculator. Official GPA, credit, rank, and honors decisions come from
          FWISD.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3">
        {[
          ['Weighted GPA', formatNumber(allGpa.weighted)],
          ['Unweighted GPA', formatNumber(allGpa.unweighted)],
          ['Core/Rank GPA', formatNumber(coreGpa.weighted)],
          ['Total Credits', formatNumber(totalCredits, 1)],
        ].map(([label, value]) => (
          <div key={label} className="border border-black p-2">
            <p className="text-xs uppercase">{label}</p>
            <p className="mt-1 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <p>
          <span className="font-semibold">GPA credits:</span>{' '}
          {formatNumber(allGpa.credits, 1)}
        </p>
        <p>
          <span className="font-semibold">Counted grades:</span> {allGpa.count}
        </p>
        <p>
          <span className="font-semibold">Core/rank GPA:</span> best eligible
          ELAR, math, science, and social studies grades
        </p>
      </div>

      <table className="mt-5 w-full border-collapse text-xs">
        <thead>
          <tr>
            {[
              'Course',
              'Grade',
              'Credit',
              'Subject',
              'Tier',
              'W pts',
              'UW pts',
              'Status',
            ].map((heading) => (
              <th key={heading} className="border border-black p-1 text-left">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="border border-black p-1">{course.name}</td>
              <td className="border border-black p-1">{course.grade}</td>
              <td className="border border-black p-1">{course.credit}</td>
              <td className="border border-black p-1">
                {subjectLabels[course.subject]}
              </td>
              <td className="border border-black p-1">
                {course.tier === 'tier1'
                  ? 'I'
                  : course.tier === 'tier2'
                    ? 'II'
                    : 'III'}
              </td>
              <td className="border border-black p-1">
                {courseWeightedPoints(course).toFixed(1)}
              </td>
              <td className="border border-black p-1">
                {courseUnweightedPoints(course).toFixed(1)}
              </td>
              <td className="border border-black p-1">
                {course.counts ? 'GPA' : 'Excluded'}
                {coreGpa.selectedIds.has(course.id) ? ', Core' : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function Home() {
  const [courses, setCourses] = useState(defaultCourses);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(
    null,
  );
  const [importError, setImportError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [termMode, setTermMode] = useState<TermMode>('sixWeeks');
  const [gradeValues, setGradeValues] = useState({
    six1: 92,
    six2: 85,
    six3: 80,
    nine1: 92,
    nine2: 85,
    exam: 78,
    semester1: 86,
    semester2: 91,
    target: 70,
  });

  const allGpa = useMemo(() => calculateGpa(courses), [courses]);
  const totalCredits = useMemo(
    () => courses.reduce((sum, course) => sum + course.credit, 0),
    [courses],
  );
  const autoCoreLimit = useMemo(() => getAutoCoreLimit(courses), [courses]);
  const coreGpa = useMemo(
    () => calculateCoreRankGpa(courses, autoCoreLimit),
    [autoCoreLimit, courses],
  );
  const finalGrade = semesterGrade(termMode, gradeValues);
  const requiredExam = requiredExamScore(termMode, gradeValues);

  const updateCourse = <K extends keyof Course>(
    id: number,
    key: K,
    value: Course[K],
  ) => {
    setCourses((current) =>
      current.map((course) =>
        course.id === id ? { ...course, [key]: value } : course,
      ),
    );
  };

  const addCourse = () => {
    const nextId = Math.max(...courses.map((course) => course.id), 0) + 1;
    setCourses((current) => [
      ...current,
      {
        id: nextId,
        name: `Course ${nextId}`,
        grade: 90,
        credit: 0.5,
        tier: 'tier3',
        subject: 'other',
        counts: true,
      },
    ]);
  };

  const removeCourse = (id: number) => {
    setCourses((current) =>
      current.length > 1
        ? current.filter((course) => course.id !== id)
        : current,
    );
  };

  const updateGradeValue = (key: keyof typeof gradeValues, value: number) => {
    setGradeValues((current) => ({ ...current, [key]: clampGrade(value) }));
  };

  const handleCsvUpload = async (file: File | null) => {
    setImportError('');

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const imported = importCoursesFromCsv(text, file.name);

      if (!imported.courses.length) {
        setImportError(
          'No course grades were found. Check that the CSV includes course and grade information.',
        );
        return;
      }

      setCourses(imported.courses);
      setImportSummary(imported.summary);
    } catch {
      setImportError(
        'That CSV could not be read. Try exporting it from FOCUS again.',
      );
    }
  };

  const downloadCsv = (csv: string, fileName: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportBreakdown = () => {
    downloadCsv(makeExportCsv(courses), 'fwisd-gpa-breakdown.csv');
  };

  const downloadSampleCsv = () => {
    downloadCsv(sampleFocusCsv, 'fwisd-sample-focus-import.csv');
  };

  const printReport = () => {
    window.print();
  };

  const copySummary = async () => {
    const summary = [
      'FWISD GPA estimate',
      `Weighted GPA: ${formatNumber(allGpa.weighted)}`,
      `Unweighted GPA: ${formatNumber(allGpa.unweighted)}`,
      `Core/Class-Rank GPA: ${formatNumber(coreGpa.weighted)}`,
      `Total credits entered: ${formatNumber(totalCredits, 1)}`,
      `Credits affecting GPA: ${formatNumber(allGpa.credits, 1)}`,
      'Core/rank GPA: best eligible ELAR, math, science, and social studies grades',
      'Unofficial estimate only. Official records come from FWISD.',
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopyMessage('Summary copied');
    } catch {
      setCopyMessage('Copy failed');
    }

    window.setTimeout(() => setCopyMessage(''), 1800);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="no-print">
        <section className="border-b border-border bg-card">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <Badge variant="outline" className="mb-3 rounded-lg">
                  FWISD 2026-2027
                </Badge>
                <h1 className="text-3xl font-semibold tracking-normal text-balance sm:text-4xl">
                  GPA and Final Grade Calculator
                </h1>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  A student-built open-source calculator for Fort Worth ISD
                  weighted GPA, unweighted GPA, FOCUS CSV imports, semester
                  grades, and required exam scores.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-background p-2 text-sm md:min-w-72">
                <div className="rounded-md bg-secondary p-3">
                  <p className="text-muted-foreground">Passing grade</p>
                  <p className="mt-1 text-2xl font-semibold">70</p>
                </div>
                <div className="rounded-md bg-secondary p-3">
                  <p className="text-muted-foreground">Exam weight</p>
                  <p className="mt-1 text-2xl font-semibold">1/7</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <Tabs defaultValue="gpa" className="min-w-0">
            <TabsList className="mb-2 w-full justify-start bg-secondary">
              <TabsTrigger value="gpa" className="px-3">
                <GraduationCap data-icon="inline-start" />
                GPA
              </TabsTrigger>
              <TabsTrigger value="final" className="px-3">
                <Calculator data-icon="inline-start" />
                Final grade
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gpa">
              <Card className="rounded-lg">
                <CardHeader className="gap-4 border-b">
                  <div className="flex flex-col gap-4">
                    <div>
                      <CardTitle>Semester courses</CardTitle>
                      <CardDescription>
                        Enter courses manually or upload a CSV exported from
                        FOCUS.
                      </CardDescription>
                    </div>
                    <div className="grid gap-3 rounded-lg border border-border bg-secondary/45 p-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                      <div>
                        <p className="text-sm font-medium">Start with grades</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          Upload a FOCUS course-history CSV or add courses by
                          hand. Core/class-rank GPA is calculated automatically
                          from eligible ELAR, math, science, and social studies
                          grades.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById('focus-csv')?.click()
                          }
                        >
                          <FileUp data-icon="inline-start" />
                          Upload CSV
                        </Button>
                        <Button onClick={addCourse}>
                          <Plus data-icon="inline-start" />
                          Add course
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <input
                        id="focus-csv"
                        type="file"
                        accept=".csv,text/csv"
                        className="sr-only"
                        onChange={(event) => {
                          void handleCsvUpload(event.target.files?.[0] ?? null);
                          event.currentTarget.value = '';
                        }}
                      />
                      <details className="rounded-lg border border-border bg-secondary/45">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm font-medium">
                          <span className="flex items-center gap-2">
                            <Settings2 className="size-4" />
                            More tools
                          </span>
                          <span className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
                            Export, sample, print, report, reset
                            <ChevronDown className="size-4" />
                          </span>
                        </summary>
                        <div className="flex flex-wrap gap-2 border-t border-border p-2">
                          <Button variant="outline" onClick={exportBreakdown}>
                            <FileDown data-icon="inline-start" />
                            Export breakdown
                          </Button>
                          <Button variant="outline" onClick={downloadSampleCsv}>
                            <FileDown data-icon="inline-start" />
                            Sample CSV
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => void copySummary()}
                          >
                            <ClipboardCopy data-icon="inline-start" />
                            {copyMessage || 'Copy summary'}
                          </Button>
                          <Button variant="outline" onClick={printReport}>
                            <Printer data-icon="inline-start" />
                            Print report
                          </Button>
                          <Link
                            className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                            href={reportMistakeUrl}
                          >
                            <Bug data-icon="inline-start" />
                            Report mistake
                          </Link>
                          <Button
                            variant="outline"
                            onClick={() => setCourses(defaultCourses)}
                          >
                            <RotateCcw data-icon="inline-start" />
                            Clear courses
                          </Button>
                        </div>
                      </details>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {(importSummary || importError) && (
                    <div className="rounded-lg border border-border bg-secondary/60 p-4">
                      {importError ? (
                        <p className="text-sm font-medium text-destructive">
                          {importError}
                        </p>
                      ) : importSummary ? (
                        <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
                          <div>
                            <p className="text-sm font-semibold">
                              Imported {importSummary.imported} courses from{' '}
                              {importSummary.fileName}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {importSummary.skipped} courses skipped. Review
                              tier, subject, credits, and Counts before treating
                              this as your estimate.
                            </p>
                          </div>
                          <div className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                            {Object.entries(importSummary.detected).map(
                              ([key, value]) => (
                                <p key={key}>
                                  <span className="font-medium capitalize text-foreground">
                                    {key}:
                                  </span>{' '}
                                  {value ?? 'inferred'}
                                </p>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}

                  <div className="grid gap-3">
                    {courses.map((course) => {
                      const fieldIds = {
                        name: `course-${course.id}-name`,
                        grade: `course-${course.id}-grade`,
                        credit: `course-${course.id}-credit`,
                        tier: `course-${course.id}-tier`,
                        subject: `course-${course.id}-subject`,
                        counts: `course-${course.id}-counts`,
                      };

                      return (
                        <div
                          key={course.id}
                          className="grid gap-3 rounded-lg border border-border bg-card p-3 lg:grid-cols-[minmax(140px,1.2fr)_90px_90px_minmax(170px,1fr)_minmax(145px,0.85fr)_92px_36px]"
                        >
                          <label
                            htmlFor={fieldIds.name}
                            className="grid gap-1 text-sm font-medium"
                          >
                            Course
                            <Input
                              id={fieldIds.name}
                              value={course.name}
                              onChange={(event) =>
                                updateCourse(
                                  course.id,
                                  'name',
                                  event.target.value,
                                )
                              }
                            />
                          </label>
                          <label
                            htmlFor={fieldIds.grade}
                            className="grid gap-1 text-sm font-medium"
                          >
                            Grade
                            <Input
                              id={fieldIds.grade}
                              type="number"
                              min={0}
                              max={100}
                              value={course.grade}
                              onChange={(event) =>
                                updateCourse(
                                  course.id,
                                  'grade',
                                  clampGrade(event.target.valueAsNumber),
                                )
                              }
                            />
                          </label>
                          <label
                            htmlFor={fieldIds.credit}
                            className="grid gap-1 text-sm font-medium"
                          >
                            Credit
                            <Input
                              id={fieldIds.credit}
                              type="number"
                              min={0}
                              step={0.5}
                              value={course.credit}
                              onChange={(event) =>
                                updateCourse(
                                  course.id,
                                  'credit',
                                  Math.max(0, event.target.valueAsNumber || 0),
                                )
                              }
                            />
                          </label>
                          <label
                            htmlFor={fieldIds.tier}
                            className="grid gap-1 text-sm font-medium"
                          >
                            Tier
                            <NativeSelect
                              id={fieldIds.tier}
                              value={course.tier}
                              onChange={(event) =>
                                updateCourse(
                                  course.id,
                                  'tier',
                                  event.target.value as Tier,
                                )
                              }
                              className="w-full"
                            >
                              <NativeSelectOption value="tier1">
                                Tier I
                              </NativeSelectOption>
                              <NativeSelectOption value="tier2">
                                Tier II
                              </NativeSelectOption>
                              <NativeSelectOption value="tier3">
                                Tier III
                              </NativeSelectOption>
                            </NativeSelect>
                          </label>
                          <label
                            htmlFor={fieldIds.subject}
                            className="grid gap-1 text-sm font-medium"
                          >
                            Subject
                            <NativeSelect
                              id={fieldIds.subject}
                              value={course.subject}
                              onChange={(event) =>
                                updateCourse(
                                  course.id,
                                  'subject',
                                  event.target.value as Subject,
                                )
                              }
                              className="w-full"
                            >
                              {Object.entries(subjectLabels).map(
                                ([value, label]) => (
                                  <NativeSelectOption key={value} value={value}>
                                    {label}
                                  </NativeSelectOption>
                                ),
                              )}
                            </NativeSelect>
                          </label>
                          <label
                            htmlFor={fieldIds.counts}
                            className="flex items-end gap-2 text-sm font-medium lg:pb-1.5"
                          >
                            <input
                              id={fieldIds.counts}
                              type="checkbox"
                              checked={course.counts}
                              onChange={(event) =>
                                updateCourse(
                                  course.id,
                                  'counts',
                                  event.target.checked,
                                )
                              }
                              className="mb-1 size-4 rounded border-border accent-primary"
                            />
                            Counts
                          </label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCourse(course.id)}
                            aria-label={`Remove ${course.name}`}
                            className="self-end"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <ResultCard
                      label="Weighted GPA"
                      value={formatNumber(allGpa.weighted)}
                      detail={`${formatNumber(allGpa.credits, 1)} GPA credits counted`}
                    />
                    <ResultCard
                      label="Unweighted GPA"
                      value={formatNumber(allGpa.unweighted)}
                      detail={`${allGpa.count} counted grades`}
                    />
                    <ResultCard
                      label="Core / Rank GPA"
                      value={formatNumber(coreGpa.weighted)}
                      detail="Best eligible core grades"
                    />
                    <ResultCard
                      label="Total Credits"
                      value={formatNumber(totalCredits, 1)}
                      detail={`${formatNumber(allGpa.credits, 1)} credits affect GPA`}
                    />
                  </div>

                  <Card className="rounded-lg bg-secondary/45">
                    <CardHeader>
                      <CardTitle>Why this GPA?</CardTitle>
                      <CardDescription>
                        GPA is the total grade points earned divided by the
                        counted credits. Excluded courses do not affect the
                        totals.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-lg border border-border bg-background p-3">
                          <p className="text-xs font-medium uppercase text-muted-foreground">
                            Weighted math
                          </p>
                          <p className="mt-1 font-semibold">
                            {formatNumber(allGpa.weightedTotal, 2)} /{' '}
                            {formatNumber(allGpa.credits, 1)}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-background p-3">
                          <p className="text-xs font-medium uppercase text-muted-foreground">
                            Unweighted math
                          </p>
                          <p className="mt-1 font-semibold">
                            {formatNumber(allGpa.unweightedTotal, 2)} /{' '}
                            {formatNumber(allGpa.credits, 1)}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-background p-3">
                          <p className="text-xs font-medium uppercase text-muted-foreground">
                            Core/rank math
                          </p>
                          <p className="mt-1 font-semibold">
                            {formatNumber(coreGpa.weightedTotal, 2)} /{' '}
                            {formatNumber(coreGpa.credits, 1)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Cumulative GPA uses courses where FOCUS says Affects GPA
                        = Y. Core/class-rank GPA uses only ELAR, math, science,
                        and social studies. The app picks the strongest eligible
                        core grades automatically for the estimate.
                      </p>
                      <BreakdownTable
                        courses={courses}
                        coreSelectedIds={coreGpa.selectedIds}
                      />
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="final">
              <Card className="rounded-lg">
                <CardHeader className="gap-3 border-b">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <CardTitle>Semester and final grade</CardTitle>
                      <CardDescription>
                        Choose the schedule pattern, then enter the current
                        grades.
                      </CardDescription>
                    </div>
                    <NativeSelect
                      id="grade-calculation-mode"
                      value={termMode}
                      onChange={(event) =>
                        setTermMode(event.target.value as TermMode)
                      }
                      className="w-full md:w-72"
                      aria-label="Grade calculation mode"
                    >
                      <NativeSelectOption value="sixWeeks">
                        High school: six-weeks
                      </NativeSelectOption>
                      <NativeSelectOption value="nineWeeks">
                        High school: nine-weeks
                      </NativeSelectOption>
                      <NativeSelectOption value="middleSchool">
                        Middle school: regular course
                      </NativeSelectOption>
                      <NativeSelectOption value="yearly">
                        Yearly grade
                      </NativeSelectOption>
                    </NativeSelect>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 pt-4 lg:grid-cols-[1fr_260px]">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {termMode === 'sixWeeks' && (
                      <>
                        {(['six1', 'six2', 'six3'] as const).map(
                          (key, index) => (
                            <label
                              key={key}
                              htmlFor={`${key}-grade`}
                              className="grid gap-1 text-sm font-medium"
                            >
                              {index + 1}
                              {index === 0
                                ? 'st'
                                : index === 1
                                  ? 'nd'
                                  : 'rd'}{' '}
                              six-weeks
                              <Input
                                id={`${key}-grade`}
                                type="number"
                                min={0}
                                max={100}
                                value={gradeValues[key]}
                                onChange={(event) =>
                                  updateGradeValue(
                                    key,
                                    event.target.valueAsNumber,
                                  )
                                }
                              />
                            </label>
                          ),
                        )}
                        <label
                          htmlFor="six-weeks-exam-grade"
                          className="grid gap-1 text-sm font-medium"
                        >
                          Semester exam or activity
                          <Input
                            id="six-weeks-exam-grade"
                            type="number"
                            min={0}
                            max={100}
                            value={gradeValues.exam}
                            onChange={(event) =>
                              updateGradeValue(
                                'exam',
                                event.target.valueAsNumber,
                              )
                            }
                          />
                        </label>
                      </>
                    )}

                    {termMode === 'nineWeeks' && (
                      <>
                        {(['nine1', 'nine2'] as const).map((key, index) => (
                          <label
                            key={key}
                            htmlFor={`${key}-grade`}
                            className="grid gap-1 text-sm font-medium"
                          >
                            {index + 1}
                            {index === 0 ? 'st' : 'nd'} nine-weeks
                            <Input
                              id={`${key}-grade`}
                              type="number"
                              min={0}
                              max={100}
                              value={gradeValues[key]}
                              onChange={(event) =>
                                updateGradeValue(
                                  key,
                                  event.target.valueAsNumber,
                                )
                              }
                            />
                          </label>
                        ))}
                        <label
                          htmlFor="nine-weeks-exam-grade"
                          className="grid gap-1 text-sm font-medium"
                        >
                          Semester exam or activity
                          <Input
                            id="nine-weeks-exam-grade"
                            type="number"
                            min={0}
                            max={100}
                            value={gradeValues.exam}
                            onChange={(event) =>
                              updateGradeValue(
                                'exam',
                                event.target.valueAsNumber,
                              )
                            }
                          />
                        </label>
                      </>
                    )}

                    {termMode === 'middleSchool' && (
                      <>
                        {(['six1', 'six2', 'six3'] as const).map(
                          (key, index) => (
                            <label
                              key={key}
                              htmlFor={`middle-${key}-grade`}
                              className="grid gap-1 text-sm font-medium"
                            >
                              {index + 1}
                              {index === 0
                                ? 'st'
                                : index === 1
                                  ? 'nd'
                                  : 'rd'}{' '}
                              six-weeks
                              <Input
                                id={`middle-${key}-grade`}
                                type="number"
                                min={0}
                                max={100}
                                value={gradeValues[key]}
                                onChange={(event) =>
                                  updateGradeValue(
                                    key,
                                    event.target.valueAsNumber,
                                  )
                                }
                              />
                            </label>
                          ),
                        )}
                      </>
                    )}

                    {termMode === 'yearly' && (
                      <>
                        <label
                          htmlFor="semester-1-grade"
                          className="grid gap-1 text-sm font-medium"
                        >
                          Semester 1
                          <Input
                            id="semester-1-grade"
                            type="number"
                            min={0}
                            max={100}
                            value={gradeValues.semester1}
                            onChange={(event) =>
                              updateGradeValue(
                                'semester1',
                                event.target.valueAsNumber,
                              )
                            }
                          />
                        </label>
                        <label
                          htmlFor="semester-2-grade"
                          className="grid gap-1 text-sm font-medium"
                        >
                          Semester 2
                          <Input
                            id="semester-2-grade"
                            type="number"
                            min={0}
                            max={100}
                            value={gradeValues.semester2}
                            onChange={(event) =>
                              updateGradeValue(
                                'semester2',
                                event.target.valueAsNumber,
                              )
                            }
                          />
                        </label>
                      </>
                    )}

                    {(termMode === 'sixWeeks' || termMode === 'nineWeeks') && (
                      <label
                        htmlFor="target-semester-grade"
                        className="grid gap-1 text-sm font-medium"
                      >
                        Target semester grade
                        <Input
                          id="target-semester-grade"
                          type="number"
                          min={0}
                          max={100}
                          value={gradeValues.target}
                          onChange={(event) =>
                            updateGradeValue(
                              'target',
                              event.target.valueAsNumber,
                            )
                          }
                        />
                      </label>
                    )}
                  </div>

                  <div className="grid content-start gap-3">
                    <ResultCard
                      label={
                        termMode === 'yearly'
                          ? 'Yearly grade'
                          : 'Semester grade'
                      }
                      value={`${Math.round(finalGrade)}`}
                      detail={`${finalGrade.toFixed(1)} raw, ${getLetterGrade(finalGrade)} letter`}
                    />
                    {requiredExam !== null && (
                      <ResultCard
                        label="Needed on exam"
                        value={
                          requiredExam <= 0
                            ? '0'
                            : requiredExam > 100
                              ? '>100'
                              : `${Math.ceil(requiredExam)}`
                        }
                        detail={`For a ${gradeValues.target} semester grade target`}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <aside className="grid gap-4 lg:content-start">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="size-4" />
                  FWISD assumptions
                </CardTitle>
                <CardDescription>
                  Built from FWISD Bulletin 100 and the 2026-2027 Secondary
                  Guide to Grade Reporting.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  Weighted GPA uses Tier I, Tier II, and Tier III grade-point
                  bands. Unweighted GPA uses the simple 4.0 scale.
                </p>
                <p>
                  Core/class-rank GPA uses the highest eligible semester grades
                  in ELAR, math, science, and social studies. Senior-year
                  recalculation can pull eligible pre-grade-9 high-school-credit
                  courses if a subject has fewer than eight high-school grades.
                </p>
                <p>
                  Local credit, pass/fail, CBE, and other excluded records
                  should be unchecked. FOCUS CSV imports use Affects GPA = Y
                  when present.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Weighted scale</CardTitle>
                <CardDescription>Grade points by course tier.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary text-left">
                      <tr>
                        <th className="p-2 font-medium">Grade</th>
                        <th className="p-2 font-medium">I</th>
                        <th className="p-2 font-medium">II</th>
                        <th className="p-2 font-medium">III</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weightedBands.map((band) => (
                        <tr key={band.label} className="border-t border-border">
                          <td className="p-2">{band.label}</td>
                          <td className="p-2">{band.tier1.toFixed(1)}</td>
                          <td className="p-2">{band.tier2.toFixed(1)}</td>
                          <td className="p-2">{band.tier3.toFixed(1)}</td>
                        </tr>
                      ))}
                      <tr className="border-t border-border">
                        <td className="p-2">69 or below</td>
                        <td className="p-2">0.0</td>
                        <td className="p-2">0.0</td>
                        <td className="p-2">0.0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                  {Object.entries(tierLabels).map(([tier, label]) => (
                    <p key={tier}>{label}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <section className="border-t border-border bg-card">
          <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="size-4" />
                  How FWISD GPA Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  Cumulative unweighted GPA averages the unweighted GPA points
                  for all courses that count. Cumulative weighted GPA averages
                  the weighted points for courses that count.
                </p>
                <p>
                  Core/class-rank GPA is different: it only uses ELAR, math,
                  science, and social studies. FWISD guidance points to the
                  eight highest eligible semester grades in each of those core
                  subjects for complete records. For in-progress records, this
                  site uses the best available core grades automatically.
                </p>
                <p>
                  If a FOCUS export has already calculated `Weighted GPA` and
                  `GPA PTS`, the site uses those point values for the breakdown.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="size-4" />
                  Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  Formula notes are based on FWISD Bulletin 100, the 2026-2027
                  Secondary Guide to Grade Reporting, and the I.M. Terrell GPA
                  and Class Rank overview.
                </p>
                <p>
                  The calculator uses those sources as public guidance plus
                  FOCUS CSV columns when available. It is not connected to
                  FWISD, FOCUS, or a student record system.
                </p>
                <a
                  className="inline-flex font-medium text-primary underline-offset-4 hover:underline"
                  href="https://imterrell.fwisd.org/counseling/academic-support/gpa-class-rank"
                  target="_blank"
                  rel="noreferrer"
                >
                  View FWISD GPA overview
                </a>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="size-4" />
                  Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  CSV files are parsed in your browser. The app does not create
                  an account, store uploaded grade files, or send your course
                  courses to a database owned by this project.
                </p>
                <p>
                  The hosting provider may keep normal server logs such as page
                  requests, browser type, rough location, and error information.
                </p>
                <p>
                  Do not upload information you are not comfortable processing
                  in a browser-based calculator.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="size-4" />
                  Reports & Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                <p>
                  This website was developed by an FWISD student and is not an
                  official Fort Worth ISD product. It may contain mistakes,
                  outdated assumptions, or imperfect CSV guesses.
                </p>
                <p>
                  Use it for learning and estimation only. Official transcript,
                  GPA, credit, class-rank, and honors decisions are made by
                  FWISD.
                </p>
                <p>
                  The site is provided as-is, without warranties or liability to
                  the fullest extent allowed by law.
                </p>
                <a
                  className="inline-flex font-medium text-primary underline-offset-4 hover:underline"
                  href={reportMistakeUrl}
                >
                  Report a formula mistake
                </a>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <PrintableReport
        courses={courses}
        allGpa={allGpa}
        coreGpa={coreGpa}
        totalCredits={totalCredits}
      />
    </main>
  );
}
