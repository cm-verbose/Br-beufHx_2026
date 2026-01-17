import "./styles.scss";

export default function DataPoint({ data, label }: Readonly<{ data: string; label: string }>) {
  return (
    <div className="DataPoint">
      <span>{data}</span>
      <div>{label}</div>
    </div>
  );
}
