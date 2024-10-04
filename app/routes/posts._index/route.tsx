import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export async function loader() {
  const data = {
    posts: await db.post.findMany({
      take: 10,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  };
  return data;
}

export default function Post() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link
          to="new"
          className="border px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          New Post
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link key={post.id} to={post.id}>
            <div className="border p-4 rounded-lg">
              <h1>{post.title}</h1>
              <p className="font-thin text-xs">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
