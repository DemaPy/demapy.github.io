import CardActions from "../../components/CardActions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "react-query";
import { useColumns } from "@/hooks/columns/useColumns";
import { CreateForm } from "@/components/CreateForm";
import { SelectColumn } from "../Projects/ProjectsModal/SelectColumn";
import { TableModel } from "../../hooks/tables/model";
import { ColumnModel } from "../../hooks/columns/model";
import { getActions } from "@/lib/actions";

const TableCart = ({
  item,
  setIsModalOpen,
  onUpdate,
  isModalOpen,
  table_id,
  selectedNode,
  table_key_id,
}) => {
  const { toast } = useToast();
  const client = useQueryClient();
  const { useColumnCreate } = ColumnModel;
  const { useTableCreate, useTableDelete } = TableModel;
  const { onCreateColumn, isCreateLoading, isCreateError } = useColumnCreate({
    toast: toast,
  });
  const { onCreateTable, isCreateTableLoading, isCreateTableError } =
    useTableCreate({
      toast: toast,
      invalidate: () =>
        client.invalidateQueries(`tables-?template_id=${item.template_id}`),
    });
  const { onDeleteTable, isDeleteTableLoading, isDeleteTableError } =
    useTableDelete({
      toast: toast,
      invalidate: () =>
        client.invalidateQueries(`tables-?template_id=${item.template_id}`),
    });

  const {
    data: columns,
    isLoading: isColumnsLoading,
    isError: isColumnsError,
  } = useColumns(`?table_id=${item.id}`);

  const onDuplicate = async (table_id) => {
    const new_template_id = uuidv4();
    const new_table = {
      ...item,
      id: new_template_id,
      table_name: item.table_name + " Copy",
    };

    // Get columns for selected id
    const new_columns = columns.filter(
      (column) => column.table_id === table_id
    );
    // Change columns id
    const change_columns_id = new_columns.map((col) => ({
      ...col,
      id: uuidv4(),
      table_id: new_template_id,
    }));

    onCreateTable(new_table);
    for (const column of change_columns_id) {
      onCreateColumn(column);
    }
  };

  const actions = getActions("table_cart", {
    isLoading: isCreateTableLoading,
    isDelete: isDeleteTableLoading,
    onDuplicate,
    onDeleteTable,
  });
  return (
    <Card className="md:max-w-[320px] w-full bg-neutral-900 hover:shadow-lg hover:bg-neutral-700 transition-all border-none">
      <CardHeader>
        <Link to={`/tables/${item.id}`}>
          <CardTitle className="text-white hover:underline leading-snug">
            {item.table_name}
          </CardTitle>
        </Link>
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
        <CardActions actions={actions} />
      </CardFooter>
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
                query={`?${table_key_id}=${table_id}`}
                onSelect={(column) => form.setValue("column_id", column)}
                value={form.getValues("column_id")}
              />
            ),
          },
        ]}
        onSubmit={onUpdate}
        title={"Manage variable"}
        description={
          "Select column name for selected node " + selectedNode?.tagName
        }
      />
    </Card>
  );
};

export default TableCart;
