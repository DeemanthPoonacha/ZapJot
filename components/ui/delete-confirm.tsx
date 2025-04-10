import React from "react";
import { CustomAlertDialog } from "./custom-alert";
import { Trash2 } from "lucide-react";
import { Button } from "./button";

const DeleteConfirm = ({
  itemName,
  handleDelete,
  trigger,
  buttonVariant = "outline",
  title,
  description,
}: {
  description?: string;
  title?: string;
  itemName?: string;
  handleDelete: () => void;
  trigger?: React.ReactNode;
  buttonVariant?:
    | "link"
    | "outline"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}) => {
  return (
    <CustomAlertDialog
      trigger={
        trigger || (
          <Button variant={buttonVariant} type="button">
            <Trash2 size={16} className="text-destructive" />
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
      dialogTitle={title || `Delete ${itemName}`}
      dialogDescription={
        description ||
        `Are you sure you want to delete this ${itemName}? This action cannot be undone.`
      }
    />
  );
};

export default DeleteConfirm;
