import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, SquarePen, Trash2 } from "lucide-react";
import DeleteConfirm from "./ui/delete-confirm";

const MenuDropdown = ({
  isEditing,
  setIsEditing,
  handleDelete,
  deleteDescription,
  deleteItemName,
  extra,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleDelete: () => void;
  deleteDescription?: string;
  deleteItemName?: string;
  extra?: React.ReactNode;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="cursor-pointer p-2">
      <EllipsisVertical size={20} />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {!isEditing && (
        <DropdownMenuItem onClick={() => setIsEditing(true)}>
          <SquarePen size={16} />
          Edit
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()} // Prevents menu from closing too soon
      >
        <DeleteConfirm
          description={deleteDescription}
          itemName={deleteItemName}
          handleDelete={handleDelete}
          trigger={
            <span className="w-full flex gap-2">
              <Trash2 size={16} />
              Delete
            </span>
          }
        />
      </DropdownMenuItem>
      {extra && (
        <>
          <DropdownMenuSeparator />
          {extra}
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default MenuDropdown;
