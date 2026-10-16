/** The sign-in pages: a narrow, centred column (the console has its own sidebar layout). */
export default function AdminLoginLayout({ children }: LayoutProps<"/admin/login">) {
  return <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12">{children}</div>;
}
