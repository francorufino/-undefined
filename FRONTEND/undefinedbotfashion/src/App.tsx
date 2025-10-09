/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/scenes/navbar";
import { useState } from "react";
import { z } from "zod";
import { SelectedPage } from "@/shared/types";

// Schema de validação no front
const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  age: z.coerce.number().min(18, "Must be 18+"),
});

interface User {
  _id: string,
  name: string,
  email: string,
  age: number
};



function App() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);


  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [users, setUsers] = useState<User[]>([]);
  //const [userId, setUserId] = useState<User | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");


  async function fetchUsers() {
    try {
      const res = await fetch('http://localhost:3001/users')
      const data = await res.json()
      setUsers(data);
      if (!res.ok) {
        return setErrors({ server: ["Não tem usuários"] });
      }
    } catch (error: any) {
      setErrors({ server: [error.message] });
    }
  }

    // async function fetchUserById() {
    // try {
    //  const res = await fetch(`http://localhost:3001/users/${userId}`)
    //  if (res.status === 404) {
    //    return setErrors({ server: ["Usuário nao encontrado"] });
    //  }

    //  if (!res.ok) {
    //    return setErrors({ server: ["Não tem usuários"] });
    //  }

    //  const data = await res.json()
    //  setUserId(data);
    // } catch (error: any) {
    //  setErrors({ server: [error.message] });
    // }
    // }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const frontendErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!frontendErrors[key]) frontendErrors[key] = [];
        frontendErrors[key].push(issue.message);
      });
      setErrors(frontendErrors);
      return;
    }

    console.log(parsed.data);
    try {
      const res = await fetch("http://localhost:3001/users", { // http://meu-primeiro-servidor.com.br/users
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      
      const data = await res.json();
      console.log(data);

      if(data.message === "User already exists") {
        setErrors({ email: ["User already exists"] });
        return
      }
      
      if (!res.ok) {
        setErrors(data.errors || { server: ["Erro desconhecido"] });
        return;
      }   

      setSuccess("User created successfully!");
      setForm({ name: "", email: "", age: "" });
    } catch (err: any) {
      setErrors({ network: { _errors: [err.message] } });
    }
  }

  return (
    <> 
     {/* <Navbar
     selectedPage={selectedPage} 
     setSelectedPage={setSelectedPage}
     /> */}
     <div >
        <h1>app</h1> </div>
      
     <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h1>Create User</h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ width: "100%", padding: 8 }}
              required
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name.join(", ")}</p>}
          </div>

          <div>
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ width: "100%", padding: 8 }}
              required
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email.join(", ")}</p>}
          </div>

          <div>
            <input
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              style={{ width: "100%", padding: 8 }}
              required
            />
            {errors.age && <p style={{ color: "red" }}>{errors.age.join(", ")}</p>}
          </div>

          <button type="submit" style={{ padding: 10 }}>Save</button>
          {success && <p style={{ color: "green" }}>{success}</p>}
        </form>
      </div>
      <button onClick={fetchUsers}>Fetch Users</button>
      <div>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email} - {user.age}
            </li>
          ))}
        </ul>
      </div>
      console.log("form:", form);

    </>
  )
}

export default App
