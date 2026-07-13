# EduVerse Malaysia — Release Checklist

Every release — content addition, feature, or fix that's user-visible — must
go through this checklist. The goal: no surface is left behind. A release
is not "done" until every box below is checked, not just the student-facing
web flow.

## 1. Version bump (do this first)

- [ ] `js/config.js` — bump `APP_VERSION` (semver). Shown on the landing
      page footer so parents/teachers can see what they're on.
- [ ] `sw.js` — bump the `CACHE` constant (e.g. `eduverse-v47` → `v48`).
      Without this, existing users' browsers keep serving old cached files.
- [ ] `package.json` — bump `"version"` to match `APP_VERSION`.
- [ ] Android — bump `versionCode` (integer, always +1) and `versionName`
      (match `APP_VERSION`) in `android/app/build.gradle`.

**Semver convention:**
- `1.x.0` — new content (subjects, worlds, lessons, features)
- `1.0.x` — bug fixes only, no new content
- `2.0.0` — reserved for structurally breaking changes (data migration, etc.)

## 2. Student-facing web flow

- [ ] New content added to `js/data/curriculum.js` (`WORLDS`, `LESSONS`,
      `QUIZZES`, `BOSSES`, `MAP_STORY` — keep them all in sync per world/lesson)
- [ ] Landing page world count/text — should already be dynamic
      (`${WORLDS.length}` in `js/views.js`), verify it renders correctly
- [ ] `MAP_FINALE` narrative text — update if the total world count changed
      enough that flavor text ("nine pieces" etc.) reads wrong
- [ ] Any subject/world-specific game logic — e.g. `js/games.js`'s
      `bmWorlds` list (controls Malay vs English speech recognition in
      Speak It!) — add new world IDs if they're BM-medium subjects

## 3. Parent dashboard (`js/views.js`)

- [ ] `SUBJECT_EMOJI` map has an entry for every new subject (falls back to
      a generic 📘 icon otherwise — not broken, but inconsistent)
- [ ] No hardcoded counts like `/9` for bosses defeated, story pieces, etc.
      — these must derive from `WORLDS.length` / `Object.keys(MAP_STORY).length`
- [ ] `subjectBreakdown`/`focusSuggestion` render correctly for new subjects
      (should be automatic — dynamic off `user.stats.bySubject`, but verify)

## 4. Teacher dashboard (`js/views.js`)

- [ ] Lesson/homework picker includes new lessons (should be automatic —
      iterates `LESSONS` directly, verify no filtered/hardcoded subset)

## 5. Admin panel (`js/views.js`, function `admin()`)

- [ ] Stats grid (`WORLDS.length`, `LESSONS.length`, `QUIZZES` count) reflects
      new totals (should be automatic)
- [ ] World/boss/pet/achievement icon-override rows include new worlds
      (should be automatic — iterates `WORLDS`/`CATALOG`, verify no
      hardcoded old world-ID list)

## 6. Friend Duel / Pass Device mode (`js/views.js`)

- [ ] Duel topic picker (`renderCreateDuelSetup`) shows new lessons/worlds
      (should be automatic — iterates completed `LESSONS` + `WORLDS.find`,
      verify no hardcoded subject/world list)
- [ ] Pass-device local mode picks up new lessons the same way

## 7. Premium / paywall (`js/data/curriculum.js` FREE_WORLD_IDS, `firestore.rules`, `payments/`)

- [ ] If you add a new world, decide whether it's a free-trial world or
      premium-gated (default: only the 3 starter worlds in `FREE_WORLD_IDS`
      are free — everything else requires `user.premium`)
- [ ] Any new route that renders lesson/world content directly (bypassing
      `#/worlds`) must re-check `user.unlockedWorlds`/`user.premium` itself —
      see the guards in `worldDetail()`/`lessonFlow()` in `js/views.js`
- [ ] `firestore.rules` still blocks clients from writing their own
      `premium` field (only the `payments/` webhook, via Admin SDK, may set it)
- [ ] The `payments/` serverless backend is a **separate Vercel deployment**
      from GitHub Pages — it only needs redeploying if `payments/api/*.js`
      itself changes, not on every content release
- [ ] Android currently has no purchase flow (on hold) — Play Store builds
      must use Google Play Billing when that resumes, not ToyyibPay
      (Play policy requirement for unlocking in-app digital content)

## 8. Android app (Capacitor) — do not skip this

The native app does **not** auto-update from the web deploy. It ships its
own APK/AAB build from a snapshot of the web assets. Every release needs:

- [ ] `npm run build:www` — rebuild `www/` from current source
- [ ] `npx cap sync android` — push into the native project
- [ ] Bump `versionCode`/`versionName` in `android/app/build.gradle` (done
      in step 1)
- [ ] Rebuild: `cd android && ./gradlew assembleDebug` (or `bundleRelease`
      for a signed Play Store build)
- [ ] Reinstall on a test device/emulator and smoke-test the new content
      end-to-end (sign-in still works, new lessons load, no stale
      Service-Worker cache — `adb shell pm clear <package>` if testing
      cached-asset issues)
- [ ] If shipping to Play Store: upload the new signed `.aab` as a new
      release in Play Console

## 9. Deploy & verify

- [ ] Commit and push to `origin/main` (GitHub Pages auto-deploys)
- [ ] Check the GitHub Pages build succeeded
      (`gh api repos/<owner>/<repo>/pages/builds/latest`)
- [ ] Load the live site in a browser, confirm:
  - New content renders (world count, subjects, version footer)
  - No console errors
  - Service worker picked up the new cache version
      (`caches.keys()` in devtools should show the new version string)
