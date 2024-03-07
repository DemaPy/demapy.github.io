import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useTemplate } from "@/hooks/templates/useTemplate";
import ErrorPage from "@/ErrorPage";
import { useProjectsStyles } from "@/hooks/projectStyle/useProjectsStyles";
import { useQueryClient } from "react-query";
import { useTemplateUpdate } from "@/hooks/templates/useTemplateUpdate";
import { CreateForm } from "@/components/CreateForm";
import { useProjectStyleCreate } from "@/hooks/projectStyle/useProjectStyleCreate";
import { useProjectsStyleUpdate } from "@/hooks/projectStyle/useProjectStyleUpdate";
import { useToast } from "@/components/ui/use-toast";

const ProjectTemplatePreview = ({ project_id, template_id }) => {
  const ref = useRef(null);
  const { toast } = useToast();

  const client = useQueryClient();

  const [open, setIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState("");
  const [hydratedTemplate, setHydratedTemplate] = useState("");
  let isExist = false;
  let itemId;

  const {
    data: template,
    isError: IsTemplateError,
    isLoading: IsTemplateLoading,
  } = useTemplate(template_id);

  const {
    data: projectStyle,
    isLoading: isProjectStyleLoading,
    isError: isProjectStyleError,
  } = useProjectsStyles(`?project_id=${project_id}`);

  const {
    mutate: updateTemplate,
    isLoading: isTemplateUpdateLoading,
    isError: isTemplateUpdateError,
  } = useTemplateUpdate(template_id);

  const {
    mutate: createProjectStyle,
    isLoading: isProjectStyleCreateLoading,
    isError: isProjectStyleCreateError,
  } = useProjectStyleCreate();

  const {
    mutate: updateProjectStyle,
    isLoading: isProjectStyleUpdateLoading,
    isError: isProjectStyleUpdateError,
  } = useProjectsStyleUpdate(itemId);

  useEffect(() => {
    if (!ref.current) return;

    function handleNodeSelect(ev) {
      ev.preventDefault();
      if (ref.current === ev.target) return;
      setIsOpen(true);

      const isId = ev.target.getAttribute("data-style-id");
      if (isId) {
        setSelectedNode({
          node: ev.target,
          id: isId,
        });
      } else {
        let id = uuidv4();
        ev.target.setAttribute("data-style-id", id);
        setSelectedNode({
          node: ev.target,
          id: id,
        });
      }
    }

    function handleNodeHighlight(ev) {
      if (ref.current === ev.target) return;
      ev.preventDefault();
      const node = ev.target;
      node.classList.add("hovered_node");
    }

    function handleNodeUnHighlight(ev) {
      ev.preventDefault();
      const node = ev.target;
      node.classList.remove("hovered_node");
    }

    ref.current.addEventListener("click", handleNodeSelect);
    ref.current.addEventListener("mouseover", handleNodeHighlight);
    ref.current.addEventListener("mouseout", handleNodeUnHighlight);

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("click", handleNodeSelect);
        ref.current.removeEventListener("mouseover", handleNodeHighlight);
        ref.current.removeEventListener("mouseout", handleNodeUnHighlight);
      }
    };
  }, [IsTemplateLoading, projectStyle, template]);

  useEffect(() => {
    const document = new DOMParser().parseFromString(
      template?.template_html,
      "text/html"
    );
    const nodes_to_update = document.querySelectorAll("[data-style-id]");

    if (nodes_to_update) {
      for (const node of nodes_to_update) {
        for (const item of projectStyle ?? []) {
          if (item.id === node.getAttribute("data-style-id")) {
            Object.assign(node.style, item.style);
          }
        }
      }
    }

    setHydratedTemplate(document.documentElement.outerHTML);
  }, [projectStyle, template]);

  const clear_body_from_style = (body, style) => {
    const nodes_to_clear = body.querySelectorAll("[data-style-id]");
    if (nodes_to_clear) {
      const nodes = Array.from(nodes_to_clear);
      for (const node of nodes) {
        for (const key in node.style) {
          if (typeof key === "string") {
            if (key in style) {
              node.style[key] = "";
            }
          }
        }
      }
    }
    return body;
  };

  let new_node = {};
  const handleStyle = (style) => {
    new_node = {
      id: selectedNode.id,
      project_id: project_id,
      style: style,
      node_id: uuidv4(),
    };

    const updated_body = new DOMParser().parseFromString(
      ref.current.innerHTML,
      "text/html"
    ).body;
    const cleared_body = clear_body_from_style(updated_body, style);
    handleProjectStyle(new_node, () => {
      Object.assign(selectedNode.node.style, style);
      handleUpdateTemplate(cleared_body.innerHTML);
    });
  };

  const handleUpdateTemplate = async (body_with_data_attribute) => {
    const old_document = new DOMParser().parseFromString(
      template.template_html,
      "text/html"
    );
    old_document.body.innerHTML = body_with_data_attribute;
    const updated_template = {
      template_html: old_document.documentElement.outerHTML,
    };
    // TODO: Why i need to clear template from style.
    updateTemplate(updated_template, {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed to update project style",
          description: "Something went wrong",
        });
      },
      onSettled: () => {
        client.invalidateQueries(`project-styles-?project_id=${project_id}`);
      },
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Template style successfully updated",
        });
      },
    });
  };

  if (Object.keys(new_node).lenght) {
    for (const item of projectStyle ?? []) {
      if (item.id === new_node.id) {
        isExist = true;
        itemId = item.id;
      }
    }
  }

  const handleProjectStyle = async (new_node, cb) => {
    if (isExist) {
      updateProjectStyle(
        { ...new_node },
        {
          onError: () => {
            toast({
              variant: "destructive",
              title: "Failed to update project style",
              description: "Something went wrong",
            });
          },
          onSettled: () => {
            client.invalidateQueries(
              `project-styles-?project_id=${project_id}`
            );
            setIsOpen(false);
          },
          onSuccess: () => {
            cb();
            toast({
              variant: "success",
              title: "Success",
              description: "Project style successfully updated",
            });
          },
        }
      );
    } else {
      createProjectStyle(new_node, {
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to create project style",
            description: "Something went wrong",
          });
        },
        onSettled: () => {
          client.invalidateQueries(`project-styles?project_id=${project_id}`);
          setIsOpen(false);
        },
        onSuccess: () => {
          toast({
            variant: "success",
            title: "Success",
            description: "Project style successfully created",
          });
        },
      });
    }
  };

  if (IsTemplateLoading || isProjectStyleLoading) {
    return <SkeletonCard />;
  }

  if (isProjectStyleError || IsTemplateError) {
    return (
      <ErrorPage
        title={`Something went wrong while project style loading...`}
      />
    );
  }

  return (
    <>
      <div className="w-full xl:h-screen h-[600px] overflow-y-auto relative">
        <div
          ref={ref}
          dangerouslySetInnerHTML={{
            __html: hydratedTemplate,
          }}
          className="w-full rounded-md block p-8 bg-neutral-600"
        />
      </div>
      <CreateForm
        fields={[
          {
            id: 1,
            name: "section_name",
            label: "Section name",
            placeholder: "name",
          },
          {
            id: 2,
            name: "backgroundColor",
            label: "Background color",
            placeholder: "hex color: #ffffff",
          },
          {
            id: 3,
            name: "color",
            label: "Font color",
            placeholder: "hex color: #ffffff",
          },
        ]}
        title={"Create project style"}
        description={
          "Enter style section name background color and text color."
        }
        onSubmit={handleStyle}
        isOpen={open}
        setIsOpen={setIsOpen}
        isLoading={
          isTemplateUpdateLoading ||
          isProjectStyleCreateLoading ||
          isProjectStyleUpdateLoading
        }
      />
    </>
  );
};

export default ProjectTemplatePreview;
