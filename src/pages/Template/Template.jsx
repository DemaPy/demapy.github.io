import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Heading } from "@/components";
import { PageContainer } from "..";
import { useToast } from "@/components/ui/use-toast";
import TemplatePreview from "../../components/TemplatePreview";
import ErrorPage from "@/ErrorPage";
import { useTemplate } from "@/hooks/templates/useTemplate";
import { useTemplateUpdate } from "@/hooks/templates/useTemplateUpdate";
import { useQueryClient } from "react-query";
import NotFound from "@/NotFound";
import RenderTableList from "@/components/RenderTableList";
import RenderProjectList from "@/components/RenderProjectList";
import TemplateCardLoading from "./TemplateCardLoading";
import { CreateForm } from "@/components/CreateForm";
import { SelectColumn } from "../Projects/ProjectsModal/SelectColumn";

const Template = () => {
  const ref = useRef();
  const refHTML = useRef(null);
  const { id } = useParams();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState("");

  const client = useQueryClient();

  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    isLoading: templateIsLoading,
    data: template,
    isError: templateError,
  } = useTemplate(id);

  const {
    mutate: updateTemplate,
    isLoading: isTemplateUpdateLoading,
    isError: isTemplateUpdateError,
  } = useTemplateUpdate(template?.id);

  const mutateTemplate = (new_template) => {
    updateTemplate(new_template, {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed to update template",
          description: "Something went wrong",
        });
      },
      onSettled: () => {
        client.invalidateQueries(`template-${template.id}`);
      },
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Template successfully updated",
        });
      },
    });
  };

  const handleChangeTemplateName = async (template) => {
    if (name.trim().length < 3) {
      toast({
        variant: "destructive",
        title: "Failed to update template",
        description: "Template name should have at least 3 symbols",
      });
    }
    mutateTemplate({
      template_name: name,
    });
  };

  if (templateIsLoading) {
    return <TemplateCardLoading />;
  }

  if (templateError) {
    return (
      <ErrorPage title={`Something went wrong while template loading...`} />
    );
  }

  if (!template) {
    return (
      <NotFound
        title={"Template you are trying to access not found."}
        action={{ to: "/templates", title: "Go to templates" }}
      />
    );
  }

  return (
    <PageContainer>
      <div className="flex lg:gap-12 gap-4 xl:flex-row flex-col">
        <TemplatePreview
          refHTML={refHTML}
          setSelectedNode={setSelectedNode}
          setIsModalOpen={setIsModalOpen}
          isLoading={isTemplateUpdateLoading}
          onUpdate={({ html }) => mutateTemplate({ template_html: html })}
          template_id={template.id}
          html={template.template_html ?? ""}
        />
        <div className="flex gap-4 flex-col w-full items-start">
          <Heading
            title={
              isOpen ? (
                <input
                  ref={ref}
                  onBlur={() => {
                    if (
                      template.template_name.toLowerCase() ===
                      name.toLowerCase()
                    ) {
                      setIsOpen(false);
                      return;
                    }
                    handleChangeTemplateName(template);
                  }}
                  onChange={(ev) => setName(ev.target.value)}
                  value={name}
                  className="text-4xl border-none w-full bg-transparent outline-none focus:border-none p-0"
                />
              ) : (
                <p
                  onClick={() => {
                    setIsOpen(true);
                    setName(template?.template_name);
                  }}
                >
                  {template?.template_name}
                </p>
              )
            }
            paragraph={
              template?.createdat && (
                <>created at: {new Date(template.createdat).toDateString()}</>
              )
            }
          />
          <RenderProjectList
            template_id={template.id}
            view={"list"}
            query={`?template_id=${template.id}&isarchived=0`}
          />
          <RenderTableList
            isCreate={true}
            query={`?template_id=${template.id}`}
          />
        </div>
      </div>
      <CreateForm
        isLoading={false}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        fields={[
          {
            id: 1,
            name: "column_id",
            label: "Column",
            content: (form) => (
              <SelectColumn
                selectedNode={selectedNode}
                query={`?template_id=${template.id}`}
                onSelect={(column) => form.setValue("column_id", column)}
                value={form.getValues("column_id")}
              />
            ),
          },
        ]}
        onSubmit={({ column_id }) => {
          selectedNode.setAttribute("data-column-id", column_id);
          mutateTemplate({ template_html: refHTML.current.innerHTML });
          setIsModalOpen(false);
        }}
        title={"Manage variable"}
        description={
          "Select column name for selected node " + selectedNode?.tagName
        }
      />
    </PageContainer>
  );
};

export default Template;
