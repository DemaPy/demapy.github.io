import Title from "@/components/Title";
import type { Identifier, XYCoord } from "dnd-core";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { useRef, useState } from "react";
import { Switchh } from "@/components/Switch";
import { Button } from "@/components/ui/button";
import SectionSlugs from "./SectionSlugs";
import { CampaignService } from "@/services/DI/Campaign";
import { useCampaignUpdateModal } from "@/store/campaignUpdateModal";
import { useDrag, useDrop } from "react-dnd";

type Props = {
  index: number;
  section: Section;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  id: Layout["id"];
  is_active: Layout["is_active"];
  order: Layout["order"];
  renderOn: Layout["renderOn"];
  sectionId: Layout["sectionId"];
  isLayoutChanged: boolean;
};

interface DragItem {
  index: number;
  id: string;
  type: "LAYOUT";
}

const SectionLayout = ({
  isLayoutChanged,
  section,
  moveCard,
  id,
  index,
  is_active,
  renderOn,
}: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const setCampaign = useCampaignUpdateModal((state) => state.setCampaign);

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "LAYOUT",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number; id: string }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [_,drag] = useDrag({
    type: "LAYOUT",
    item: () => {
      return { id: id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  const handleLayoutIsActive = async () => {
    setIsLoading(true);
    const response = await CampaignService.updateLayout({
      id: id,
      is_active: !is_active,
    });
    if (response.status === "error") {
      alert(response.message);
      setIsLoading(false);
      return;
    } else {
      setIsLoading(false);
      setCampaign(response.data);
    }
  };

  const handleSlugRenderConditionChange = async (slug: {
    [key: string]: boolean;
  }) => {
    const response = await CampaignService.updateLayout({
      id: id,
      renderOn: {
        ...renderOn,
        ...slug,
      },
    });
    if (response.status === "error") {
      alert(response.message);
      setIsLoading(false);
      return;
    } else {
      setIsLoading(false);
      setCampaign(response.data);
    }
  };

  return (
    <>
      <div
        ref={ref}
        data-handler-id={handlerId}
        className={`flex items-center gap-2 w-full`}
      >
        {renderOn && (
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size={"sm"}
            variant={"outline"}
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        )}
        <div
          className={`flex justify-start items-center gap-2 p-2 border rounded-md bg-slate-50 flex-grow`}
        >
          <GripVertical className={"w-4 h-4"} />
          <Title size="xs" title={section.title} />
        </div>
        <Switchh
          isDisabled={isLoading || isLayoutChanged}
          text={is_active ? "On" : "Off"}
          isActive={is_active}
          onChange={() => handleLayoutIsActive()}
        />
      </div>
      {isOpen && renderOn && (
        <SectionSlugs
          isLoading={isLoading}
          onChange={handleSlugRenderConditionChange}
          slugs={renderOn}
        />
      )}
    </>
  );
};

export default SectionLayout;
