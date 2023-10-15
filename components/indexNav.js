import Image from "next/image";
import Link from "next/link";
const Nav = () => {
  return (
    <header className="px-10 py-6 bg-dark">
      <nav className="flex items-center justify-between">
        <Image src="/logo-white.png" height={120} width={120} alt="Loading..." />
        <div className="flex items-center gap-x-24">
          <div className="flex gap-x-16 text-l justify-end">
            <Link href="/" className="font-medium">Home</Link>
            <Link href="/explore" className="font-medium">Explore</Link>
            <Link href="/about" className="font-medium">About</Link>
          </div>
          <Link href="/login">
            <button className="px-4 py-2 rounded bg-darkGreenish">Login</button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
