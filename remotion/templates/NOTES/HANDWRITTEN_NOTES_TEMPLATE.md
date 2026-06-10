# HANDWRITTEN_NOTES Pipeline

## Step 1: Upload

User audio/video upload karta hai.

Supported input:

* Audio with clear speech
* Video with clear speech

Output:

* Handwritten notes style reel
* Clean English + Hinglish visible notes

---

## Step 2: Transcription — Groq

Speech ko transcript me convert karo.

Required output:

* Full transcript
* Timestamp segments
* Word-level timing if available
* Audio duration
* Detected language
* Topic

Language rules:

* Hindi/Urdu source transcript ko original script me preserve karo for accuracy.
* Final visible notes clean English + Hinglish me honge.
* English audio ka final visible text English only hoga.

Bad romanization avoid:

* Wrong: `aarbeeai gred bee kee trening mumbee mein hotee hai`
* Correct: `RBI Grade B ki training Mumbai mein hoti hai`

### Transcription Quality Check

Agar ye issues aaye to pipeline continue mat karo; pehle repair transcription karo:

* repeated words bahut zyada
* wrong language detected
* word timestamps missing
* audio duration aur transcript length mismatch
* broken romanization
* important terms wrong, like RBI, PAN Card, Exam Date

---

## Step 3: Script Details — English Analysis

AI ko full transcript ka normal English source script dena hai.

Purpose:

* Topic samajhna
* Words count samajhna
* Important facts identify karna
* Exam/date/amount/document/process points pick karna
* Hand-drawn sketch / diagram need decide karna

Important:

* Ye step visible video text nahi banata.
* Hindi/Urdu transcript ka meaning English analysis me convert hota hai.
* Original facts, order, dates, names, and numbers preserve hone chahiye.
* New facts add nahi karne.
* Source speech English ho to analysis English hi rahega.

Output:

* `sourceScriptEnglish`
* `wordCount`
* `topic`
* `keyFacts`
* `timelineCandidates`
* `visualNeeds`

---

## Step 4: CreativeDirector — Note Action Plan

CreativeDirector reel ka visual plan banayega.

Important:

* Extra words add mat karo.
* Script se unnecessary words remove mat karo.
* Audio me jo point bola gaya hai, usi ka short note banao.
* Future points pehle show mat karo.

CreativeDirector decides:

* kitne note actions / scenes chahiye
* heading kaha chahiye
* bullet, sketch drawing, arrow, red circle, checkmark kaha chahiye
* SFX kaha chahiye
* background music needed hai ya nahi
* image/icon missing ho to empty mat chhodo; text/sketch drawing fallback use karo

For HANDWRITTEN_NOTES:

* Images optional hain.
* Hand-drawn sketches, arrows, circles, highlights, diagrams priority hain.
* One audio point = one note action.
* Agar ek sentence me 3 bullets hain to 3 separate timed note actions banao.

### Visual Style Rules

* Full 9:16 background must stay pure white: `#FFFFFF`.
* Do not add grey tint, off-white outer layer, notebook lines, ruled lines, grid, paper card effect, or heavy shadow.
* Add only a subtle professional inner writing border around the safe content area.
* Border example: `1.5px solid rgba(30, 58, 138, 0.10)` with `18px–28px` radius.
* Important text must stay inside the bordered writing area.
* Safe zones must remain white and empty of important text.

### Premium Ink Writing Rules

* Use premium student-note ink style, not harsh school red/blue.
* Main headings should use deep teal ink.
* Important dates, warnings, and money should use soft burgundy ink.
* Body/explanation text should use deep navy ink.
* Avoid small circle badges like `!`, `11`, or decorative icon+line.
* Use hand-drawn sketch objects when they clearly explain the current spoken point.
* Sketches should feel like a student drew a small image, not like app icons.
* Examples: RBI office sketch, exam paper sketch, admit card sheet sketch, calendar page sketch, payment slip sketch.
* Main heading ink: `#0F766E`.
* Body ink: `#1F3A5F`.
* Important ink: `#BE123C`.
* Heading font should prefer Handlee/Kalam style.
* Body font should prefer Kalam/Patrick Hand style.
* Yellow highlight should appear only for the main title, one important keyword, or one important date/number if needed.

---

## Step 5: Render Language Conversion

Final visible notes language decide karo.

Rules:

* Hindi/Urdu/Hinglish audio: Hybrid English + Hinglish.
* English audio: English only.
* Main keywords official English me rakho.
* Supporting explanation clean Hinglish me ho sakti hai.
* Standard names ko phonetic mat banao.

Good hybrid examples:

* `Exam Date` + `11 April ko exam hai`
* `Admit Card` + `5-8 din pehle expected`
* `Mock Tests` + `Daily practice zaroori hai`

Bad examples:

* `aarbeeai gred bee`
* `edmit kaard`
* `egzaam det`

---

## Step 6: ManagerChecklist + Validator

Render se pehle final quality check karo.

Checklist:

* Audio ke hisab se text aa raha hai?
* Future points pehle to nahi aa rahe?
* Text too fast to nahi aa raha?
* Ek point ke liye ek short note action hai?
* Screen empty ya overcrowded to nahi?
* Yellow highlight overuse to nahi?
* Text mobile pe readable hai?
* Sketch drawings meaningful hain ya decorative?
* No broken Hinglish
* No tiny partial text
* No cursor dot
* No full paragraph at once

Agar issue mile:

* Render mat karo.
* Timeline repair karo.
* Dobara validate karo.
* Phir render karo.

---

## Step 7: Remotion Render + Export

Final video render karo with:

* handwritten write-on animation
* clean white page
* premium teal/navy/burgundy ink text
* meaningful hand-drawn sketches
* audio-synced note actions
* previous notes visible until page changes
* same page until 75–85% fill
* new page only when required
* source voice clear
* background music low volume only
* no text before the matching spoken point

---

# Core Render Rules

## Audio Sync Rule

Only write the current spoken meaning.

If speaker one point bolta hai, sirf one short note action likho.

Do not:

* future points show karo
* fast extra text add karo
* random bullets add karo
* full paragraph ek sath dikhao

---

## Page Rule

* Full plain white canvas use karo.
* No grey paper.
* No notebook lines.
* No grid.
* Same page use karo until 75–85% occupancy.
* Previous notes visible rakho.
* New page only when current page full feel ho.

---

## Readability Rule

Mobile readability first.

Minimum sizes:

* Body text: 28px+
* Section heading: 3–6 words
* Body: max 8–10 words
* Dates/numbers bigger than body text

Use large note blocks across the page. Narrow center column avoid karo.

---

## Emphasis Rule

Yellow highlight overuse mat karo.

Use:

* Yellow highlight: main title or most important keyword only
* Red circle: dates/numbers
* Black underline: normal points
* Checkmark: action/practice points
* Arrow: next step/process
* Warning marker: urgent mistakes/deadlines only

---

## Sketch Drawing Rule

Sketch drawing sirf tab add karo jab current spoken point explain karta ho.

Use:

* calendar = exam date
* clock = countdown
* checkmark = mock tests/practice
* warning triangle = mistake/time waste
* arrow = next step
* document icon = admit card

Decorative icon + random line avoid karo.

---

## Visual Style Rule

Final look should be:

* full white background
* handwritten notes
* premium ink handwriting
* large readable text
* subtle professional border if needed
* few useful highlights
* meaningful hand-drawn sketches
* not empty
* not overcrowded
* not PowerPoint
* not typed text animation
