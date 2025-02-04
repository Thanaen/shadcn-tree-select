import { TreeSelectContext } from "./context";
import { TreeNode } from "./tree-node";
import {
  getValuesFromState,
  handleNodeCheck,
  makeTreeNodeDataState,
} from "./tree-utils";
import type { TreeNodeDataState, TreeSelectProps } from "./types";

type TreeViewProps = TreeSelectProps & {
  searchValue?: string;
};

export const TreeView = ({
  value,
  onValueChange,
  data,
  searchValue,
}: TreeViewProps) => {
  const dataState = makeTreeNodeDataState(data, value, searchValue);

  const handleCheck = (node: TreeNodeDataState) => {
    const updatedState = handleNodeCheck(dataState, node);
    const values = getValuesFromState(updatedState);
    onValueChange(values);
  };

  return (
    <TreeSelectContext.Provider
      value={{
        onCheck: handleCheck,
      }}
    >
      <div className="flex flex-col gap-2">
        {dataState.map((item) => {
          if (!item.visible) return null;

          return <TreeNode key={item.value} data={item} />;
        })}
      </div>
    </TreeSelectContext.Provider>
  );
};
