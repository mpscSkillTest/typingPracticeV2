type Props = {
  text: string;
};

export function TypographyH3({ text }: Props) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {text}
    </h3>
  );
}
