import { Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Weaves() {
  return (
    <main className="flex w-full flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold">Recent weaves</h1>
          <Button variant="outline" size="icon" className="cursor-pointer">
            <Filter className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 16 }, (_, i) => (
            <WeaveSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}

function WeaveSkeleton() {
  return (
    <div>
      <Skeleton className="h-32 w-64 rounded-md" />
      <Skeleton className="mt-4 h-4 w-48" />
    </div>
  );
}
