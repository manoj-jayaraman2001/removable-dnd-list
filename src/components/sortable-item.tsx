import DragHandle from "../assets/drag-handle";
import CloseIcon from "../assets/close-icon";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../index.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function animateLayoutChanges(args: any) {
  const { isSorting, isDragging, wasDragging } = args;

  if (isSorting || isDragging || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
}

export function SortableItem({
  id,
  name,
  handleRemove,
}: {
  id: string;
  name: string;
  handleRemove?: (id: string) => void;
}) {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ animateLayoutChanges, id });

  const style = {
    opacity: isDragging ? 0.4 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div className="sortable-item" style={style} ref={setNodeRef}>
      <div
        style={{
          cursor: "grab",
        }}
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
      >
        <DragHandle />
      </div>
      <p>{name}</p>
      <div onClick={() => handleRemove && handleRemove(id)}>
        <CloseIcon />
      </div>
    </div>
  );
}
