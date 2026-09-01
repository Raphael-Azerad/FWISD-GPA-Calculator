# Cloudflare Deployment

The current Cloudflare Worker URL is:

<https://fwisd-gpa-calculator.mysterious-flute.workers.dev/>

This app builds to a Cloudflare Worker with static assets. Use Cloudflare
Workers for deployment instead of a static-only Pages upload.

## GitHub Actions Deployment

The repository includes a manual workflow at
`.github/workflows/cloudflare-deploy.yml`.

Before running it, add these GitHub repository secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

The token should be scoped to deploy Workers for the Cloudflare account that
will host the site. Do not commit the token to the repository.

Then run the **Deploy to Cloudflare** workflow from the GitHub Actions tab. It
will lint, test, build, and deploy with:

```bash
npm run deploy:cloudflare
```

The deployed Worker will use the generated Worker name
`fwisd-gpa-calculator`. Cloudflare will provide a `workers.dev` URL, and a
custom domain can be attached from the Cloudflare dashboard later.

## Local Deployment

If deploying from a local machine instead of GitHub Actions:

```bash
npm install
npm run build
npx wrangler login
npm run deploy:cloudflare
```

Only run `wrangler login` on a machine/browser where you are comfortable
connecting your Cloudflare account.
