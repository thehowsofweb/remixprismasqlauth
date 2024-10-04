import { db } from "./db.server";

export async function handleValidation(formData) {
  const title = formData.title.toString();
  const body = formData.body.toString();

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  return { title, body, fieldErrors };
}

export async function createPost({ title, body, userId }) {
  return await db.post.create({
    data: {
      title,
      body,
      user: {
        connect: { id: userId },
      },
    },
  });
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
