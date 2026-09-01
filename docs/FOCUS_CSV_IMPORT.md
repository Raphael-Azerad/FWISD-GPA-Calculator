# FOCUS CSV Import

This app accepts CSV files exported from FOCUS Course History or similar grade views.

## Preferred FOCUS Columns

The importer looks for:

| FOCUS column                   | Used for                                    |
| ------------------------------ | ------------------------------------------- |
| `Course` or course-like fields | Course name                                 |
| `Percent`                      | Numeric grade                               |
| `Cred. Earned`                 | Credits earned                              |
| `Grade Scale`                  | Tier or weighting scale                     |
| `Grad Subject`                 | Core subject grouping                       |
| `Affects GPA`                  | Whether the course counts in cumulative GPA |
| `GPA PTS`                      | Unweighted points                           |
| `Weighted GPA`                 | Weighted points                             |

If the point columns are present, the app trusts them. If not, it uses the FWISD scale implemented in the app.

## Generic CSVs

The importer also tries to recognize common alternatives:

- `Course`, `Course Name`, `Class`, `Description`
- `Grade`, `Final Grade`, `Semester Grade`, `Average`, `Score`
- `Credit`, `Credits`, `Credits Earned`
- `Tier`, `Level`, `Course Level`, `Weighted`, `Type`
- `Subject`, `Department`, `Content Area`
- `Included in GPA`, `Counts`, `Credit Type`

Generic CSV imports are best-effort. Users should review every imported course before trusting the estimate.

## Privacy

CSV parsing happens in the browser. The app does not upload course data to a server-side database.

Do not commit real student CSV files to the repository.
