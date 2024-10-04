import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await db.post.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!post) throw new Error("That post does not exist");
  return post;
}

export default function Edit() {
  const post = useLoaderData<typeof loader>();
  return (
    <Form
      method="POST"
      className="flex flex-col gap-4 h-[50vh] justify-between"
    >
      <div className="flex flex-col gap-4 h-[75%]">
        <input
          type="text"
          name="title"
          defaultValue={post.title}
          className="border py-4 px-2"
        />
        <textarea
          name="body"
          placeholder="Your post"
          defaultValue={post.body}
          className="border flex-1 p-2"
        />
      </div>
      <button className="border py-4">Update</button>
    </Form>
  );
}

export async function action({ params, request }: ActionFunctionArgs) {
  const data = await request.formData();
  const formData = Object.fromEntries(data);
  const updatedPost = await db.post.update({
    where: {
      id: params.id,
    },
    data: formData,
  });
  console.log(formData);
  return redirect(`/posts/${updatedPost.id}`);
}
