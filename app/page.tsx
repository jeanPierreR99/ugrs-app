import GarbageTracking from "@/components/garbage-tracking/GarbageTracking";

export default function Home() {
  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-slate-100">
      <GarbageTracking />
    </main>
  );
}