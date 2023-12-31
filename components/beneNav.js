// Beneficiary Navbar

"use client"
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Loading from "@/app/loading";

// customized options to style the toast
const toastOption = {
  position: "top-right",
  autoClose: 8000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "colored"
};

const Nav = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Menu dropdown code
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  async function handleUserDetails() {
    try {
      const token = await axios.get("/api/users/token"); // getting the decoded token details from the cookies
      const user_id = token.data.decodedToken.id;
      const user = await axios.get("/api/users/" + user_id); // getting the details of the logged in user
      // console.log(user.data.user);
      setUser(user.data.user);
    } catch (err) {
      console.log(err)
      toast.error("You have to log in again!", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        newestOnTop: true,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "colored"
      })
    }
  }

  useEffect(() => {
    handleUserDetails();
  }, [])

  // Menu dropdown code
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  async function handleLogout() {
    try {
      toast.info("Logging out", toastOption);
      const logout = await axios.post("/api/users/logout");
      if (logout.status === 200) {
        toast.success("Logout successful", toastOption);
        setTimeout(() => { router.push("/") }, 1000)
        return;
      }
    } catch (err) {
      toast.error(err.message, toastOption);
      console.log(err);
    }
  }

  return (
    <>
      <ToastContainer />
      {!user ? <Loading /> : <header className="px-10 py-6 bg-dark">
        <nav className="flex items-center justify-between">
          <Image src="/logo-white.png" height={120} width={120} alt="Loading..." />
          <div className="flex items-center gap-x-24">
            <div className="flex gap-x-16 text-l justify-end">
              <Link href="/beneficiary">Home</Link>
              <Link href="/beneficiary/create">Create</Link>
              <Link href="/beneficiary/about">About</Link>
            </div>
            <div className="w-12 h-12" ref={menuRef}>
              <button onClick={toggleMenu} className="user-profile-button">
                <Image
                  className="h-12 w-12 object-cover rounded-full"
                  width={1000}
                  height={1000}
                  alt="profile"
                  src={user.photo}
                />
              </button>
              {isMenuOpen && (
                <ul className="z-[1] bg-dark w-48 absolute right-0 top-24">
                  <li className="text-left px-4 hover:bg-slate-700">
                    <Link className="block h-full w-full py-5" href="/beneficiary/profile" onClick={() => setTimeout(() => { closeMenu() }, 500)}>Profile</Link>
                  </li>
                  <li className="text-left px-4 hover:bg-slate-700">
                    <Link className="block h-full w-full py-5" href="/beneficiary/projects" onClick={() => setTimeout(() => { closeMenu() }, 500)}>My Projects</Link>
                  </li>
                  <li className="text-left px-4 hover:bg-slate-700">
                    <Link className="block h-full w-full py-5" href="/beneficiary/requested" onClick={() => setTimeout(() => { closeMenu() }, 500)}>Services Requested</Link>
                  </li>
                  <li className="text-left px-4 hover:bg-slate-700">
                    <span className="block h-full w-full py-5 hover:cursor-pointer" onClick={() => handleLogout()}>Logout</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </nav>
      </header >}
    </>

  );
};

export default Nav;
