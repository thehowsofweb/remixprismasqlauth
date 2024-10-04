import { redirect } from "@remix-run/react";
import { logout } from "~/utils/session.server";

// logout user and destroy session

export async function action({ request }) {
  return logout(request);
}

export async function loader() {
  return redirect("/");
}
