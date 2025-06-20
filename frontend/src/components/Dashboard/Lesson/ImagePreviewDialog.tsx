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
      <DialogContent className="w-full sm:max-w-[900px] md:max-w-[1000px]">
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
            // style={{ alignSelf: "center", height: 340, width: 600 }}
            className="rounded-lg border shadow max-w-full md:w-[1000px] h-[450px] self-center"
          />
        ) : (
          <p>No image available</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
