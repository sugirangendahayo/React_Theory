import React, {useState}  from 'react';


function NavBar() {
  const 
  const [logo, setLogo] = useState("Solomon")
  const navMenus = ["Home", "About","Services", "Contact"];
  const navAuthBtns = ["Signup", "Login"];
  
  return (
    <>
      <div>
        <h1>{{logo}}</h1>
      </div>
    </>
  );
}

export default NavBar;