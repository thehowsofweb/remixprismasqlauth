import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "react-router";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await db.post.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!post) throw new Error("Post not found");
  return post;
}

export default function Post() {
  const post = useLoaderData<typeof loader>();
  return (
    <>
      <div className="mt-6 flex flex-col gap-4">
        <h1 className="capitalize text-4xl font-semibold">{post?.title}</h1>
        <p className="first-letter:capitalize font-extralight">{post?.body}</p>
      </div>
      <Link to="edit">Edit</Link>
      <Form method="POST" className="absolute right-8 bottom-8">
        <input type="hidden" name="_method" value="delete" />
        <button type="submit" className="border p-3 rounded-lg">
          Delete This Post?
        </button>
      </Form>
    </>
  );
}

export async function action({ params }: ActionFunctionArgs) {
  const post = await db.post.delete({
    where: {
      id: params.id,
    },
  });

  console.log(`${post.title} has been deleted`);

  return redirect("/posts");
}
