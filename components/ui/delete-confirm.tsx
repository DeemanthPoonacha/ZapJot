import React, { MouseEventHandler } from "react";
import { CustomAlertDialog } from "./custom-alert";
import { Trash2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

const DeleteConfirm = ({
  itemName = "Item",
  handleDelete,
  trigger,
  buttonVariant = "outline",
  title,
  description,
  iconClassName,
  buttonClassName,
}: {
  description?: string;
  title?: string;
  itemName?: string;
  handleDelete: MouseEventHandler<HTMLButtonElement>;
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
  buttonClassName?: string;
  iconClassName?: string;
}) => {
  return (
    <CustomAlertDialog
      trigger={
        trigger || (
          <Button
            variant={buttonVariant}
            type="button"
            className={buttonClassName}
          >
            <Trash2
              size={16}
              className={cn("text-destructive", iconClassName)}
            />
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
