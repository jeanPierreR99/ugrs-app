import GarbageTracking from "@/components/garbage-tracking/GarbageTracking";
import RoutesLegend from "@/components/garbage-tracking/RoutesLegend";

export default function Home() {

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-slate-100">
      <RoutesLegend />
      <GarbageTracking />
    </main>
  );
}
