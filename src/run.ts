import { app, type VNode } from "hyperapp"
import view from "./main/view.tsx"
import { init, type State, subscriptions } from "./main/logic.ts"

app({
  node: document.getElementById("root")!,
  init,
  view: state => view(state) as VNode<State>,
  subscriptions,
})
