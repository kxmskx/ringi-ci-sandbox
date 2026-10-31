// Ringi Gate project profile, created by `ringi init`.
//
// The runner loads this file once, from the repository root, before the
// first round, and records the SHA-256 of this file and of every module it
// imports. If the writer (or a gate) changes any of them during a run, the
// run stops with PROFILE_MODIFIED. Imports must be relative paths or
// Node.js built-ins.
//
// Every field is described in docs/profile.md of Ringi Gate
// (ringi-core). Fields left out (taskSchema, taskClasses,
// docsCandidatePolicy, implementer, reviewer) take the core defaults.
//
// checks: the only commands the runner may run as gates. A pnpm check
// names a script of package.json and always runs as
// `pnpm [--filter <package>] run <script>`; a git check is limited to
// `git diff --check`. The check name must equal the program and its
// arguments joined with spaces.
export const PROFILE = {
  title: 'RINGI',
  tempPrefix: 'ringi-review-',
  checks: {
    'pnpm run test': {
      program: 'pnpm',
      args: ['run', 'test'],
      timeoutMs: 20 * 60_000,
    },
    'git diff --check': {
      program: 'git',
      args: ['diff', '--check'],
      timeoutMs: 2 * 60_000,
    },
  },
  // base: gates of every implementation task; docs: gates of
  // documentation-only task classes.
  checkSets: {
    base: ['pnpm run test', 'git diff --check'],
    docs: ['git diff --check'],
  },
  // Paths that require a check named in the task, for example
  // { check: 'pnpm run test', prefixes: ['src/db/'], paths: [],
  //   code: 'DATABASE_GATE' }.
  requiredGateRules: [],
  // Language of the runner's messages, of the agent prompts and of the
  // default task schema: 'en' or 'pl'.
  locale: 'en',
  ci: {
    docsPaths: ['README.md', 'docs/'],
    lanes: {
      docs: ['git diff --check'],
      full: ['git diff --check', 'pnpm run test'],
    },
    review: {
      profiles: { docs: 'economy', full: 'economy' },
      maxAttempts: 2,
      timeoutMinutes: 20,
      credentials: ['ANTHROPIC_API_KEY'],
    },
  },
};
