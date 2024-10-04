import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import { getUser } from "./utils/session.server";
import { useEffect, useState } from "react";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  const data = { user };
  console.log(data);
  return data;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="w-[80vw] mx-auto">
        <header className="bg-gray-900 py-4">
          <nav className="md:container mx-auto flex justify-between w-full items-center text-white">
            <Link to="/">
              <h1 className="font-bold text-4xl">Remix</h1>
            </Link>
            <div className="flex gap-4">
              <Link to="posts">Posts</Link>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShow(!show)}
                    className="capitalize text-gray-100 hover:text-gray-500"
                  >
                    {user.username}
                  </button>

                  {show && (
                    <Form
                      action="/auth/logout"
                      method="POST"
                      className="w-20 bg-gray-500 absolute right-0"
                      onSubmit={() => setShow(false)}
                    >
                      <button
                        type="submit"
                        className="text-gray-400 border w-full"
                      >
                        Logout
                      </button>
                    </Form>
                  )}
                </div>
              ) : (
                <Link to="/auth/login">Login</Link>
              )}
            </div>
          </nav>
        </header>
        <main className="md:container mx-auto">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <Outlet context={user} />
    </div>
  );
}
