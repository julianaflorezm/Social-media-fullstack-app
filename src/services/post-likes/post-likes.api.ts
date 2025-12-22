import { LikePayload } from "./post-likes";

const API = "http://localhost:8080";

function getToken() {
  return localStorage.getItem("access_token"); // si guardas jwt
}

export async function countLike(postId: string) {
  const res = await fetch(`${API}/post-likes/${postId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("No se pudo obtener la cantidad de likes del post");
  return await res.json();
}

export async function toggleLike({
        postId,
        userId
}: LikePayload) {
    
    
  const token = getToken();
  console.log('POST ID', postId,'USER ID', userId);
  const res = await fetch(`${API}/post-likes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ postId, userId: Number(userId) }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Error poniendo like a este post");
  }

  return await res.json();
}