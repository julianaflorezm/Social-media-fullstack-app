import { CreatePostPayload, PostType } from "./post";

const API = "http://localhost:8080";

function getToken() {
  return localStorage.getItem("access_token"); // si guardas jwt
}

export async function getPosts() {
  const res = await fetch(`${API}/post/all`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("No se pudieron cargar posts");
  return await res.json();
}

export async function createPost({
  authorId,
  type, // "image" | "text"
  textContent,
  caption,
  source, // File | null (solo si image)
}: CreatePostPayload) {
  console.log({
    authorId,
    type, // "image" | "text"
    textContent,
    caption,
    source, // File | null (solo si image)
  });

  const token = getToken();
  const form = new FormData();

  form.append("authorId", String(authorId));
  form.append("type", type);

  if (caption) form.append("caption", caption);
  if (textContent) form.append("textContent", textContent);

  // IMPORTANTE: la key debe ser "source" porque FileInterceptor('source')
  if (type === PostType.IMAGE && source) {
    form.append("source", source);
  }

  const res = await fetch(`${API}/post`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // NO pongas Content-Type aquí. El browser lo setea con boundary.
    },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Error creando post");
  }

  return await res.json();
}
