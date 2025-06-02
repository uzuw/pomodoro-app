import Timer from "./components/Timer";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Navbar/>

      <Timer />

    </main>
  );
}