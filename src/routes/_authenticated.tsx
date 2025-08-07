import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const { token } = context.authContext || {};
    if (!token) {
      throw redirect({ to: "/" });
    }
  },
});
