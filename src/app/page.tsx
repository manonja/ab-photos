import WorkList from "@/app/work/components/workList";
import RotatingBackground from "@/components/RotatingBackground";

/**
 * Home page with rotating background images that change every 3 seconds
 */
export default function Home() {
  return (
    <>
      <RotatingBackground interval={3000} />
      <WorkList />
    </>
  );
}
