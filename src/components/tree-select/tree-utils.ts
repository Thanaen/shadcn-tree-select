import type { TreeNodeData, TreeNodeDataState } from "./types";

/**
 * Converts an array of TreeNodeData into an array of TreeNodeDataState.
 * TreeNodeDataState includes additional properties like parent reference and checked state.
 * @param data - The array of TreeNodeData.
 * @param values - The array of values to check against.
 * @returns An array of TreeNodeDataState.
 */
export const makeTreeNodeDataState = (
  data: Array<TreeNodeData>,
  values: Array<string> = [],
  searchValue?: string,
): Array<TreeNodeDataState> => {
  const dataClone = structuredClone(data);

  const updateAllParents = (
    node: TreeNodeDataState,
    hasSelectedChildren: boolean,
    hasVisibleChildren: boolean,
  ) => {
    if (node.parent) {
      if (hasSelectedChildren) {
        node.parent.hasSelectedChildren = true;
      }

      if (hasVisibleChildren) {
        node.parent.visible = true;
      }

      updateAllParents(node.parent, hasSelectedChildren, hasVisibleChildren);
    }
  };

  const enrichNode = (node: TreeNodeDataState, parent?: TreeNodeDataState) => {
    node.parent = parent;
    node.checked = parent?.checked || values.includes(node.value);
    node.visible =
      searchValue === undefined ||
      node.name.toLowerCase().includes(searchValue.toLowerCase());

    const isNodeChecked = node.checked;
    const isNodeVisible = node.visible;

    if (isNodeChecked || isNodeVisible) {
      updateAllParents(node, isNodeChecked, isNodeVisible);
    }

    if (node.children) {
      node.children.forEach((child) => {
        enrichNode(child, node);
      });
    }
  };

  dataClone.forEach((item) => enrichNode(item));
  return dataClone;
};

/**
 * Toggles the checked state of a node and all its parent nodes in a tree data structure.
 * @param data - The array of tree node data.
 * @param node - The node to toggle.
 * @param checked - The new checked state for the node.
 * @returns The updated state of the tree data.
 */
export const toggleAllParent = (node: TreeNodeDataState, checked: boolean) => {
  if (node.parent) {
    node.parent.checked = checked;
    toggleAllParent(node.parent, checked);
  }
};

/**
 * Updates the checked state of all parent nodes recursively.
 * @param node - The node to update.
 */
export const updateAllParents = (node: TreeNodeDataState) => {
  if (node.parent) {
    const allChildrenChecked = node.parent.children?.every(
      (child) => child.checked,
    );
    node.parent.checked = allChildrenChecked;
    updateAllParents(node.parent);
  }
};

/**
 * Toggles the checked state of all children nodes recursively.
 *
 * @param data - The array of TreeNodeDataState objects representing the tree data.
 * @param node - The TreeNodeDataState object representing the parent node.
 * @param checked - A boolean value indicating whether to check or uncheck the nodes.
 * @returns The updated state with the checked state of all children nodes toggled.
 */
export const toggleAllChildren = (
  node: TreeNodeDataState,
  checked: boolean,
) => {
  if (node.children) {
    node.children.forEach((child) => {
      child.checked = checked;
      toggleAllChildren(child, checked);
    });
  }
};

const findNodeOrChild = (
  nodes: Array<TreeNodeDataState>,
  value: string,
): TreeNodeDataState | undefined => {
  for (const node of nodes) {
    if (node.value === value) {
      return node;
    } else if (node.children) {
      const child = findNodeOrChild(node.children, value);
      if (child) {
        return child;
      }
    }
  }
  return undefined;
};

/**
 * Handles the check/uncheck action for a tree node.
 *
 * @param data - The array of TreeNodeDataState representing the tree data.
 * @param node - The TreeNodeDataState object representing the node to be checked/unchecked.
 * @returns The updated state of the tree data after the check/uncheck action.
 */
export const handleNodeCheck = (
  data: Array<TreeNodeDataState>,
  node: TreeNodeDataState,
) => {
  const stateClone = structuredClone(data);
  const item = findNodeOrChild(stateClone, node.value);
  if (item) {
    item.checked = !item.checked;
    toggleAllChildren(item, item.checked);
    updateAllParents(item);
  }
  return stateClone;
};

/**
 * Retrieves the values from the state of an array of TreeNodeDataState objects.
 * @param data - The array of TreeNodeDataState objects.
 * @returns An array of string values.
 */
export const getValuesFromState = (data: Array<TreeNodeDataState>) => {
  const values: Array<string> = [];
  const getNodeValue = (node: TreeNodeDataState) => {
    if (node.checked) {
      values.push(node.value);
    } else if (node.children) {
      node.children.forEach((child) => {
        getNodeValue(child);
      });
    }
  };

  data.forEach((item) => {
    getNodeValue(item);
  });

  return values;
};

export const getTreeValueLabelMap = (data: Array<TreeNodeData>) => {
  const labelsMap = new Map<string, string>();

  const findLabels = (node: TreeNodeDataState) => {
    labelsMap.set(node.value, node.name);
    node.children?.forEach(findLabels);
  };

  data.forEach(findLabels);

  return labelsMap;
};
