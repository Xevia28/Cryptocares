import Link from "next/link";
import Navigation from "@/components/indexNav";
import Footer from "@/components/footer";
const Home = () => {
    return (
        <>
            <Navigation />
            <div className="min-h-screen p-4 w-full mx-auto sm:w-4/5 md:w-3/4 lg:w-3/4">
                <div className="h-bgHeight">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/bg.jpg')] bg-cover z-[-1] transform scale-x-[-1] brightness-50"></div>
                    <div className="z-0 h-full flex flex-col justify-center gap-4">
                        <h1 className=" font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl w-header drop-shadow-custom">
                            Make Charitable Donations With The Power of Blockchain
                        </h1>
                        <h5 className="mt-6 font-semibold text-base sm:text-lg w-subheader">
                            Join the Blockchain Charity Revolution and Make Your Mark on the World Today
                        </h5>
                        <div className="mt-6">
                            <Link href={"/explore"}><button className="py-3 px-6 bg-darkGreenish text-whitish rounded mr-6">Explore</button></Link>
                            <Link href={"/signup"}><button className="py-3 px-6 bg-darkGreenish text-whitish rounded">Join Us</button></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full mx-auto p-4 sm:w-4/5 md:w-3/4 lg:w-3/4">
                <div>
                    <div className="text-2xl font-semibold">
                        Aim
                    </div>
                    <div className="mt-4 text-justify opacity-75">
                        The aim of this project is to develop a safe, open, and effective platform for charitable giving that will boost donors&apos; trust and encourage them to take part in more charity activities by providing them with more assurance that their donations will be used as intended.
                    </div>
                </div>
                <div className="mt-8 sm:mt-16">
                    <div className="text-2xl font-semibold">
                        The Challenge
                    </div>
                    <div className="mt-4 text-justify opacity-75">
                        <p>
                            Charitable organizations face significant challenges in ensuring transparency, accountability, and trust in the donations they receive and distribute. Donors often lack visibility into how their contributions are used, while charities struggle to demonstrate the impact of their work and ensure that funds are being used effectively. Additionally, existing donation systems are often subject to high fees, slow processing times, and potential fraud or misuse. These challenges can undermine public trust in charitable organizations and discourage donations.
                        </p>
                        <p className="mt-5">
                            Third-party websites that track charities and the quality of their donation transparency have emerged in an attempt to provide people with peace of mind when they contribute to a cause or organization. Nonprofits with a proven transparency record average 53% more in contributions the following year compared to organizations that didn’t have the same track record.
                        </p>
                    </div>
                </div>
                <div className="mt-10 sm:mt-20">
                    <p className="text-3xl font-bold">
                        Fundraising on CryptoCares takes just a few minutes
                    </p>
                    <div className="flex flex-col mt-8 sm:mt-10 gap-x-10 gap-y-5 sm:flex-row">
                        <div className="flex-1">
                            <div className="w-12 h-12 bg-darkGreenish flex justify-center items-center rounded-full">
                                1
                            </div>
                            <div className=" font-semibold mt-4 sm:mt-5">
                                Start with the basics
                            </div>
                            <div className="text-whitish mt-2 sm:mt-4 opacity-75">
                                Kick things off with your name and location.
                            </div>
                        </div>
                        <div className="flex-1 mt-4 sm:mt-0">
                            <div className="w-12 h-12 bg-darkGreenish flex justify-center items-center rounded-full">
                                2
                            </div>
                            <div className=" font-semibold mt-4 sm:mt-5">
                                Tell Your Story
                            </div>
                            <div className="text-whitish mt-2 sm:mt-4 opacity-75">
                                Tell people about the cause you want to fundraise for.
                            </div>
                        </div>
                        <div className="flex-1 mt-4 sm:mt-0">
                            <div className="w-12 h-12 bg-darkGreenish flex justify-center items-center rounded-full">
                                3
                            </div>
                            <div className=" font-semibold mt-4 sm:mt-5">
                                Share with the rest of the world
                            </div>
                            <div className="text-whitish mt-2 sm:mt-4 opacity-75">
                                People out there want to help you.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-10 sm:my-20">
                    <p className="text-3xl font-bold">
                        CryptoCares uses Blockchain to make the system
                    </p>
                    <div className="flex flex-col mt-8 sm:mt-10 gap-x-10 gap-y-5 sm:flex-row">
                        <div className="flex-1 mt-4 sm:mt-0">
                            <div className="bg-[url('/img/transparent.png')] w-[60px] h-[60px] bg-no-repeat bg-contain">
                            </div>
                            <div className=" font-semibold mt-4 sm:mt-5">
                                Secure
                            </div>
                            <div className="text-whitish mt-2 sm:mt-4 opacity-75">
                                Only the charity&apos;s designated wallet can add transactions. Once made, transactions cannot be modified or revoked.
                            </div>
                        </div>
                        <div className="flex-1 mt-4 sm:mt-0">
                            <div className="bg-[url('/img/transparent.png')] w-[60px] h-[60px] bg-no-repeat bg-contain">
                            </div>
                            <div className=" font-semibold mt-4 sm:mt-5">
                                Transparent
                            </div>
                            <div className="text-whitish mt-2 sm:mt-4 opacity-75">
                                Everyone will be able to see how the donated money was used. Hence, the system develops accountability and transparency.
                            </div>
                        </div>
                        <div className="flex-1 mt-4 sm:mt-0">
                            <div className="bg-[url('/img/transparent.png')] w-[60px] h-[60px] bg-no-repeat bg-contain">
                            </div>
                            <div className=" font-semibold mt-4 sm:mt-5">
                                Decentralized
                            </div>
                            <div className="text-whitish mt-2 sm:mt-4 opacity-75">
                                Transactions can be made directly without the need for intermediaries, reducing transaction costs and increasing efficiency.
                            </div>
                        </div>
                    </div>

                </div>
                <div className="my-10 sm:my-20">
                    <div className="flex flex-col mt-8 sm:mt-10 gap-5 justify-center sm:flex-row">
                        <div className="flex-2 flex flex-col items-center gap-5">
                            <div className="bg-[url('/img/findaproject.png')] w-[100px] h-[100px] bg-no-repeat bg-contain">
                            </div>
                            <div className="text-2xl font-medium mt-4 sm:mt-5">
                                Find a Project
                            </div>
                            <div className="text-whitish mt-2 sm:mt-4 opacity-75 text-center">
                                Only the charity&apos;s designated wallet can add transactions. Once made, transactions cannot be modified or revoked.
                            </div>
                            <div>
                                <Link href={"/signup"}>
                                    <button className="p-3 bg-darkGreenish w-32 sm:w-40 text-whitish rounded">Donate</button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex-2 flex-2 flex flex-col items-center gap-5">
                            <div className="bg-[url('/img/startaproject.png')] w-[100px] h-[100px] bg-no-repeat bg-contain">
                            </div>
                            <div className="text-2xl font-semibold mt-4 sm:mt-5">
                                Start a Project
                            </div>
                            <div className="text-whitish mt-2 sm:mt-4 opacity-75 text-center">
                                Everyone will be able to see how the donated money was used. Hence, the system develops accountability and transparency.
                            </div>
                            <div>
                                <Link href={"/signup/beneficiary"}>
                                    <button className="p-3 w-32 sm:w-40 bg-darkGreenish text-whitish rounded">Fundraise</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>);
}

export default Home;