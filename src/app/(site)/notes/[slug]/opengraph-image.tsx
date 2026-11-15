import { getPost, getPosts } from "@/lib/data/content";
import { ogCard, ogSize } from "@/lib/og/card";

export const alt = "Note";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "__placeholder__" }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return ogCard({ eyebrow: "Notes", title: post?.title ?? "Note", subtitle: post?.excerpt });
}
