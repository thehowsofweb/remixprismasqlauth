import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { db } from "~/utils/db.server";

// Loader

export async function loader({ params }: LoaderFunctionArgs) {
  const users = await db.user.findMany({});
  const user = users[0].id;
  console.log(user);
  return user;
}

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
        <input type="text" name="userId" value={user} />
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

function validateTitle(title: string) {
  if (typeof title !== "string" || title.length < 3) {
    return "Title should be atleast 3 characters long";
  }
}

function validateBody(body: string) {
  if (typeof body !== "string" || body.length < 10) {
    return "Body should be atleast 10 characters long";
  }
}

// Action

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const formData = Object.fromEntries(data);

  const title = formData.title.toString();
  const body = formData.body.toString();
  const userId = formData.userId?.toString();

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return json({ fieldErrors }, { status: 400 });
  }

  const post = await db.post.create({
    data: {
      title,
      body,
      user: {
        connect: { id: userId },
      },
    },
  });

  return redirect(`/posts/${post.id}`);
}
