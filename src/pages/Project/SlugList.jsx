import RenderList from "@/components/RenderList";
import React from "react";
import SlugCart from "./SlugCart";
import { SkeletonCard } from "@/components/SkeletonCard";
import ErrorPage from "@/ErrorPage";
import { useDataTables } from "@/hooks/dataTables/useDataTables";

const SlugList = ({ layout_id, project_id }) => {
  const {
    data: tables,
    isLoading: isSlugsLoading,
    isError: isSlugsError,
  } = useDataTables(`?project_id=${project_id}`);

  if (isSlugsLoading) {
    return <SkeletonCard />;
  }

  if (isSlugsError) {
    return (
      <ErrorPage title={`Something went wrong while projects loading...`} />
    );
  }

  let slugs = Array.from(new Set(tables?.map((item) => item.slug)));

  return (
    <RenderList
      component={SlugCart}
      list={slugs}
      title={"Slugs"}
      layout_id={layout_id}
      project_id={project_id}
    />
  );
};

export default SlugList;
