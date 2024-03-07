import { Copy, Edit, Loader, Trash2Icon } from "lucide-react";

export const getActions = (key, options) => {
  const actions = {
    table_cart: [
      {
        id: 1,
        name: "Duplicate",
        disabled: options.isLoading,
        icon: (
          <>
            {options.isLoading ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
          </>
        ),
        onClick: () => options.onDuplicate(item.id),
      },
      {
        id: 2,
        name: "Delete",
        disabled: options.isDelete,
        icon: (
          <>
            {options.isDelete ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2Icon className="h-4 w-4 mr-2" />
            )}
          </>
        ),
        onClick: () => options.onDeleteTable(item),
      },
    ],
    data_table_cart: [
      {
        id: 1,
        name: "Edit",
        disabled: options.isEdit,
        icon: (
          <>
            {options.isEdit ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Edit className="h-4 w-4 mr-2" />
            )}
          </>
        ),
        onClick: () => options.setIsModalOpen(true),
      },
      {
        id: 2,
        onClick: () => options.handleDataTableDelete(item.id),
        disabled: options.isDelete,
        icon: (
          <>
            {options.isDelete ? (
              <Loader className="animate-spin" />
            ) : (
              <Trash2Icon className="w-4 h-4 mr-2" />
            )}
          </>
        ),
        name: "Delete",
      },
    ],
  };

  return key in actions ? actions[key] : [];
};
