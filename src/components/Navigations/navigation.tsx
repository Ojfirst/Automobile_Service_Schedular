import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const NavBar = () => {

  return (
    <nav className="container bg-gray-800 mx-auto px-4 py-6 border-b rounded-b-2xl border-gray-500 mb">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-200"><span className="text-red-500">Auto</span>care<span> Scheduler</span></h1>
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-gray-400 hover:text-gray-200 font-medium">
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