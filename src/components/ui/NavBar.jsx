function NavBar() {
  const logo = "Solomon";

  const navMenus = ["Home", "About", "Services", "Contact"];
  const navAuthBtns = ["Signup", "Login"];

  return (
    <>
      <header className="bg-cyan-900 from-blue-600 to-purple-600 shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white hover:text-blue-200 transition-colors duration-300 cursor-pointer">
              {logo}
            </h1>

            <nav className="hidden md:flex space-x-8">
              {navMenus.map((menu, index) => {
                return (
                  <a
                    key={index}
                    href="#"
                    className="text-white hover:text-blue-200 transition-colors duration-300 font-medium"
                  >
                    {menu}
                  </a>
                );
              })}
            </nav>

            <div className="flex space-x-4">
              {navAuthBtns.map((btn, index) => {
                return (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-300 cursor-pointer ${
                      btn === "Login"
                        ? "bg-transparent text-white border border-white hover:bg-white hover:text-cyan-600"
                        : "bg-white text-cyan-600 hover:bg-cyan-100"
                    }`}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default NavBar;
