import { PostType } from "../../services/post/post";

export default function PostCard({ post }) {
  return (
    <div style={styles.card}>
      <div style={styles.meta}>
        <span style={styles.type}>{post.type?.toUpperCase()}</span>
        <span style={styles.date}>
          {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
        </span>
      </div>

      {post.caption && <div style={styles.caption}>{post.caption}</div>}

      {post.type === PostType.IMAGE ? (
        <img
          src={post.source}
          alt="post"
          style={styles.image}
        />
      ) : (
        <p style={styles.text}>{post.textContent}</p>
      )}

      <div style={styles.footer}>
        <span>💬 {post.commentCount ?? 0}</span>
        <span>❤️ {post.likeCount ?? 0}</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 16,
    color: "white",
  },
  meta: { display: "flex", justifyContent: "space-between", marginBottom: 10, color: "#cbd5e1" },
  type: { fontSize: 12, padding: "4px 8px", borderRadius: 999, background: "rgba(59,130,246,0.2)" },
  date: { fontSize: 12 },
  caption: { marginBottom: 10, color: "#e2e8f0" },
  text: { margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5 },
  image: { width: "100%", borderRadius: 14, marginTop: 6, border: "1px solid rgba(255,255,255,0.12)" },
  footer: { display: "flex", gap: 14, marginTop: 12, color: "#cbd5e1", fontSize: 13 },
};
