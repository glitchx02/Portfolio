import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('css', css);

import { Sidebar } from "@/components/Sidebar";
import { TopNavigation } from "@/components/TopNavigation";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { blogPostsData } from "@/data/blogPosts";

const BlogPost = () => {
  const { id } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const post = blogPostsData.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopNavigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Post not found</h1>
            <Link to="/" className="text-accent hover:underline">
              Go back to home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        onMenuClick={() => setIsMobileMenuOpen(true)}
        showMenuButton
      />

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar
            searchQuery=""
            onSearchChange={() => {}}
            activeCategory={post.category}
            onCategoryChange={() => {}}
            isMobile={true}
          />
        </SheetContent>
      </Sheet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8 max-w-7xl mx-auto">
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20">
              <Sidebar
                searchQuery=""
                onSearchChange={() => {}}
                activeCategory={post.category}
                onCategoryChange={() => {}}
                isMobile={false}
              />
            </div>
          </div>

          <main className="flex-1 min-w-0">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>

            <article className="max-w-4xl">
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>

              <h1 className="text-2xl md:text-6xl font-bold mb-8 leading-snug font-sans text-white">
                {post.title}
              </h1>

              {post.author && (
                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-lg text-indigo-900 dark:text-indigo-200">
                      {post.author.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {post.author.role}
                    </p>
                  </div>
                </div>
              )}

              <div className="relative mb-10 overflow-hidden rounded-lg aspect-[16/8]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }: any) => (
                      <p
                        className="text-base md:text-lg font-sans leading-relaxed md:leading-loose text-slate-700 dark:text-slate-300 my-6 antialiased"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }: any) => (
                      <h2
                        className="text-3xl md:text-4xl font-bold mt-10 mb-4 border-b border-border pb-2 text-white"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }: any) => (
                      <h3
                        className="text-2xl md:text-3xl font-semibold mt-8 mb-3 text-white"
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }: any) => (
                      <span
                        className="font-normal text-slate-700 dark:text-slate-300"
                        {...props}
                      />
                    ),
                    em: ({ node, ...props }: any) => (
                      <em
                        className="text-teal-600 dark:text-teal-400 not-italic"
                        {...props}
                      />
                    ),
                    mark: ({ node, ...props }: any) => (
                      <mark
                        className="bg-yellow-200 text-slate-900 px-1.5 py-0.5 rounded"
                        {...props}
                      />
                    ),
                    a: ({ node, ...props }: any) => (
                      <a className="text-accent hover:underline" {...props} />
                    ),
                    blockquote: ({ node, ...props }: any) => (
                      <blockquote
                        className="border-l-4 border-accent pl-4 italic text-slate-600 dark:text-slate-400 my-6"
                        {...props}
                      />
                    ),
                    img: ({ node, ...props }: any) => (
                      <img
                        className="w-full h-auto object-contain rounded-lg border border-border my-6"
                        {...props}
                      />
                    ),
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, '')}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        />
                      ) : (
                        <code className="bg-muted text-accent px-1.5 py-0.5 rounded" {...props}>
                          {children}
                        </code>
                      );
                    },
                    pre: ({ node, children, ...props }: any) => (
                      <>{children}</>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </article>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;
