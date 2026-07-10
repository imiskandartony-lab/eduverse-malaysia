# Firestore Schema

All collections mirror the shapes in `js/data/curriculum.js` and `js/store.js` (`defaultProfile`).

## users/{uid}
```
name, role: 'student'|'parent'|'teacher'|'admin', year: 5|6
xp, coins, gems, level, streak, lastLogin: 'YYYY-MM-DD'
avatarBase, equipped: {hat, glasses, pet, wings, backpack, emote}, owned: [itemId]
completedLessons: [lessonId], unlockedWorlds: [worldId], achievements: [id]
missions: [{id, text, kind, target, progress, done, claimed, xp, coins}], missionsDate
stats: {correct, wrong, gamesPlayed, minutes, weakTopics: {topic: missCount}}
```

## parents/{uid}
`children: [studentUid], notifications: bool, reportFrequency: 'weekly'|'monthly'`

## teachers/{uid} + subcollection classes/{classId}
`classes: name, year, studentUids: [], createdAt`

## lessons/{id}
`title, worldId, subject, topic, kssr, year, intro, steps: [html], videoUrl?, animationUrl?, difficulty: 1-3, xp, coins, prerequisite: lessonId|null`

## quizzes/{lessonId}
`items: [{q, options: [4], answer: idx, explain, hint, difficulty, category}]`

## worlds/{id}
`name, emoji, subject, desc, order, color`

## rewards/{id}
`name, emoji, type: 'hat'|'glasses'|'pet'|'wings'|'backpack'|'emote'|'badge'|'trophy', price, seasonal?: {from, to}`

## missions/{id} (templates)
`text, kind: 'lesson'|'correct'|'game'|'login', target, xp, coins, expiry`

## leaderboards/{period}  (period: 'weekly-2026-W28' | 'monthly-2026-07' | 'alltime')
`entries: [{uid, name, xp}]` — rebuilt by scheduled job/admin; read-only to clients.

## assignments/{id}
`teacherUid, classId, lessonId, dueDate, completedBy: [uid]`

## analytics/{autoId}
`uid, type: 'lesson_complete'|'quiz_answer'|'game_played'|'session', lessonId?, correct?, ms?, at: timestamp`

## Free-tier notes
- Reads dominate: cache curriculum locally (service worker + localStorage) so Firestore reads stay far under the 50k/day free quota.
- Leaderboard is one document per period (1 read) instead of a per-user query.
- Analytics events are batched client-side and flushed once per session.
