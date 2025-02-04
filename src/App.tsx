import { TreeSelect } from "./components/tree-select/tree-select";
import * as React from "react";
import { TreeNodeData } from "./components/tree-select/types";

const data: Array<TreeNodeData> = [
  {
    name: "Parent 1",
    value: "parent-1",
    children: [
      {
        name: "Child 1-1",
        value: "child-1-1",
      },
      {
        name: "Child 1-2",
        value: "child-1-2",
      },
    ],
  },
  {
    name: "Parent 2",
    value: "parent-2",
    children: [
      {
        name: "Child 2-1",
        value: "child-2-1",
      },
      {
        name: "Child 2-2",
        value: "child-2-2",
      },
    ],
  },
  {
    name: "Parent 3",
    value: "parent-3",
    children: [
      {
        name: "Child 3-1",
        value: "child-3-1",
      },
    ],
  },
];

function App() {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <TreeSelect
        className="w-64"
        data={data}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

export default App;
