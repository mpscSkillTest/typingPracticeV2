import html2canvas from "html2canvas";

const downloadImage = (blob: Blob, fileName: string) => {
  const fakeLink: HTMLAnchorElement = window.document.createElement("a");
  fakeLink.style = "display:none;";
  fakeLink.download = fileName;

  fakeLink.href = blob;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
};

const exportAsImage = async (el: HTMLDivElement) => {
  const canvas = await html2canvas(el);
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, "typing-result");
};

export default exportAsImage;
