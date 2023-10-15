import Navigation from "@/components/indexNav";
const Home = () => {
    return (
        <>
            <Navigation />
            <div className="min-h-screen mx-36">
                <div className="h-bgHeight">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.jpg')] bg-cover z-[-1] transform scale-x-[-1] brightness-50"></div>
                    <div className="z-0 h-full flex flex-col justify-center gap-4">
                        <h1 className="font-extrabold text-6xl w-header drop-shadow-custom">Make Charitable Donations With The Power of Blockchain</h1>
                        <h5 className="font-semibold text-lg w-subheader">Join the Blockchain Charity Revolution and Make Your Mark on the World Today</h5>
                        <div>
                            <button className="p-3 bg-darkGreenish text-whitish rounded mr-5">Explore</button>
                            <button className="p-3 bg-darkGreenish text-whitish rounded">Join Us</button>
                        </div>
                    </div>
                </div>

            </div>
        </>);
}

export default Home;