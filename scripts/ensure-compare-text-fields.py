from pathlib import Path

p = Path("app/dashboard/page.tsx")
c = p.read_text(encoding="utf-8")

backup = Path("backup/dashboard-before-step5-compare-text-fields.txt")
backup.parent.mkdir(exist_ok=True)
backup.write_text(c, encoding="utf-8")

if "CompareTextFields" not in c:
    c = c.replace(
        "import {StickerStylePicker} from '@/components/compare/StickerStylePicker';",
        "import {StickerStylePicker} from '@/components/compare/StickerStylePicker';\nimport {CompareTextFields} from '@/components/compare/CompareTextFields';"
    )

if "<CompareTextFields" not in c:
    marker = "              {mode === \"compare\" ? (\n                <StickerStylePicker"
    insert = """              {mode === "compare" ? (
                <CompareTextFields
                  leftTitle={compareLeftTitle}
                  rightTitle={compareRightTitle}
                  handle={compareHandle}
                  onLeftTitleChange={setCompareLeftTitle}
                  onRightTitleChange={setCompareRightTitle}
                  onHandleChange={setCompareHandle}
                />
              ) : null}

"""
    if marker not in c:
        marker = "              {mode === \"compare\" ? (\r\n                <StickerStylePicker"
        insert = insert.replace("\n", "\r\n")

    if marker not in c:
        raise SystemExit("StickerStylePicker compare block not found. Need manual insertion.")

    c = c.replace(marker, insert + marker, 1)

p.write_text(c, encoding="utf-8")
print("CompareTextFields ensured.")
