import PostCard from "../PostCard/PostCard";

export default function PostList({ posts }) {
  if (!posts?.length) {
    return <p style={{ color: "#cbd5e1" }}>Aún no hay publicaciones.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
