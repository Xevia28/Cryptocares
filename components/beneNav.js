import Image from "next/image";
import Link from "next/link";
const Nav = () => {
  return (
    <header className="px-10 py-6 bg-dark">
      <nav className="flex items-center justify-between">
        <Image src="/logo-white.png" height={120} width={120} alt="Loading..." />
        <div className="flex items-center gap-x-24">
          <div className="flex gap-x-16 text-l justify-end">
            <Link href="/beneficiary">Home</Link>
            <Link href="/beneficiary/create">Create</Link>
            <Link href="/beneficiary/about">About</Link>
          </div>
          <Link href="/donor/profile" className="w-12 h-12 rounded-full">
            <Image
              className="h-full w-full object-cover"
              width={70}
              height={70}
              alt="profile"
              src="/profile.jpg"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
