import Link from "next/link";


export const DesktopLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg text-sm font-medium transition"
  >
    {label}
  </Link>
)

export const MobileLink = ({
  href,
  label,
  onClick,
}: {
  href: string
  label: string
  onClick: () => void
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="block w-full px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 transition"
  >
    {label}
  </Link>
)
