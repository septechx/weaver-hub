import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <div
      className="flex w-full items-center justify-center"
      style={{ height: "calc(100vh - 65px)" }}
    >
      <Logo fill="var(--heavy-accent)" height={512} width={1024} />
    </div>
  );
}
