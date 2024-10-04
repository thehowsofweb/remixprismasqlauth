import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, Link, redirect, useActionData } from "@remix-run/react";
import { useState } from "react";
import { db } from "~/utils/db.server";
import { createUserSession } from "~/utils/session.server";
import bcrypt from "bcrypt";

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
        className="w-[50vw] min-w-[400px] mx-auto p-4 border rounded-lg mt-8 relative"
      >
        <div className=" absolute top-2 right-2 font-thin text-xs flex gap-2">
          <p>Already have an account?</p>
          <Link to="/auth/login" className="text-green-200">
            Login
          </Link>
        </div>
        <h1 className="text-xl mb-2 mt-4 font-semibold">Register</h1>
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
            Submit
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

  const userExists = await db.user.findUnique({
    where: { username: username },
  });

  if (userExists) {
    return json({ error: "Username exist, try a different one" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await db.user.create({
    data: {
      username,
      passwordHash,
    },
  });

  return createUserSession(newUser.id, "/posts");
}
