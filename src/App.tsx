/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from "react";
import { sampleData } from "./data";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { Active } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./components/sortable-item";
import SortableOverlay from "./components/sortable-overlay";
import "./index.css";

function App() {
  const [data, setData] = useState(sampleData);

  const [active, setActive] = useState<Active | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  const activeItem = useMemo(
    () => data.find((item) => item.id === active?.id),
    [active, data]
  );

  const itemIds = useMemo(() => data.map((item) => item.id), [data]);

  const handleRemove = (id: string) => {
    setData((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };

  return (
    <div className="center">
      <h2>Simple removable and sortable list using dnd kit</h2>

      <div className="container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          measuring={measuringConfig}
          onDragStart={({ active }) => {
            setActive(active);
          }}
          onDragEnd={({ active, over }) => {
            if (over && active.id !== over?.id) {
              const activeIndex = data.findIndex(({ id }) => id === active.id);
              const overIndex = data.findIndex(({ id }) => id === over.id);

              setData(arrayMove(data, activeIndex, overIndex));
            }
            setActive(null);
          }}
          onDragCancel={() => {
            setActive(null);
          }}
        >
          <SortableContext
            items={itemIds}
            strategy={verticalListSortingStrategy}
          >
            {data.map((item) => {
              return (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  handleRemove={handleRemove}
                />
              );
            })}
          </SortableContext>
          <SortableOverlay>
            {activeItem ? (
              <SortableItem id={activeItem.id} name={activeItem.name} />
            ) : null}
          </SortableOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default App;
