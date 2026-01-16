import { useEffect, useMemo, useState } from "react";
import { PostType } from "../../services/post/post";
import { getUser } from "../../services/user/user.api";
import { countLike, toggleLike } from "../../services/post-likes/post-likes.api";
import { updatePost } from "../../services/post/post.api";
// IMPORTA tu api de likes (ajusta el path y el nombre)
// import { toggleLike } from "../../services/likes/likes.api";

// Cache simple en memoria para no pedir el mismo usuario mil veces
const userCache = new Map(); // key: userId -> alias/name

export default function PostCard({ post, onLikeToggled }) {
  const [authorName, setAuthorName] = useState("Usuario");
  const [likeCount, setLikeCount] = useState(post?.likeCount ?? 0);
  const [liked, setLiked] = useState(!!post?.likedByMe); // si tu backend lo manda
  const [liking, setLiking] = useState(false);
  const [type, setType] = useState(post?.type); // text | image
  const [textContent, setTextContent] = useState(post?.textContent);
  const [postId, setPostId] = useState(post?.id);
  const [caption, setCaption] = useState(post?.caption);
  const [source, setSource] = useState(post?.source);
  const [clickUpdate, setClickUpdate] = useState(false);
  // Mantener estado cuando cambie el post (si renderizas lista)
  useEffect(() => {
    setPostId(post?.id)
    setLikeCount(post?.likeCount ?? 0);
    setLiked(!!post?.likedByMe);
  }, [post?.id, post?.likeCount, post?.likedByMe]);

  // ✅ Si tu backend manda author, úsalo sin pedir user
  const authorFromPost = useMemo(() => {
    // soporta varias formas típicas:
    const a = post?.author;
    if (!a) return null;
    return a.alias || a.name || a.lastname || null;
  }, [post]);

  useEffect(() => {
    let cancelled = false;

    async function loadAuthor() {
      // 1) Si ya viene author en el post
      if (authorFromPost) {
        setAuthorName(authorFromPost);
        return;
      }

      // 2) Si no hay authorId
      const authorId = post?.authorId;
      if (!authorId) {
        setAuthorName("Usuario");
        return;
      }

      // 3) Cache
      if (userCache.has(authorId)) {
        setAuthorName(userCache.get(authorId));
        return;
      }

      // 4) Fetch
      try {
        const data = await getUser(authorId);
        const name = data?.alias || data?.name || "Usuario";
        userCache.set(authorId, name);
        if (!cancelled) setAuthorName(name);
      } catch (err) {
        if (!cancelled) setAuthorName("Usuario");
        console.log("error getUser", err?.message);
      }
    }

    loadAuthor();

    return () => {
      cancelled = true;
    };
  }, [post?.authorId, authorFromPost]);

  const createdAtLabel = useMemo(() => {
    if (!post?.createdAt) return "";
    return new Date(post.createdAt).toLocaleString();
  }, [post?.createdAt]);

  const handleUpdatePost = async () => {
    setClickUpdate(true);
  }
  const handleSavePost = async () => {
    setClickUpdate(false);
    await updatePost({
      id: postId,
      authorId: Number(localStorage.getItem('user_id')),
      type: PostType.TEXT,
      textContent: textContent.trim(),
      caption: caption && caption.trim() || null,
    })
    setClickUpdate(false)
  }
  // ✅ Like handler (optimistic)
  const handleToggleLike = async () => {
    if (!post?.id || liking) return;

    

    // optimistic UI
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => Math.max(0, c + (nextLiked ? 1 : -1)));

    try {
      // 🔁 AJUSTA esto a tu backend
      // const res = await toggleLike(post.id);
      const res = await toggleLike({ postId: post.id, userId: localStorage.getItem('user_id') })
      setLiking(res.liked);
      setLiked(!!res.liked);
      const resCount = await countLike(post.id);
      setLikeCount(resCount ?? 0);

      // Si tu API NO devuelve nada útil, puedes revalidar después con getPosts()

      // opcional: avisarle al padre para que actualice la lista
      onLikeToggled?.(post.id, nextLiked);
    } catch (err) {
      // rollback si falla
      setLiked((v) => !v);
      setLikeCount((c) => Math.max(0, c + (!nextLiked ? 1 : -1)));
      console.log("error toggle like", err?.message);
    } finally {
      setLiking(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.left}>
          <div style={styles.author}>{authorName}</div>
          <span style={styles.type}>{type}</span>
        </div>

        <span style={styles.date}>{createdAtLabel}</span>
      </div>

      {caption && !clickUpdate && <div style={styles.caption}>{caption}</div>}
      {/* {!caption && clickUpdate && <input value={caption} style={styles.caption}/>} */}
      {type === PostType.IMAGE && !clickUpdate ? (
        <img src={source} alt="post" style={styles.image} />
      ) : !clickUpdate && (
        <p style={styles.text}>{textContent}</p>
      )}

      {type === PostType.TEXT && clickUpdate && (
        <input value={textContent} style={styles.text} onChange={(e) => setTextContent(e.target.value)}/>
      )}
      <div style={styles.footer}>

        {!clickUpdate && localStorage.getItem('user_id') == post.authorId && <button type="button" style={styles.footerBtn} onClick={handleUpdatePost}>
          Editar post
        </button>}
        {clickUpdate && <button type="button" style={styles.footerBtn} onClick={handleSavePost}>
          guardar
        </button>}
        <button type="button" style={styles.footerBtn}>
          💬 {post?.commentCount ?? 0}
        </button>

        <button
          type="button"
          onClick={handleToggleLike}
          disabled={liking}
          style={{
            ...styles.footerBtn,
            ...(liked ? styles.liked : null),
            ...(liking ? styles.disabled : null),
          }}
          title={liked ? "Quitar like" : "Dar like"}
        >
          ❤️ {likeCount}
        </button>
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
    gap: 12,
  },
  left: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: 0,
  },
  author: {
    fontSize: 14,
    fontWeight: 700,
    color: "#f8fafc",
    maxWidth: 240,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
  image: {
    width: "100%",
    borderRadius: 14,
    marginTop: 6,
    border: "1px solid rgba(255,255,255,0.12)",
  },

  footer: { display: "flex", gap: 14, marginTop: 12 },
  footerBtn: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    padding: "8px 10px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 13,
  },
  liked: {
    border: "1px solid rgba(239,68,68,0.55)",
    background: "rgba(239,68,68,0.12)",
    color: "#fecaca",
  },
  disabled: { opacity: 0.7, cursor: "not-allowed" },
};
