import {
  ArrowTurnUpLeftIcon as UndoIcon,
  ArrowTurnUpRightIcon as RedoIcon,
} from "@/assets/icon";

interface Props {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function RestorationControls({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: Props) {
  return (
    <div className="flex w-85.75 justify-start">
      <div className="flex h-10 items-center gap-3 px-2">
        {/* Undo 버튼 */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex items-center justify-center"
        >
          <UndoIcon
            className={`ease-smooth-out h-3.5 w-3.5 transition-colors duration-[var(--duration-quick)] ${
              canUndo ? "text-neutral-300" : "text-neutral-700"
            }`}
          />
        </button>

        {/* Redo 버튼 */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="flex items-center justify-center"
        >
          <RedoIcon
            className={`ease-smooth-out h-3.5 w-3.5 transition-colors duration-[var(--duration-quick)] ${
              canRedo ? "text-neutral-300" : "text-neutral-700"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
