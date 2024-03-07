import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, View } from "lucide-react";
import ChangeTemplate from "../pages/Templates/TemplateModal/ChangeTemplate";
import { useEffect, useState } from "react";


const accptedTags = ["a", "span", "p", "img"];

const TemplatePreview = ({
  isLoading,
  onUpdate,
  template_id,
  html,
  refHTML,
  setIsModalOpen,
  setSelectedNode,
}) => {
  const [tab, setTab] = useState("");

  useEffect(() => {
    if (!refHTML.current) return;

    function handleNodeSelect(ev) {
      if (refHTML.current === ev.target) return;
      if (!accptedTags.includes(ev.target.tagName.toLowerCase())) return;
      setIsModalOpen(true);

      if (ev.ctrlKey) {
        handleANodeSelect(ev);
        return;
      }
      ev.preventDefault();
      setSelectedNode(ev.target);
    }

    function handleANodeSelect(ev) {
      ev.preventDefault();
      setSelectedNode(ev.target.parentElement);
    }

    function handleNodeHighlight(ev) {
      ev.preventDefault();
      if (refHTML.current === ev.target) return;
      if (!accptedTags.includes(ev.target.tagName.toLowerCase())) return;
      const node = ev.target;
      node.classList.add("hovered_node");
    }

    function handleNodeUnHighlight(ev) {
      ev.preventDefault();
      const node = ev.target;
      node.classList.remove("hovered_node");
    }

    refHTML.current.addEventListener("click", handleNodeSelect);
    refHTML.current.addEventListener("dblclick", handleANodeSelect);
    refHTML.current.addEventListener("mouseover", handleNodeHighlight);
    refHTML.current.addEventListener("mouseout", handleNodeUnHighlight);

    return () => {
      if (refHTML.current) {
        refHTML.current.removeEventListener("click", handleNodeSelect);
        refHTML.current.removeEventListener("dblclick", handleANodeSelect);
        refHTML.current.removeEventListener("mouseover", handleNodeHighlight);
        refHTML.current.removeEventListener("mouseout", handleNodeUnHighlight);
      }
    };
  }, [isLoading, tab]);

  return (
    <Tabs
      defaultValue="view"
      className="w-full xl:h-screen h-[600px] overflow-y-auto relative"
      onValueChange={(v) => setTab(v)}>
      <TabsList className="sticky z-10 top-4 left-2 bg-[#111111] transition-opacity opacity-20 hover:opacity-100">
        <TabsTrigger value="view">
          <View className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="code">
          <Code2 className="w-4 h-4" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="view" className="absolute top-0 left-0 right-0">
        <div
          ref={refHTML}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
          className="w-full rounded-md block p-4 bg-neutral-600"
        />
      </TabsContent>
      <TabsContent value="code" className="absolute top-0 left-0 right-0">
        <ChangeTemplate
          isLoading={isLoading}
          onUpdate={onUpdate}
          template_id={template_id}
          placeholder={html}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TemplatePreview;
