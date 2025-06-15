type StudentCardProps = {
  seatNumber?: number;
  title?: string;
  fname?: string;
  lname?: string;
  stdid?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
};

export default function StudentCard({
  seatNumber,
  title,
  fname,
  lname,
  onClick,
  className,
}: StudentCardProps) {
  return (
    <div
      onClick={onClick}
      className={`flex gap-3 px-3 py-2 rounded text-base cursor-pointer ${className}`}
    >
      <div>{seatNumber}</div>
      <div className="flex gap-3">
        <div>{`${title}${fname}`}</div>
        <div className="truncate">{lname}</div>
      </div>
    </div>
  );
}
