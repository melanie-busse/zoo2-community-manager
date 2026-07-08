---
name: ship
description: Run tests, linter, production build, and create a local git commit
---

# Skill: /ship

When this skill is invoked, execute the following steps in order. Abort immediately if any step fails.

## Steps

1. **Run tests**
   Execute `npx vitest run` immediately without asking for confirmation.
   If any test fails, stop and report the failing tests. Do not continue.

2. **Run linter**
   Execute `npm run lint` immediately without asking for confirmation.
   If lint reports any errors, stop and report them. Do not continue.

3. **Production Build Check**
   Execute `npm run build` immediately without asking for confirmation to verify all TypeScript and Prisma types.
   If the build fails, stop and report the compilation errors. Do not continue.

4. **Local Git Commit**
   If all previous steps pass, prompt the user *once* for a commit message (or use the context of the current task if provided).
   Then execute:
   - `git add .`
   - `git commit -m "<commit_message>"`

5. **Final Instruction**
   Remind the user to execute `git push` manually due to the multi-account setup.

Report the result of each step to the user as you go.