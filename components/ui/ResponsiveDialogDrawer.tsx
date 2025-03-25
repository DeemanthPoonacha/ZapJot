import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./drawer";

function ResponsiveDialogDrawer({
  title,
  content,
  handleClose,
}: {
  content: React.ReactNode;
  title: string;
  handleClose: () => void;
}) {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Adjust breakpoint as needed

  if (isMobile) {
    return (
      <Drawer open={true} onOpenChange={(open) => !open && handleClose()}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto p-4">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

export default ResponsiveDialogDrawer;
