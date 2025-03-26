import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <nav className="bg-indigo-600 py-3 text-white">
        <div className="container-custom flex items-center flex-wrap justify-between gap-2">
          <h2 className="font-bold">Todo App</h2>
          <ul className="flex items-center gap-4 flex-wrap">
            <Link href="/">Home</Link>
            {true && (
              <>
                <Link href="/sign-in">SignIn</Link>
                <Link href="/sign-up">SignUp</Link>
                <Link href="/reset-password/:token">Reset Password</Link>
              </>
            )}
            {true && (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <button className="cursor-pointer">
                  Logout
                </button>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
