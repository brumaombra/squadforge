# Publishing to npm

Use this checklist when you want to publish a new version of Squadforge to npm.

## Prerequisites

- You have an npm account with publish access for the package.
- You are logged in locally: `npm whoami`
- The working tree is in the state you want to publish.

## Publish a new version

1. Make sure the package version is new.

   Use one of these commands:

   ```bash
   npm version patch --no-git-tag-version
   npm version minor --no-git-tag-version
   npm version major --no-git-tag-version
   ```

   Use `patch` for a bug fix, `minor` for backward-compatible features, and `major` for breaking changes.

2. Check what will be published.

   ```bash
   npm pack --dry-run
   ```

3. Publish the package.

   ```bash
   npm publish
   ```

4. Verify the registry updated.

   ```bash
   npm view squadforge version dist-tags.latest
   ```

## Automated release

This repository uses GitHub Actions for release automation.

Set up a secret named `NPM_TOKEN` in GitHub with publish access to the package, then run the release workflow from the **Actions** tab.

The workflow will:

- check out the repository with full git history
- install dependencies
- run the test suite
- bump the package version and create the git commit/tag
- publish the package to npm
- push the commit and tags back to the repository

Choose one of these version bumps when you run the workflow:

- `patch`
- `minor`
- `major`

If you want to preview the release locally before running the workflow, use:

```bash
npm pack --dry-run
```

## Notes

- Do not republish the same version number.
- If the package was unpublished earlier, you still republish it under the same name, but the version must be new.
- This package is configured as public in `package.json`, so no extra access flag is needed for normal publishes.
- The GitHub Actions workflow expects a git remote named `origin` and publish access through `NPM_TOKEN`.

## Common checks

- Confirm the registry target if publish behavior looks wrong:

  ```bash
  npm config get registry
  ```

- Confirm the package name before publishing:

  ```bash
  node -p "require('./package.json').name"
  ```