# Hinglish Video Reference

Use this as the canonical structure for English + Roman Hinglish reel transcription, script planning, and Remotion timeline generation.

## Topic

Government Job vs Private Job - Reality Check

## Duration

50 seconds

## Script

### HOOK (0-5 sec)

"Har saal lakhon log government job ke liye apply karte hain... lekin kya aap jaante ho, selection ratio kabhi-kabhi 1% se bhi kam hota hai?"

### BODY (5-40 sec)

"Maan lo kisi exam mein 10 lakh candidates apply karte hain aur vacancies sirf 5,000 hain.

Iska matlab 99% log select nahi honge.

Government job ke apne benefits hain:
Job security,
Pension ya retirement benefits,
Aur social status.

Lekin competition bhi bahut zyada hota hai.

Dusri taraf private sector mein opportunities zyada hoti hain.
Skills develop karte hue salary bhi grow kar sakti hai.

Isliye sirf exam ka wait mat karo.
Apni skills, communication aur practical knowledge par bhi kaam karo.

Ek backup plan hamesha ready rakho."

### CTA (40-50 sec)

"Government job ki preparation karo...
Lekin apna future sirf ek exam ke bharose mat chhodo.

Aapka Plan B kya hai?
Comments mein zaroor batao."

## Timeline JSON

```json
[
  {
    "start": 0,
    "end": 5,
    "scene": "Massive crowd of aspirants outside exam center",
    "text": "10 LAKH APPLY\n1% SELECTION?",
    "animation": "zoom_in"
  },
  {
    "start": 5,
    "end": 12,
    "scene": "Students filling forms online",
    "text": "10 Lakh Candidates",
    "animation": "slide_up"
  },
  {
    "start": 12,
    "end": 18,
    "scene": "Government exam hall",
    "text": "Only 5,000 Vacancies",
    "animation": "countdown"
  },
  {
    "start": 18,
    "end": 24,
    "scene": "Government office employees working",
    "text": "Job Security\nBenefits\nStatus",
    "animation": "bullet_reveal"
  },
  {
    "start": 24,
    "end": 30,
    "scene": "Large crowd waiting for results",
    "text": "Competition Extremely High",
    "animation": "shake_emphasis"
  },
  {
    "start": 30,
    "end": 36,
    "scene": "Young professional in corporate office",
    "text": "Private Sector Opportunities",
    "animation": "slide_right"
  },
  {
    "start": 36,
    "end": 40,
    "scene": "Person learning skills on laptop",
    "text": "Build Skills + Experience",
    "animation": "highlight_words"
  },
  {
    "start": 40,
    "end": 46,
    "scene": "Split screen Government Job vs Skills",
    "text": "Always Keep A Plan B",
    "animation": "comparison"
  },
  {
    "start": 46,
    "end": 50,
    "scene": "Question mark and comment icon",
    "text": "What's Your Plan B?",
    "animation": "cta_pop"
  }
]
```

## Format Rules

- Keep transcript in natural English + Roman Hinglish.
- Preserve Indian terms such as `lakh`, `government job`, `private sector`, `vacancies`, and `Plan B`.
- Split output into Hook, Body, and CTA when possible.
- Timeline should use short scene descriptions, compact on-screen text, and one animation cue per shot.
- Avoid duplicate paragraph-style typography in the video output; subtitles and timeline text should have separate roles.
