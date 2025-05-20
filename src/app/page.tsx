import WorkList from "@/app/work/components/workList";
import RotatingBackground from "@/components/RotatingBackground";

export default function Home() {
  return (
    <>
      <RotatingBackground interval={3000} />
      <WorkList />
    </>
  );
}
