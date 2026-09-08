from pathlib import Path
import re

p = Path("remotion/templates/COMPARE_EXPLAINER/template.tsx")
c = p.read_text(encoding="utf-8")

backup = Path("backup/compare-template-before-sticky-left-right-pose.txt")
backup.parent.mkdir(exist_ok=True)
backup.write_text(c, encoding="utf-8")

# 1) Add helper function before StickerPresenter
if "const getStickyPresenterPose =" not in c:
    helper = r'''
const getStickyPresenterPose = ({
  overlay,
  caption,
  leftTitle,
  rightTitle,
}: {
  overlay?: CompareOverlay;
  caption?: CompareCaption;
  leftTitle: string;
  rightTitle: string;
}) => {
  const text = [
    overlay?.text,
    overlay?.body,
    overlay?.title,
    caption?.text,
    caption?.lines?.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const left = leftTitle.toLowerCase();
  const right = rightTitle.toLowerCase();

  const leftWords = [
    left,
    'left',
    'before',
    'old',
    'pehle',
    'domain',
    'website',
    'problem',
    'without',
  ].filter(Boolean);

  const rightWords = [
    right,
    'right',
    'after',
    'new',
    'baad',
    'hosting',
    'server',
    'solution',
    'with',
  ].filter(Boolean);

  if (leftWords.some((word) => word && text.includes(word))) return 'left';
  if (rightWords.some((word) => word && text.includes(word))) return 'right';

  return 'welcome';
};

'''
    c = c.replace("const StickerPresenter = ({", helper + "const StickerPresenter = ({", 1)

# 2) Update StickerPresenter props destructuring and type
c = c.replace(
"""const StickerPresenter = ({
  overlay,
  overlayIndex,
  stickerStyle,
}: {
  overlay?: CompareOverlay;
  overlayIndex: number;
  stickerStyle?: string;
}) => {""",
"""const StickerPresenter = ({
  overlay,
  caption,
  leftTitle,
  rightTitle,
  stickerStyle,
}: {
  overlay?: CompareOverlay;
  caption?: CompareCaption;
  leftTitle: string;
  rightTitle: string;
  stickerStyle?: string;
}) => {"""
)

# 3) Replace pose logic inside StickerPresenter
patterns = [
    r"const poseKey\s*=\s*[^;]+;",
    r"const pose\s*=\s*[^;]+;",
]

# Replace common old pose block if present
c = re.sub(
    r"const poseKey[\s\S]*?const src = set\[poseKey\] \|\| set\.welcome;",
    """const poseKey = getStickyPresenterPose({overlay, caption, leftTitle, rightTitle});
  const src = set[poseKey] || set.welcome;""",
    c,
    count=1,
)

# If above did not match, patch line-based after set selection
if "getStickyPresenterPose({overlay, caption, leftTitle, rightTitle})" not in c:
    c = c.replace(
        "const src = set.welcome;",
        "const poseKey = getStickyPresenterPose({overlay, caption, leftTitle, rightTitle});\n  const src = set[poseKey] || set.welcome;",
        1,
    )

# Remove overlayIndex references inside StickerPresenter if still there in pose line
c = c.replace("overlayIndex,", "")

# 4) Update StickerPresenter call
c = c.replace(
"""      <StickerPresenter
        overlay={activeOverlay}
        overlayIndex={activeOverlayIndex}
        stickerStyle={props.stickerStyle}
      />""",
"""      <StickerPresenter
        overlay={activeOverlay}
        caption={activeCaption}
        leftTitle={leftTitle}
        rightTitle={rightTitle}
        stickerStyle={props.stickerStyle}
      />"""
)

p.write_text(c, encoding="utf-8")
print("Sticky left/right presenter pose patch applied.")
