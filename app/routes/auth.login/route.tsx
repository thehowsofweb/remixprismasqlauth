import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, Link, useActionData } from "@remix-run/react";
import { useState } from "react";
import { createUserSession, login } from "~/utils/session.server";

export default function Auth() {
  const data = useActionData();
  const [showPassword, setShowPassword] = useState("password");
  function toggleShowPassword() {
    if (showPassword === "password") {
      setShowPassword("text");
    } else {
      setShowPassword("password");
    }
  }
  return (
    <div>
      <Form
        method="POST"
        className="relative w-[50vw] min-w-[400px] mx-auto p-4 border rounded-lg mt-8"
      >
        <div className=" absolute top-2 right-2 font-thin text-xs flex gap-2">
          <p>New User?</p>
          <Link to="/auth/register" className="text-green-200 ">
            Register
          </Link>
        </div>
        <h1 className="text-xl mt-4 mb-2 font-semibold">Login</h1>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="username"
            name="username"
            className="border p-2 rounded-md"
            required
          />
          <div className="border rounded-lg flex justify-between px-2 ">
            <input
              type={showPassword}
              name="password"
              placeholder="password"
              className="py-2 rounded-md outline-none flex-1"
              required
            />
            <button type="button" onClick={toggleShowPassword}>
              {showPassword === "password" ? "show" : "hide"}
            </button>
          </div>
          <p className="text-red-300">{data && data?.error}</p>
          <button type="submit" className="border p-2 rounded-md">
            Login
          </button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const username = data.get("username");
  const password = data.get("password");

  const user = await login({ username, password });

  if (!user) {
    return json({ error: "Invalid username or password" });
  }

  // return redirect("/posts");
  return createUserSession(user.id, "/posts");
}
