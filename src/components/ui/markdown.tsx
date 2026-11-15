import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { isPlaceholder } from "@/lib/utils";
import { Placeholder } from "./placeholder";

/** Flatten rendered children back to plain text (for placeholder detection). */
function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children);
      return "";
    })
    .join("");
}

const components: Components = {
  p({ children }) {
    const text = textOf(children);
    return isPlaceholder(text) ? <Placeholder text={text} /> : <p>{children}</p>;
  },
  li({ children }) {
    const text = textOf(children);
    return isPlaceholder(text) ? (
      <li className="pl-0! before:hidden!">
        <Placeholder text={text} />
      </li>
    ) : (
      <li>{children}</li>
    );
  },
  a({ href, children }) {
    const external = href?.startsWith("http");
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  // Content is authored in our own admin, but never trust raw HTML or images
  // pointing anywhere: react-markdown skips raw HTML by default.
  img({ src, alt }) {
    return typeof src === "string" ? (
      // eslint-disable-next-line @next/next/no-img-element -- arbitrary-size inline content images
      <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
    ) : null;
  },
};

/** Safe Markdown renderer: no raw HTML, GFM tables/lists, placeholder-aware. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={className ?? "prose-content"}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
        {children}
      </ReactMarkdown>
    </div>
  );
}
