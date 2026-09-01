# Security Policy

## Reporting A Vulnerability

Please do not open a public issue for security or privacy problems involving student data.

If this repository is hosted on GitHub, use GitHub's private vulnerability reporting feature if enabled. Otherwise, contact the repository owner directly.

## Student Data

This project should never store real student records in the repository. Reports should avoid including:

- Student names
- Student IDs
- Official transcripts
- Class-rank screenshots
- Raw FOCUS CSV exports

Use anonymized examples whenever possible.

## Privacy Model

CSV parsing happens in the browser. The project does not intentionally send uploaded course data to a backend database. Hosting infrastructure may still keep normal request and error logs.
