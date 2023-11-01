import Image from "next/image";
import Link from "next/link";
const NavContainer = async ({ promise }) => {
    const user = await promise;
    return (
        <nav className="flex items-center justify-between">
            <Image src="/logo-white.png" height={120} width={120} alt="Loading..." />
            <div className="flex items-center gap-x-24">
                <div className="flex gap-x-16 text-l justify-end">
                    <Link href="/donor">Home</Link>
                    <Link href="/donor/project">Project</Link>
                    <Link href="/donor/about">About</Link>
                </div>
                <Link href="#menu" className="w-12 h-12 rounded-full">
                    <Image
                        className="h-full w-full object-cover"
                        width={70}
                        height={70}
                        alt="profile"
                        src={user.photo}
                    />
                </Link>
            </div>
            <div id="menu">
                <div className="inner">
                    <h2>Menu</h2>
                    <ul className="z-[1] links mt-5">
                        <li><Link href="/donor/profile">Profile</Link></li>
                        <li><Link href="/donor/impact">Impact</Link></li>
                        <li><Link href="/logout">Logout</Link></li>
                    </ul>
                    <a href="#" className="close">Close</a>
                </div>
            </div>
        </nav>
    );
}

export default NavContainer;