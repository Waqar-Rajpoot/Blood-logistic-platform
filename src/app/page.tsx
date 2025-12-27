import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Stats />
      <Features />
    </main>
  );
}