import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { contentRouteForLink } from "@/lib/content";

const safeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "details", "summary"],
  attributes: {
    ...defaultSchema.attributes,
    details: [...(defaultSchema.attributes?.details ?? []), "open"],
  },
};

export function MarkdownContent({
  body,
  sourcePath,
}: {
  body: string;
  sourcePath: string;
}) {
  const components: Components = {
    a: ({ href, children, ...props }) => {
      const mapped = href ? contentRouteForLink(href, sourcePath) : undefined;
      if (mapped?.startsWith("/") && !mapped.startsWith("//")) {
        return <Link href={mapped} {...props}>{children}</Link>;
      }
      return <a href={mapped} {...props}>{children}</a>;
    },
    h1: ({ children, ...props }) => <h1 className="lesson-h1" {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 className="lesson-h2" {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 className="lesson-h3" {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p className="lesson-paragraph" {...props}>{children}</p>,
    ul: ({ children, ...props }) => <ul className="lesson-list" {...props}>{children}</ul>,
    ol: ({ children, ...props }) => <ol className="lesson-list lesson-ordered" {...props}>{children}</ol>,
    blockquote: ({ children, ...props }) => <blockquote className="lesson-quote" {...props}>{children}</blockquote>,
    table: ({ children, ...props }) => <div className="lesson-table-wrap"><table className="lesson-table" {...props}>{children}</table></div>,
    pre: ({ children, ...props }) => <pre className="lesson-code-block" {...props}>{children}</pre>,
    code: ({ children, className, ...props }) => (
      <code className={"lesson-code " + (className ?? "")} {...props}>{children}</code>
    ),
    details: ({ children, ...props }) => <details className="lesson-details" {...props}>{children}</details>,
    summary: ({ children, ...props }) => <summary className="lesson-summary" {...props}>{children}</summary>,
  };
  return (
    <article className="lesson-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, safeSchema]]}
        components={components}
      >
        {body}
      </ReactMarkdown>
    </article>
  );
}
