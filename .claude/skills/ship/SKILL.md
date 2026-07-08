# Skill: /ship

When this skill is invoked, execute the following steps in order. Abort immediately if any step fails.

## Steps

1. **Run tests**
   Run `npx vitest run` to execute the full test suite.
   If any test fails, stop and report the failing tests to the user. Do not continue.

2. **Run linter**
   Run `npm run lint` to check for lint errors.
   If lint reports any errors, stop and report them to the user. Do not continue.

Report the result of each step to the user as you go.