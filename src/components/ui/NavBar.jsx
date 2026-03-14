function NavBar() {
  const logo = "Solomon";

  const navMenus = ["Home", "About", "Services", "Contact"];
  const navAuthBtns = ["Signup", "Login"];

  return (
    <>
      <header className="flex justify-around items-center">
        <h1>{logo}</h1>
        <div>
          {navMenus.map((menu, index) => {
            return <p key={index}>{menu}</p>;
          })}
        </div>
        <div>
          {navAuthBtns.map((btn, index) => {
            return <button key={index}>{btn}</button>;
          })}
        </div>
      </header>
    </>
  );
}

export default NavBar;
