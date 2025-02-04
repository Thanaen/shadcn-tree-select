import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { AriaInvalidProps } from "@/models/aria-invalid-props";
import { ChevronDown, Search, X } from "lucide-react";
import * as React from "react";
import { Badge } from "../ui/badge";
import { Button, buttonVariants } from "../ui/button";
import { getTreeValueLabelMap } from "./tree-utils";
import { TreeView } from "./tree-view";
import type { TreeSelectProps } from "./types";

export type TreeSelectComponentProps = TreeSelectProps &
  AriaInvalidProps & {
    className?: string;
    loading?: boolean;
  };

export const TreeSelect = ({
  value,
  onValueChange,
  data,
  className,
  loading,
  "aria-invalid": invalid,
}: TreeSelectComponentProps) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [search, setSearch] = React.useState<string | undefined>("");
  const deferredSearch = React.useDeferredValue(search);

  const valueLabelMap = React.useMemo(() => {
    return getTreeValueLabelMap(data);
  }, [data]);

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-fit min-h-10 items-center justify-end py-1.5 pl-1.5 pr-0 hover:bg-background",
            invalid && "border-error-500",
            className,
            value.length > 1 && "h-auto"
          )}
          ref={ref}
          aria-invalid={invalid}
        >
          <div className="relative flex grow flex-wrap items-center gap-[6px] overflow-hidden">
            {value.length > 0 ? (
              value.map((v) => (
                <Badge
                  key={v}
                  variant="secondary"
                  className="gap-1.5 text-wrap rounded-sm px-1.5 py-0.5 text-left font-semibold hover:bg-indigo-50 hover:text-primary"
                >
                  {valueLabelMap.get(v) ?? v}
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      onValueChange(value.filter((value) => value !== v));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        onValueChange(value.filter((value) => value !== v));
                        ref.current?.focus();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <X size={14} />
                  </div>
                </Badge>
              ))
            ) : (
              <span className="ml-1 text-sm">Placeholder</span>
            )}
          </div>

          {value.length > 0 && (
            <div
              className={cn(
                buttonVariants({ size: "sm", variant: "ghost" }),
                "flex h-auto rounded-sm border-none px-2 py-0 text-gray-500 transition-colors hover:bg-transparent hover:text-primary"
              )}
              onClick={(e) => {
                e.preventDefault();
                onValueChange([]);
              }}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  onValueChange([]);
                  ref.current?.focus();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <X className="size-4" />
            </div>
          )}
          <span className="w-px self-stretch bg-border" />
          <div className="flex items-center px-2 hover:text-muted-foreground">
            <ChevronDown size={16} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
          <Search className="mr-2 size-4 shrink-0 opacity-50" />
          <input
            value={search ?? ""}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="max-h-56 overflow-y-auto p-2">
          {loading && (
            <div className="p-8 text-center text-sm text-gray-400">
              Loading...
            </div>
          )}
          {!loading && data.length === 0 && (
            <div className="p-8 text-center text-sm">No results</div>
          )}
          {!loading && data.length > 0 && (
            <TreeView
              value={value}
              onValueChange={onValueChange}
              data={data}
              searchValue={deferredSearch}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
