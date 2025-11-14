import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const NavBar = () => {

  return (
    <nav className="container mx-auto px-4 py-6 border-b border-gray-200 mb">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">AutoCare Scheduler</h1>
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-gray-700 hover:text-gray-900 font-medium">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  )
}

export default NavBar;