export const FilterSelect = ({
  name,
  defaultValue,
  onChange,
  children,
  ref,
}: {
  name: string;
  defaultValue: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  children: JSX.Element | JSX.Element[];
  ref?: React.RefObject<HTMLSelectElement>;
}) => {
  return (
    <select
      className="outline outline-1 outline-gray-400 focus:outline-gray-900 rounded-sm p-1"
      name={name}
      id={name}
      defaultValue={defaultValue}
      onChange={onChange}
      ref={ref}
    >
      {children}
    </select>
  );
};
