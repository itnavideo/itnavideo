"use client";

type CompareTextFieldsProps = {
  leftTitle: string;
  rightTitle: string;
  handle: string;
  onLeftTitleChange: (value: string) => void;
  onRightTitleChange: (value: string) => void;
  onHandleChange: (value: string) => void;
};

export function CompareTextFields({
  leftTitle,
  rightTitle,
  handle,
  onLeftTitleChange,
  onRightTitleChange,
  onHandleChange,
}: CompareTextFieldsProps) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--bg-raised)', border: '0.5px solid var(--border-dark)', borderRadius: '12px' }}>
      <div className="mb-5">
        <p className="form-label-muted">Compare text</p>
        <p className="mt-1 text-[11px]" style={{ color: 'var(--text-dark-muted)' }}>
          These labels will appear inside the final comparison reel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="form-label-muted mb-2 block">Left compare text</span>
          <input
            className="form-input"
            maxLength={40}
            onChange={(event) => onLeftTitleChange(event.target.value)}
            placeholder="Example: Before"
            value={leftTitle}
          />
          <span className="mt-1 block text-right" style={{ fontSize: '11px', color: leftTitle.length >= 38 ? 'var(--color-error)' : leftTitle.length >= 32 ? 'var(--color-amber)' : 'var(--text-dark-muted)' }}>
            {leftTitle.length}/40
          </span>
        </label>

        <label className="block">
          <span className="form-label-muted mb-2 block">Right compare text</span>
          <input
            className="form-input"
            maxLength={40}
            onChange={(event) => onRightTitleChange(event.target.value)}
            placeholder="Example: After"
            value={rightTitle}
          />
          <span className="mt-1 block text-right" style={{ fontSize: '11px', color: rightTitle.length >= 38 ? 'var(--color-error)' : rightTitle.length >= 32 ? 'var(--color-amber)' : 'var(--text-dark-muted)' }}>
            {rightTitle.length}/40
          </span>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="form-label-muted mb-2 block">Top handle</span>
        <input
          className="form-input"
          maxLength={30}
          onChange={(event) => onHandleChange(event.target.value)}
          placeholder="@itnavideo"
          value={handle}
        />
        <div className="mt-1 flex items-center justify-between">
          <p style={{ fontSize: '11px', color: 'var(--text-dark-muted)' }}>Appears at the top of the reel.</p>
          <span style={{ fontSize: '11px', color: handle.length >= 28 ? 'var(--color-error)' : handle.length >= 24 ? 'var(--color-amber)' : 'var(--text-dark-muted)' }}>
            {handle.length}/30
          </span>
        </div>
      </label>
    </div>
  );
}
