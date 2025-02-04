import * as React from "react";
import type { TreeNodeDataState } from "./types";

interface TreeSelectContext {
  onCheck: (node: TreeNodeDataState) => void;
}

export const TreeSelectContext = React.createContext<TreeSelectContext>({
  onCheck: () => {},
});
