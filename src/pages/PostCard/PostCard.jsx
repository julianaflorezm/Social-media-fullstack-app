import { PostType } from "../../services/post/post";
import { getUser } from "../../services/user/user.api";
import { useEffect, useState } from "react";

export default function PostCard({ post }) {
  const [name, setName] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const data = await getUser(post.authorId);
        if (!cancelled) setName(data?.alias || data?.name || "Usuario");
      } catch (err) {
        if (!cancelled) setName("Usuario");
        console.log("error getUser", err?.message);
      }
    }

    if (post?.authorId) loadUser();

    return () => {
      cancelled = true;
    };
  }, [post?.authorId]);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.left}>
          <div style={styles.author}>{name}</div>
          <span style={styles.type}>{post.type?.toUpperCase()}</span>
        </div>

        <span style={styles.date}>
          {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
        </span>
      </div>

      {post.caption && <div style={styles.caption}>{post.caption}</div>}

      {post.type === PostType.IMAGE ? (
        <img src={post.source} alt="post" style={styles.image} />
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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  left: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  author: {
    fontSize: 14,
    fontWeight: 700,
    color: "#f8fafc",
  },
  type: {
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.2)",
    color: "#cbd5e1",
    width: "fit-content",
  },
  date: {
    fontSize: 12,
    color: "#cbd5e1",
    whiteSpace: "nowrap",
  },

  caption: { marginBottom: 10, color: "#e2e8f0" },
  text: { margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.5 },
  image: { width: "100%", borderRadius: 14, marginTop: 6, border: "1px solid rgba(255,255,255,0.12)" },
  footer: { display: "flex", gap: 14, marginTop: 12, color: "#cbd5e1", fontSize: 13 },
};
