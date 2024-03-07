import { Edit2Icon, Loader, TrashIcon } from "lucide-react";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateForm } from "@/components/CreateForm";
import CardActions from "@/components/CardActions";
import { useProjectStyleDelete } from "@/hooks/projectStyle/useProjectStyleDelete";
import { useProjectsStyleUpdate } from "@/hooks/projectStyle/useProjectStyleUpdate";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "react-query";

const ProjectStyleCart = ({ item, project_id }) => {
  const client = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: deleteProjectStyle, isLoading: isDeleteProjectStyleLoading } =
    useProjectStyleDelete();
  const { mutate: updateProjectStyle, isLoading: isUpdateProjectStyleLoading } =
    useProjectsStyleUpdate(item);

  const style = item.style;
  const style_data = Object.entries(style);

  const handleStyleDelete = async () => {
    deleteProjectStyle(item.id, {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed to delete project style",
          description: "Something went wrong",
        });
      },
      onSettled: () => {
        client.invalidateQueries(`?project_id=${project_id}`);
      },
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Project style successfully deleted",
        });
      },
    });
  };

  const handleStylEdit = async () => {
    const new_item = {
      style: {
        ...item.style,
        ...data,
      },
    };
    updateProjectStyle(new_item, {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed to update project style",
          description: "Something went wrong",
        });
      },
      onSettled: () => {
        client.invalidateQueries(`?project_id=${project_id}`);
      },
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Project style successfully updated",
        });
      },
    });
  };

  return (
    <Card className="md:max-w-[320px] w-full bg-neutral-900 hover:shadow-lg hover:bg-neutral-700 transition-all border-none">
      <CardHeader>
        <CardTitle className="text-white hover:underline leading-snug">
          {style.section_name}
        </CardTitle>
      </CardHeader>
      {style_data.map(([key, value]) => {
        if (value.length > 0 && key !== "name") {
          return (
            <CardContent key={key}>
              <div className="flex justify-between items-center text-white">
                <p className="capitalize">
                  {key === "backgroundColor"
                    ? "Background Color"
                    : key === "color"
                    ? "Text color"
                    : ""}
                </p>
                <p className="flex gap-2 items-center">
                  <span
                    className="rounded-full w-4 h-4 inline-block"
                    style={{ backgroundColor: value }}></span>
                  {value}
                </p>
              </div>
            </CardContent>
          );
        }
      })}
      <CardFooter className="flex gap-2">
        <CardActions
          actions={[
            {
              id: 1,
              name: "Delete",
              icon: (
                <>
                  {isDeleteProjectStyleLoading ? (
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <TrashIcon className="h-4 w-4 mr-2" />
                  )}
                </>
              ),
              onClick: handleStyleDelete,
            },
            {
              id: 2,
              name: "Edit",
              icon: <Edit2Icon className="h-4 w-4 mr-2" />,
              onClick: () => setIsOpen(true),
            },
          ]}
        />
      </CardFooter>
      <CreateForm
        isLoading={isUpdateProjectStyleLoading}
        fields={style_data.map(([key, value], i) => {
          return {
            id: i,
            key: key,
            value: value,
            label:
              key === "backgroundColor"
                ? "Background Color"
                : key === "color"
                ? "Text color"
                : key === "name"
                ? "Section name"
                : "Field",
            name: key,
            placeholder: key,
          };
        })}
        title={"Edit project style"}
        description={"Manage project style. Click done when you are ready"}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={handleStylEdit}
      />
    </Card>
  );
};

export default ProjectStyleCart;
