interface Props {
  className?: string;
}

export default function Spinner({ className = "size-15" }: Props) {
  return <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-design-black-1 ${className}`} />;
}
