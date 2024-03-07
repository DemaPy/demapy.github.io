import { Copy, Edit, Loader, Trash } from "lucide-react";
import CardActions from "../../components/CardActions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { CreateForm } from "@/components/CreateForm";
import { useState } from "react";
import { useColumnDelete } from "@/hooks/columns/useColumnDelete";
import { useColumnCreate } from "@/hooks/columns/useColumnCreate";
import { useColumnUpdate } from "@/hooks/columns/useColumnUpdate";
import { useQueryClient } from "react-query";
import { useToast } from "@/components/ui/use-toast";

const ColumnCart = ({ item }) => {
  const { toast } = useToast();
  const client = useQueryClient();
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const {
    mutate: deleteColumn,
    isLoading: isColumnDeleteLoading,
    isError: isColumnDeleteError,
  } = useColumnDelete();
  const {
    mutate: createColumn,
    isLoading: isColumnCreateLoading,
    isError: isColumnCreateError,
  } = useColumnCreate();
  const {
    mutate: updateColumn,
    isLoading: isColumnUpdateLoading,
    isError: isColumnUpdateError,
  } = useColumnUpdate(item?.id);

  const handleDeleteColumn = async () => {
    deleteColumn(item.id, {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed to delete column",
          description: "Something went wrong",
        });
      },
      onSettled: () => {
        client.invalidateQueries(`columns-?table_id=${item.table_id}`);
      },
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Column successfully deleted",
        });
      },
    });
  };

  const handleDuplicate = async () => {
    let name = item.header;
    const number = name.match(/\d+/g);
    let getHeaderCount;
    let new_name;
    if (number) {
      getHeaderCount = Number(number[0].trim());
      name = name.replace(` ${getHeaderCount}`, "");
      getHeaderCount = getHeaderCount + 1;
      new_name = name + " " + getHeaderCount;
    }

    const new_column = {
      ...item,
      header: new_name ?? name + " Copy",
      id: uuidv4(),
      table_id: item.table_id,
      type: "text",
    };

    createColumn(new_column, {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed to create column",
          description: "Something went wrong",
        });
      },
      onSettled: () => {
        client.invalidateQueries(`columns-?table_id=${item.table_id}`);
      },
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Column successfully created",
        });
      },
    });
  };

  const handleRenameColumn = async ({ header }) => {
    if (header.length < 3) return;
    const new_column = {
      header: header,
    };

    updateColumn(new_column, {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed to update column",
          description: "Something went wrong",
        });
      },
      onSettled: () => {
        client.invalidateQueries("columns");
        client.invalidateQueries(`columns-?table_id=${item.table_id}`);
        setIsColumnModalOpen(false);
      },
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Column name successfully updated",
        });
      },
    });
  };

  return (
    <>
      <Card className="md:max-w-[320px] w-full bg-neutral-900 hover:shadow-lg hover:bg-neutral-700 transition-all border-none">
        <CardHeader>
          <CardTitle className="text-white capitalize">{item.header}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs">
            <span className="text-neutral-300">created at: </span>
            <span className="text-white font-semibold">
              {new Date(item.createdat).toDateString()}
            </span>
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <CardActions
            actions={[
              {
                id: 1,
                name: "Duplicate",
                disabled: isColumnCreateLoading || item.type === "slug",
                icon: (
                  <>
                    {isColumnCreateLoading ? (
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                  </>
                ),
                onClick: () => handleDuplicate(),
              },
              {
                id: 2,
                name: "Delete",
                disabled: isColumnDeleteLoading || item.type === "slug",
                icon: (
                  <>
                    {isColumnDeleteLoading ? (
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Trash className="w-4 h-4 mr-2" />
                    )}
                  </>
                ),
                onClick: () => handleDeleteColumn(),
              },
              {
                id: 3,
                name: "Edit",
                disabled: item.type === "slug",
                icon: <Edit className="w-4 h-4 mr-2" />,
                onClick: () => setIsColumnModalOpen(true),
              },
            ]}
          />
        </CardFooter>
      </Card>
      <CreateForm
        isLoading={isColumnUpdateLoading}
        isOpen={isColumnModalOpen}
        setIsOpen={setIsColumnModalOpen}
        fields={[
          {
            id: 1,
            name: "header",
            label: "Column name",
            value: item.header,
            placeholder: "name",
          },
        ]}
        onSubmit={handleRenameColumn}
        title={"Manage column"}
        description={"Change column name"}
      />
    </>
  );
};

export default ColumnCart;
