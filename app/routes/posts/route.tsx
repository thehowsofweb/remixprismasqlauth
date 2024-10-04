import { Outlet } from "@remix-run/react";

export default function posts() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
