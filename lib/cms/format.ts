type TextNode = { kind: "text"; text: string };
type ElementNode = {
  kind: "element";
  name: string;
  open: string;
  close: string;
  void: boolean;
  children: Node[];
};
type Node = TextNode | ElementNode;

// 부모에 블록 자식이 없으면 부모와 같은 줄에 두는 요소. 그 밖의 요소(img 포함)는 블록으로 본다.
const INLINE = new Set(["em", "strong", "b", "i", "br", "span"]);
const VOID = new Set(["br", "img", "hr", "input", "meta", "link", "col", "wbr", "source", "area", "base", "embed", "track"]);

// 주석, 태그, 글자, 짝 없는 "<" 순서로 자른다. renderToStaticMarkup은 글자 속 "<"와 속성 속 ">"를 이스케이프하므로
// 태그 하나는 "<"에서 처음 나오는 ">"까지다.
const TOKEN = /<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+|</g;

function parse(markup: string): Node[] {
  const root: Node[] = [];
  const stack: ElementNode[] = [];
  const current = () => (stack.length ? stack[stack.length - 1].children : root);

  for (const token of markup.match(TOKEN) ?? []) {
    const closing = /^<\/([a-zA-Z][\w-]*)\s*>$/.exec(token);
    if (closing) {
      const name = closing[1].toLowerCase();
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name === name) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    const opening = /^<([a-zA-Z][\w-]*)/.exec(token);
    if (opening && token.endsWith(">")) {
      const name = opening[1].toLowerCase();
      const isVoid = VOID.has(name) || token.endsWith("/>");
      const node: ElementNode = { kind: "element", name, open: token, close: `</${name}>`, void: isVoid, children: [] };
      current().push(node);
      if (!isVoid) stack.push(node);
      continue;
    }
    current().push({ kind: "text", text: token });
  }
  return root;
}

function serialize(node: Node): string {
  if (node.kind === "text") return node.text;
  return node.open + node.children.map(serialize).join("") + (node.void ? "" : node.close);
}

function isBlock(node: Node): boolean {
  return node.kind === "element" && !INLINE.has(node.name);
}

function toLines(node: Node, depth: number): string[] {
  const pad = "  ".repeat(depth);
  if (node.kind === "text") {
    const text = node.text.trim();
    return text ? [pad + text] : [];
  }
  if (node.void) return [pad + node.open];
  if (!node.children.some(isBlock)) return [pad + serialize(node)];
  return [pad + node.open, ...node.children.flatMap((child) => toLines(child, depth + 1)), pad + node.close];
}

// renderToStaticMarkup 결과(태그 사이 공백 없음)를 사람이 읽기 좋게 정리한다.
// 블록 요소는 한 줄씩 2칸씩 들여쓰고, 블록 자식이 없는 요소는 안의 글자와 인라인 요소까지 한 줄에 둔다.
export function formatHtml(markup: string): string {
  return parse(markup)
    .flatMap((node) => toLines(node, 0))
    .join("\n");
}
