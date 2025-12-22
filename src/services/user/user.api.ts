import { CreateUserPayload } from "./user";

const API = "http://localhost:8080";

function getToken() {
  return localStorage.getItem("access_token"); // si guardas jwt
}
export async function createUser({ regEmail, regName, regLastname, regBirthdate, regAlias, regPassword }: CreateUserPayload) {  
  const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: regEmail.trim(),
          name: regName,
          lastname: regLastname,
          alias: regAlias,
          password: regPassword,
          birthdate: regBirthdate,
          roleId: 2
        }),
      });
  if (!res.ok) throw new Error("No se crear el usuario");
  return await res.json();
}

export async function getUser(id: number) {
  const res = await fetch(`${API}/users/${id}`, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
         },
      });
  if (!res.ok) throw new Error("No obtuvo el usuario");
  return await res.json();
}