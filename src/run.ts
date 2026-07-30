import "./style.css"
import { app, type VNode } from "hyperapp"
import { init, type State, subscriptions } from "./main.tsx"
import view from "./views/main"

app({
  node: document.getElementById("root")!,
  init,
  view: state => view(state) as VNode<State>,
  subscriptions,
})
