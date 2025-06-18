import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Props = {
  toggleOpen: () => void;
  shouldOpen: boolean;
  imageUrl: string | undefined;
};

const ImagePreviewDialog = ({ toggleOpen, shouldOpen, imageUrl }: Props) => {
  return (
    <Dialog onOpenChange={toggleOpen} open={shouldOpen}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Lesson Image</DialogTitle>
          <DialogDescription>
            Here is the image associated with this lesson.
          </DialogDescription>
        </DialogHeader>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Lesson"
            style={{ alignSelf: "center", height: 340, width: 600 }}
            className="rounded-lg border shadow"
          />
        ) : (
          <p>No image available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
