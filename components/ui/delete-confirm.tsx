import React from "react";
import { CustomAlertDialog } from "./custom-alert";
import { Trash2 } from "lucide-react";
import { Button } from "./button";

const DeleteConfirm = ({
  itemName,
  handleDelete,
  trigger,
}: {
  itemName?: string;
  handleDelete: () => void;
  trigger?: React.ReactNode;
}) => {
  return (
    <CustomAlertDialog
      trigger={
        trigger || (
          <Button variant="outline" type="button">
            <Trash2 size={16} />
            <span className="hidden">Delete {itemName}</span>
          </Button>
        )
      }
      dialogAction={[
        { title: "Cancel", variant: "outline", onClick: () => {} },
        {
          icon: <Trash2 size={16} />,
          title: "Delete",
          variant: "destructive",
          onClick: handleDelete,
        },
      ]}
      dialogTitle={`Delete ${itemName}`}
      dialogDescription={`Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
    />
  );
};

export default DeleteConfirm;
