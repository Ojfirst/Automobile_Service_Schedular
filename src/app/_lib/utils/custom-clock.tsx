export const Clock = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}