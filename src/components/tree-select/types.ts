export interface TreeNodeData {
  name: string;
  value: string;
  children?: Array<TreeNodeData>;
}

export interface TreeNodeDataState extends TreeNodeData {
  parent?: TreeNodeDataState;
  checked?: boolean;
  hasSelectedChildren?: boolean;
  visible?: boolean;
  children?: Array<TreeNodeDataState>;
}

export interface TreeSelectProps {
  value: Array<string>;
  onValueChange: (value: Array<string>) => void;
  data: Array<TreeNodeData>;
}
