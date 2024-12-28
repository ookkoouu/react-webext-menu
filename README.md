# @okou/react-webext-menu

React renderer for the browser extension's context menu.

## Install

```sh
npm i @okou/react-webext-menu react@18
```

> [!WARNING]
> react-webext-menu is not compatible with React 19.

## Usage

```jsx
import { render, Normal, Separator } from "@okou/react-webext-menu";
import { useState } from "react";

function MyMenu() {
  const [count, setCount] = useState(0);
  return (
    <Normal title="Counter Example">
      <Normal title={count.toString()} onClick={() => setCount((i) => i + 1)} />
      <Separator />
      <Normal title="Reset" onClick={() => setCount(0)} />
    </Normal>
  );
}

render(<MyMenu />, chrome.contextMenus);
```

<img src="media/demo.gif">
