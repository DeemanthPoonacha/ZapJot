import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";

export function CustomAlertDialog({
  trigger = <Button variant="outline">Show Dialog</Button>,
  dialogTitle = "Are you absolutely sure?",
  dialogDescription = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  dialogAction = [
    { title: "Cancel", variant: "outline", onClick: () => {} },
    { title: "Continue", variant: "default", onClick: () => {} },
  ],
}: {
  trigger?: React.ReactNode;
  dialogTitle?: string;
  dialogDescription?: string;
  dialogAction?: {
    icon?: React.ReactNode;
    title: string;
    variant:
      | "link"
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | null
      | undefined;
    onClick: () => void;
  }[];
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {dialogAction.map((action, index) => (
            <AlertDialogAction
              variant={action.variant}
              key={index}
              onClick={action.onClick}
            >
              {action.icon}
              {action.title}
            </AlertDialogAction>
          ))}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
