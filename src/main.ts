import { createApp, onBeforeUnmount } from "vue";
import {
  ComponentClass,
  createElement,
  Fragment,
  FunctionComponent,
  useState,
} from "react";
import { createRoot, Root } from "react-dom/client";
import { defineComponent, h, ref, watch } from "vue";
import { unmountComponentAtNode } from "react-dom";

function react2vue(
  reactComponent: FunctionComponent<any> | ComponentClass<any>,
  props: string[] = []
) {
  return defineComponent({
    props,
    setup(props) {
      const el = ref<HTMLDivElement>();
      let root: Root | null = null;

      watch([props, el], ([props, el]) => {
        !root && (root = createRoot(el as HTMLDivElement));
        const reactElement = createElement(reactComponent, props);
        root.render(reactElement);
      });

      onBeforeUnmount(() => el.value && unmountComponentAtNode(el.value));

      return { el };
    },
    render() {
      // @ts-ignore
      return h("div", {
        ref: (el: HTMLDivElement) => (this.el = el),
      });
    },
  });
}

function Printer({ text }: { text: string }) {
  return createElement("p", null, `React component: ${text}`);
}

function Counter() {
  const [count, setCount] = useState(0);

  return createElement(
    Fragment,
    null,
    createElement(
      "button",
      {
        onClick: () => setCount((count) => count + 1),
      },
      "+"
    ),
    createElement("span", null, count),
    createElement(
      "button",
      {
        onClick: () => setCount((count) => count - 1),
      },
      "-"
    )
  );
}

const ReactPrinter = react2vue(Printer, ["text"]);
const ReactCounter = react2vue(Counter);

const App = defineComponent({
  setup() {
    const text = ref("114514");
    return {
      text,
      onTextChange(e: any) {
        text.value = e.target.value;
      },
    };
  },
  render() {
    const { text, onTextChange } = this;
    return [
      h("input", { oninput: onTextChange, value: text }),
      h("p", null, `Vue Component: ${text}`),
      h(ReactPrinter, { text }),
      h(ReactCounter),
    ];
  },
});

createApp(App).mount("#app");
