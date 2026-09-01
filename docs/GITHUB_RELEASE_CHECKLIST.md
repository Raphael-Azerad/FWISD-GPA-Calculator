# GitHub Release Checklist

Use this before making the repository public.

## Create And Push The Repository

Create a new GitHub repository:

- Owner: `Raphael-Azerad`
- Repository name: `FWISD-GPA-Calculator`
- Visibility: public
- Do not initialize with a README, license, or `.gitignore`; those already exist locally.

The local `origin` remote should point to:

```bash
git@github.com:Raphael-Azerad/FWISD-GPA-Calculator.git
```

Push the prepared local history:

```bash
git push -u origin main
```

Then add this homepage URL in the GitHub repository settings:

```bash
https://fwisd-gpa-calculator.mysterious-flute.workers.dev/
```

## Final Checks

- Confirm no real student CSV files, screenshots, names, IDs, class ranks, or transcripts are committed.
- Update README badge URLs if the GitHub repository name is different from `Raphael-Azerad/FWISD-GPA-Calculator`.
- Enable GitHub Actions.
- Confirm the Contributors sidebar lists only the intended maintainer.
- Enable Dependabot alerts and security updates.
- Install the CodeRabbit GitHub app if PR review automation is wanted.
- Add `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` as GitHub Actions
  secrets, then run the **Deploy to Cloudflare** workflow.
- Add the live site URL to the GitHub repository description.
- Keep the README live-site badge pointed at the current Cloudflare URL.
- Open one test pull request and confirm CI, Dependabot config, and CodeRabbit config behave as expected.
- Keep official FWISD policy claims linked to public sources or clearly labeled as inferred.
