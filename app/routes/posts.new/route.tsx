import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { createPost, handleValidation } from "~/utils/validateInput";

// Render
export default function NewPost() {
  const user = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <Form
      method="POST"
      className="flex flex-col gap-4 h-[50vh] justify-between"
    >
      <div className="flex flex-col gap-4 h-[75%]">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="border py-4 px-2"
        />
        {/* <input type="text" name="userId" value={user} /> */}
        <p className="text-red-300">{actionData?.fieldErrors?.title}</p>
        <textarea
          name="body"
          placeholder="Your post"
          className="border flex-1 p-2"
        />
        <p className="text-red-300">{actionData?.fieldErrors.body}</p>
      </div>
      <button className="border py-4">Submit</button>
    </Form>
  );
}

// Action

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request);
  const data = await request.formData();
  const formData = Object.fromEntries(data);
  const userId = user?.id;

  const { title, body, fieldErrors } = await handleValidation(formData);

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return json({ fieldErrors }, { status: 400 });
  }
  const post = await createPost({ title, body, userId });

  return redirect(`/posts/${post.id}`);
}
