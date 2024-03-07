import { PageContainer } from "..";
import { useParams } from "react-router-dom";
import { useProject } from "@/hooks/projects/useProject";
import { SkeletonCard } from "@/components/SkeletonCard";
import DataTableContentCart from "./DataTableContentCart";
import RenderList from "@/components/RenderList";
import ErrorPage from "@/ErrorPage";
import { useComponent } from "@/hooks/components/useComponent";
import { useTable } from "@/hooks/tables/useTable";
import NotFound from "@/NotFound";
import { useColumns } from "@/hooks/columns/useColumns";

const DataTable = () => {
  // table id, id of the project or component
  const { table_id, id } = useParams();

  const {
    data: table,
    isLoading: isTableLoading,
    isError: isTableError,
  } = useTable(table_id);
  const { data: columns } = useColumns(`?table_id=${table_id}`);
  const {
    data: project,
    isError: IsProjectError,
    isLoading: IsProjectLoading,
  } = useProject(id);

  const {
    data: component,
    isError: IsComponentError,
    isLoading: IsComponentLoading,
  } = useComponent(id);

  if (IsProjectLoading || IsComponentLoading || isTableLoading) {
    return <SkeletonCard isContainer={true} />;
  }

  if (IsProjectError || IsComponentError) {
    return (
      <ErrorPage
        title={`Something went wrong while project or component loading...`}
      />
    );
  }
  if (!table) {
    return (
      <NotFound
        title={"Table you are trying to access not found."}
        action={{ to: "/tables", title: "Go to tables" }}
      />
    );
  }

  if (!project && !component) {
    return (
      <NotFound
        title={"Project or component you are trying to access not found."}
        action={{ to: "/projects", title: "Go to projects" }}
      />
    );
  }

  let name = project
    ? project.project_name + " project"
    : component.component_name + " component";

  return (
    <PageContainer title={`Data table for ${name}`}>
      {project && (
        <RenderList
          columns={columns}
          service={"data_tables"}
          query={`?project_id=${project.id}&table_id=${table_id}`}
          invalidateQuery={`?project_id=${project.id}&table_id=${table_id}`}
          component={DataTableContentCart}
        />
      )}
      {component && (
        <RenderList
          columns={columns}
          service={"data_tables"}
          query={`?component_id=${component.id}&table_id=${table_id}`}
          invalidateQuery={`?component_id=${component.id}&table_id=${table_id}`}
          component={DataTableContentCart}
        />
      )}
    </PageContainer>
  );
};

export default DataTable;
