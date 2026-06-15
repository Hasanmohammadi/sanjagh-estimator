import Header from "./header";

interface Props {
  children: React.JSX.Element;
}

export default function Layout({ children }: Props) {
  return (
    <div className="layout mt-5">
      <div className="topLevelComponent">
        <Header />
        {children}
      </div>
    </div>
  );
}
