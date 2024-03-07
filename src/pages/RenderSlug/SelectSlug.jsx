import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useDataTables } from "@/hooks/dataTables/useDataTables";
import ErrorPage from "@/ErrorPage";
import ToolbarSkeleton from "./ToolbarSkeleton";

const SelectSlug = ({ selectedSlug, setSelectedSlug, project_id }) => {
  const {
    data: tables_slugs,
    isLoading: isSlugsLoading,
    isError: isSlugsError,
  } = useDataTables(`?project_id=${project_id}`);

  if (isSlugsLoading) {
    return <ToolbarSkeleton />;
  }

  if (isSlugsError) {
    return (
      <ErrorPage
        title={`Something went wrong while fetching data. Try reload page.`}
      />
    );
  }

  let slugs = Array.from(new Set(tables_slugs?.map((item) => item.slug)));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="capitalize text-sm text-slate-900">
          {selectedSlug}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {slugs.map((item, i) => (
          <DropdownMenuItem
            className={`${
              selectedSlug === item
                ? "capitalize font-semibold text-slate-800 cursor-pointer hover:bg-slate-300 hover:text-slate-900 hover:font-semibold"
                : "text-neutral-400 capitalize cursor-pointer hover:bg-slate-300 hover:text-slate-900 hover:font-semibold"
            }`}
            onClick={() => setSelectedSlug(item)}
            key={i}>
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelectSlug;
