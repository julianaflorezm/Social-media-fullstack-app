import { LoginPayload } from "./auth";

const API = "http://localhost:8080";

export async function login({ password, email }: LoginPayload) {
  const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password }),
      });
  if (!res.ok) throw new Error("No pudo hacer el logueo");
  return await res.json();
}