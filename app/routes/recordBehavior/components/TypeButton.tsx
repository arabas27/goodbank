type TypeButtonProps = {
  className?: string;
  texts?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export default function TypeButton({
  className,
  texts,
  onClick,
}: TypeButtonProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-3 rounded font-bold ${className}`}
    >
      {texts}
    </div>
  );
}
