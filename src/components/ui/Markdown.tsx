import { CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  children: string;
  className?: string;
  style?: CSSProperties;
  paragraphClassName?: string;
}

// Renders CMS-authored markdown (paragraphs, inline links, emphasis).
// Links open in a new tab and don't trigger surrounding click handlers.
const Markdown = ({ children, className, style, paragraphClassName }: MarkdownProps) => {
  return (
    <div className={className} style={style}>
      <ReactMarkdown
        allowedElements={['p', 'a', 'em', 'strong', 'code', 'del', 'br', 'ul', 'ol', 'li']}
        unwrapDisallowed
        components={{
          p: ({ children }) => <p className={paragraphClassName}>{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
