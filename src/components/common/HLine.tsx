interface Props {
  fullWidth?: boolean;
}

export default function HLine({ fullWidth }: Props) {
  return (
    <div className="flex justify-center">
      <hr className={`border border-design-gray-100 my-3 ${fullWidth ? "w-full" : "w-3/4"}`} />
    </div>
  );
}
