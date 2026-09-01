# CodeRabbit Setup

This repository includes a `.coderabbit.yaml` file so CodeRabbit can review pull requests with project-specific context.

After the project is pushed to GitHub:

1. Install or enable the CodeRabbit GitHub app for the repository.
2. Open a small pull request.
3. Confirm CodeRabbit reads `.coderabbit.yaml`.
4. Keep formula changes tied to anonymized fixtures and tests.

Current docs:

- CodeRabbit YAML configuration: <https://docs.coderabbit.ai/getting-started/yaml-configuration>
- Path-based review instructions: <https://docs.coderabbit.ai/configuration/path-instructions>

The CodeRabbit config asks reviews to be extra careful with:

- GPA and final-grade calculation changes
- FOCUS CSV import behavior
- Public policy claims
- Student-data privacy

Do not paste real student records into CodeRabbit comments, GitHub issues, pull requests, or fixtures.
