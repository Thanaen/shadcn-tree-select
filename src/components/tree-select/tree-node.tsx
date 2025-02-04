import { cn } from "@/lib/utils";
import { clsx } from "clsx";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";
import { Checkbox } from "../ui/checkbox";
import { TreeSelectContext } from "./context";
import type { TreeNodeDataState } from "./types";

interface TreeNodeProps {
  data: TreeNodeDataState;
}

export const TreeNode = ({ data }: TreeNodeProps) => {
  const hasSelectedChildren = data.hasSelectedChildren === true;
  let checked: boolean | "indeterminate" = data.checked === true;
  if (!checked && hasSelectedChildren) {
    checked = "indeterminate";
  }

  const [isOpen, setIsOpen] = React.useState(true);
  const { onCheck } = React.useContext(TreeSelectContext);

  if (!data.visible) return null;

  const isRoot = data.parent === undefined;
  const expandable = data.children !== undefined;

  const Icon = isOpen ? ChevronDown : ChevronRight;
  const hasChildren = data.children && data.children.length > 0;

  return (
    <div
      data-expandable={expandable}
      className={cn(
        "flex flex-col gap-2 text-left",
        !isRoot && expandable && "-ml-6"
      )}
    >
      <div className="flex items-center gap-2">
        {data.children && (
          <button
            aria-hidden={!hasChildren}
            className={clsx(!hasChildren && "pointer-events-none opacity-0")}
            onClick={hasChildren ? () => setIsOpen(!isOpen) : undefined}
          >
            <Icon className="expand-icon" size={16} />
          </button>
        )}
        <Checkbox
          id={data.value}
          checked={checked}
          onCheckedChange={() => {
            onCheck(data);
          }}
        />
        <label
          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor={data.value}
        >
          {data.name}
        </label>
      </div>
      {isOpen && hasChildren && (
        <div className={cn("flex flex-col gap-2 pl-12")}>
          {data.children?.map((child) => (
            <TreeNode key={child.value} data={child} />
          ))}
        </div>
      )}
    </div>
  );
};
