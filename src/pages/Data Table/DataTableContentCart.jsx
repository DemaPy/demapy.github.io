import CardActions from "@/components/CardActions";
import { CreateForm } from "@/components/CreateForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useDataTableDelete } from "@/hooks/dataTables/useDataTableDelete";
import { useDataTableUpdate } from "@/hooks/dataTables/useDataTableUpdate";
import { getActions } from "@/lib/actions";
import { useState } from "react";
import { useQueryClient } from "react-query";

const DataTableContentCart = ({ columns, item, invalidateQuery }) => {
  const { toast } = useToast();
  const client = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    mutate: updateDataTable,
    isLoading: isDataTableUpdateLoading,
    isError: isDataTableUpdateError,
  } = useDataTableUpdate(item?.id);

  const { mutate: onDelete, isLoading: onDeleteLoading } = useDataTableDelete();

  const handleUpdate = async (data) => {
    const updated_slug = {
      slug: data.slug,
      data: data,
    };
    updateDataTable(updated_slug, {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed to update data item",
          description: "Something went wrong",
        });
      },
      onSettled: () => {
        setIsModalOpen(false);
        client.invalidateQueries("data-tables");
      },
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Data item successfully updated",
        });
      },
    });
  };

  const handleDataTableDelete = async (id) => {
    onDelete(id, {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Failed to delete component",
        });
      },
      onSettled: () => {
        client.invalidateQueries(`data_tables-${invalidateQuery}`);
      },
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Component successfully deleted",
        });
      },
    });
  };

  const actions = getActions("data_table_cart", {
    isEdit: isDataTableUpdateLoading,
    isDelete: onDeleteLoading,
    setIsModalOpen: setIsModalOpen,
    handleDataTableDelete: handleDataTableDelete,
  });
  return (
    <>
      <Card className="md:max-w-[320px] w-full bg-neutral-900 hover:shadow-lg hover:bg-neutral-700 transition-all border-none">
        <CardHeader>
          <CardTitle className="text-white capitalize">
            {item.data.slug}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs">
            <span className="text-neutral-300">created at: </span>
            <span className="text-white font-semibold">
              {new Date(item.createdat).toDateString()}
            </span>
          </p>
        </CardContent>
        <CardFooter>
          <CardActions actions={actions} />
        </CardFooter>
      </Card>
      <CreateForm
        isLoading={isDataTableUpdateLoading}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        fields={Object.entries(item.data).map(([key, value], i) => {
          let type;
          if (columns.find((column) => column.header === key)) {
            type = "url";
          }
          if (key === "slug") {
            type = "text";
          }

          return {
            id: i,
            name: key,
            label: key,
            type,
            value: value,
            placeholder: "enter " + key,
          };
        })}
        onSubmit={(data) => handleUpdate(data)}
        description={"Enter values, click done when you are ready."}
        title={item.data.slug + " content"}
      />
    </>
  );
};

export default DataTableContentCart;
