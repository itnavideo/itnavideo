# English Video Reference

Use this as the canonical structure for English reel transcription, script planning, and Remotion timeline generation.

## Topic

Government Job vs Private Job - Reality Check

## Duration

50 seconds

## Script

### HOOK (0-5 sec)

"Every year, millions of people apply for government jobs. But do you know that in many exams, the selection rate is less than 1%?"

### BODY (5-40 sec)

"Imagine an exam where 1 million candidates apply for only 5,000 vacancies.

That means more than 99% of applicants won't get selected.

Government jobs offer great benefits:
Job security,
Retirement benefits,
And social respect.

But the competition is extremely intense.

On the other hand, the private sector offers a much larger number of opportunities.

With the right skills, experience, and continuous learning, your income and career growth can increase significantly.

That's why you should never rely on just one exam.

Keep improving your skills, communication, and practical knowledge.

Always have a backup plan."

### CTA (40-50 sec)

"Prepare for your dream government job.

But don't leave your future dependent on a single result.

What's your Plan B? Let me know in the comments."

## Timeline JSON

```json
{
  "videoDuration": 50,
  "template": "Video Explainer",
  "scenes": [
    {
      "start": 0,
      "end": 5,
      "type": "hook",
      "visual": "Massive crowd of government job aspirants",
      "headline": "1 MILLION APPLICANTS",
      "subheadline": "LESS THAN 1% SELECTED",
      "animation": "zoom_in"
    },
    {
      "start": 5,
      "end": 12,
      "type": "stat",
      "visual": "Students submitting applications online",
      "headline": "1,000,000 Candidates",
      "subheadline": "Competing for Limited Seats",
      "animation": "slide_up"
    },
    {
      "start": 12,
      "end": 18,
      "type": "comparison",
      "visual": "Government exam hall",
      "headline": "Only 5,000 Vacancies",
      "subheadline": "Selection Rate Under 1%",
      "animation": "count_up"
    },
    {
      "start": 18,
      "end": 24,
      "type": "benefits",
      "visual": "Government employees working in office",
      "headline": "Government Job Benefits",
      "bullets": [
        "Job Security",
        "Retirement Benefits",
        "Social Respect"
      ],
      "animation": "bullet_reveal"
    },
    {
      "start": 24,
      "end": 30,
      "type": "warning",
      "visual": "Large crowd waiting for exam results",
      "headline": "Extreme Competition",
      "subheadline": "Thousands Compete For Every Position",
      "animation": "warning_flash"
    },
    {
      "start": 30,
      "end": 36,
      "type": "opportunity",
      "visual": "Young professional in modern corporate office",
      "headline": "Private Sector Growth",
      "subheadline": "More Opportunities Available",
      "animation": "slide_right"
    },
    {
      "start": 36,
      "end": 40,
      "type": "advice",
      "visual": "Person learning skills on laptop",
      "headline": "Build Valuable Skills",
      "subheadline": "Skills + Experience = Growth",
      "animation": "highlight"
    },
    {
      "start": 40,
      "end": 46,
      "type": "conclusion",
      "visual": "Split screen: Government Job vs Skills",
      "headline": "Always Have A Plan B",
      "subheadline": "Never Depend On One Exam",
      "animation": "split_reveal"
    },
    {
      "start": 46,
      "end": 50,
      "type": "cta",
      "visual": "Comment section and question mark",
      "headline": "What's Your Plan B?",
      "subheadline": "Comment Below",
      "animation": "cta_pop"
    }
  ]
}
```

## Format Rules

- Keep transcript in clean spoken English with short paragraphs.
- Split output into Hook, Body, and CTA when possible.
- Timeline should include `videoDuration`, `template`, and `scenes`.
- Each scene should include timing, type, visual, headline, subheadline or bullets, and animation.
- Use compact on-screen text; avoid paragraph-style overlays.
- For Remotion, use scene `type` to pick card, stat, warning, comparison, benefits, and CTA layouts.
