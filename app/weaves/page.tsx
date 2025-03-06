"use client";

import {
  Filter,
  Ellipsis,
  Pencil,
  SquareArrowOutUpRight,
  Copy,
  Link,
  Trash2,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UUID } from "crypto";
import type { Weave } from "@/lib/types";
import type {
  ComponentProps,
  FormEvent,
  MouseEvent,
  ReactNode,
  Ref,
} from "react";

import Loading from "./loading";

import { deleteWeave, editWeaveName, getWeaves } from "@/lib/actions";

type Filter = "updated";

export default function Weaves() {
  const [filter, setFilter] = useState<Filter>("updated");

  useEffect(() => console.log(filter), [filter]);

  const weavesQuery = useQuery({
    queryKey: ["weaves"],
    queryFn: () => getWeaves(),
  });

  return (
    <>
      {weavesQuery.isLoading ? (
        <Loading />
      ) : (
        <main className="flex w-full flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-bold">Recent weaves</h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                  >
                    <Filter className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setFilter("updated")}
                  >
                    Updated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-wrap gap-2">
              <NewWeave />
              {weavesQuery.data
                ?.toSorted((x, y) =>
                  filter === "updated"
                    ? y.updatedAt.getMilliseconds() -
                      x.updatedAt.getMilliseconds()
                    : 0,
                )
                .map((w) => <WeaveComp weave={w} key={w.uuid} />)}
            </div>
          </div>
        </main>
      )}
    </>
  );
}

function NewWeave() {
  const [host, setHost] = useState("localhost:3000");
  const router = useRouter();

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  return (
    <div className="flex flex-col space-y-2">
      <div
        className="bg-primary-foreground flex h-32 w-64 cursor-pointer items-center justify-center rounded-md hover:opacity-80"
        onClick={() => router.push(`${makeLoomUrl(host)}/new`)}
      >
        <Plus className="text-heavy-accent h-1/2 w-1/4" />
      </div>
      <div className="group flex min-h-6 min-w-64 items-center space-x-2">
        <p className="cursor-text font-bold">Create weave</p>
      </div>
    </div>
  );
}

function makeLoomUrl(host: string) {
  return process.env.NEXT_PUBLIC_OVERRIDE_LOOM_HOST
    ? process.env.NEXT_PUBLIC_LOOM_HOST_OVERRIDE!
    : "https://loom." + host;
}

function makeWeaveUrl(host: string, uuid: UUID) {
  return `${makeLoomUrl(host)}?host=${host}&id=${uuid}`;
}

function WeaveComp({ weave }: { weave: Weave }) {
  const [host, setHost] = useState("http://localhost:3000");
  const [rendering, setRendering] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  function handleClick(e: MouseEvent) {
    e.stopPropagation();

    const rect = ref.current!.getBoundingClientRect();

    ref.current!.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 2,
        clientX: rect.left + rect.width,
        clientY: rect.top,
      }),
    );
  }

  function handleLinkClick() {
    const url = makeWeaveUrl(host, weave.uuid);

    router.push(url.toString());
  }

  function deRender() {
    setRendering(false);
  }

  const edgeColorQuery = useQuery({
    queryKey: ["preview", weave.preview],
    queryFn: () => getAverageEdgeColor(weave.preview),
  });

  return (
    <>
      {rendering && (
        <div className="flex flex-col space-y-2">
          <RightClickMenu weave={weave} deRender={deRender}>
            {edgeColorQuery.isLoading ? (
              <Skeleton className="h-32 w-64 rounded-md" />
            ) : (
              <div
                className={cn(
                  "group/preview relative cursor-pointer overflow-hidden rounded-md hover:opacity-80",
                  {
                    "bg-primary-foreground h-32 w-64": !weave.preview,
                    "max-h-32 max-w-64": weave.preview,
                  },
                )}
                style={{
                  minWidth: textRef.current
                    ? textRef.current!.getBoundingClientRect().width + 32
                    : undefined,
                  backgroundColor: weave.preview
                    ? edgeColorQuery.data
                    : undefined,
                }}
                ref={ref}
                onClick={handleLinkClick}
              >
                <div className="absolute hidden w-full justify-end p-2 group-hover/preview:flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 cursor-pointer p-2"
                    onClick={handleClick}
                  >
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </div>
                {weave.preview && (
                  <div className="flex items-center justify-center">
                    {/* eslint-disable-next-line */}
                    <img
                      className="max-h-32 max-w-64"
                      src={`data:image/png;base64,${weave.preview}`}
                      alt=""
                    />
                  </div>
                )}
              </div>
            )}
          </RightClickMenu>
          <WeaveName weave={weave} textRef={textRef} />
        </div>
      )}
    </>
  );
}

function getAverageEdgeColor(base64: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!base64) {
      resolve("rgb(0, 0, 0)");
    }

    const img = new Image();
    img.src = `data:image/png;base64,${base64}`;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;

      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (
            y === 0 ||
            y === canvas.height - 1 ||
            x === 0 ||
            x === canvas.width - 1
          ) {
            const index = (y * canvas.width + x) * 4;
            r += imageData[index];
            g += imageData[index + 1];
            b += imageData[index + 2];
            count++;
          }
        }
      }

      if (count === 0) {
        reject(new Error("No edge pixels found"));
        return;
      }

      const avgR = Math.round(r / count);
      const avgG = Math.round(g / count);
      const avgB = Math.round(b / count);

      const avgColor = `rgb(${avgR}, ${avgG}, ${avgB})`;
      resolve(avgColor);
    };

    img.onerror = (err) => reject(err);
  });
}

function WeaveName({
  weave: { uuid, name },
  textRef,
}: {
  weave: Weave;
  textRef?: Ref<HTMLParagraphElement | null>;
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const weaveNameMutation = useMutation({
    mutationFn: (newName: string) => editWeaveName(newName, uuid),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["weaves"] });
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setEditing(false);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")! as string;

    weaveNameMutation.mutate(name);
  }

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, 999);
    }
  }, [editing]);

  return (
    <div className="group flex min-h-6 max-w-64 items-center space-x-2">
      {editing ? (
        <form onSubmit={handleSubmit} className="peer">
          <input
            type="text"
            defaultValue={name}
            ref={inputRef}
            name="name"
            onBlur={() => setEditing(false)}
            className="decoration-foreground/50 font-bold underline decoration-dotted decoration-2 outline-none"
          />
        </form>
      ) : (
        <p
          className="cursor-text font-bold"
          ref={textRef}
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          {weaveNameMutation.variables ?? name}
        </p>
      )}
      <Button
        variant="outline"
        size="sm"
        className="hidden h-6 w-6 cursor-pointer p-2 group-hover:flex peer-has-focus:hidden"
        onClick={(e) => {
          e.stopPropagation();
          setEditing((p) => !p);
        }}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}

function RightClickMenu({
  children,
  weave,
  deRender,
}: {
  children: ReactNode;
  weave: Weave;
  deRender: () => void;
}) {
  const [host, setHost] = useState("http://localhost:3000");
  const [warningOpen, setWarningOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  const url = makeWeaveUrl(host, weave.uuid);

  const deleteWeaveMutation = useMutation({
    mutationFn: () => deleteWeave(weave.uuid),
    onMutate() {
      deRender();
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["weaves"] });
    },
  });

  function handleDeleteWeave() {
    setWarningOpen(false);
    deleteWeaveMutation.mutate();
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <MenuItem pointer={false}>
          <WeaveName weave={weave} />
        </MenuItem>
        <ContextMenuSeparator />
        <MenuItem
          icon={<SquareArrowOutUpRight />}
          onClick={() => window.open(url, "_blank")}
        >
          Open in a new tab
        </MenuItem>
        <MenuItem icon={<Copy />}>Duplicate</MenuItem>
        <MenuItem
          icon={<Link />}
          onClick={() => navigator.clipboard.writeText(weave.uuid)}
        >
          Copy UUID
        </MenuItem>
        <MenuItem
          icon={<Trash2 />}
          variant="destructive"
          onClick={() => setWarningOpen(true)}
        >
          Delete
        </MenuItem>
      </ContextMenuContent>
      <AlertDialog open={warningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              weave.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setWarningOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-text hover:bg-destructive/80 cursor-pointer"
              onClick={handleDeleteWeave}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContextMenu>
  );
}

type MenuItemProps = ComponentProps<typeof ContextMenuItem> & {
  icon?: ReactNode;
  children?: ReactNode;
  pointer?: boolean;
};

function MenuItem({ icon, children, pointer = true, ...props }: MenuItemProps) {
  return (
    <ContextMenuItem
      className={cn({ "hover:cursor-pointer": pointer })}
      highlight={pointer}
      {...props}
    >
      {icon}
      {children}
    </ContextMenuItem>
  );
}
