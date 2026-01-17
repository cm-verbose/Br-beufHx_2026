import { useRouter } from "next/navigation";
import "./style.scss";

export default function Project({ title, id }: { title: string; id: number }) {
  const router = useRouter();

  return (
    <div
      className="Project"
      onClick={() => {
        router.push(`/projects/${id}`);
      }}
    >
      <div id="cover"></div>
      <h2>{title}</h2>
    </div>
  );
}
