const Footer = () => {
    return (
        <>
            <div className="bg-footercolor pt-10 pb-10">
                <div className="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-3/4 mx-auto flex flex-col sm:flex-row gap-10 sm:items-center">
                    <div className="flex-1 w-full sm:w-64">
                        <div className="text-2xl font-bold text-orangeish">
                            About CryptoCares
                        </div>
                        <div className="mt-2 text-sm">
                            We leverage Ethereum and Blockchain technology to fund global projects with high environmental and public health impact using a radically transparent donation platform.
                        </div>
                    </div>
                    <div className="flex-1 w-full sm:w-32 text-left sm:text-right mt-4 sm:mt-0">
                        <div className="font-bold ">
                            Contact Us
                        </div>
                        <div className="mt-2 text-sm font-semibold">
                            General
                        </div>
                        <a href="mailto:xeviabcd28@gmail.com" className="text-sm font-light">xeviabcd28@gmail.com</a>
                        <div className="mt-4"></div>
                        <div className="mt-2 text-sm font-semibold">
                            Technical Support
                        </div>
                        <a href="mailto:dev.gcit@rub.edu.bt" className="text-sm font-light">dev.gcit@rub.edu.bt</a>
                    </div>
                    <div className="flex-1 w-full sm:w-32 text-left sm:text-right mt-4 sm:mt-0">
                        <div className="font-bold ">
                            Information
                        </div>
                        <div className="mt-2">
                            <div>
                                <a href="" className="text-sm font-light">FAQs</a>
                            </div>
                            <div>
                                <a href="" className="text-sm font-light">Terms of Use</a>
                            </div>
                            <div>
                                <a href="" className="text-sm font-light">Privacy Policy</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full sm:w-32 text-left sm:text-right mt-4 sm:mt-0">
                        <div className="font-bold ">
                            Follow us
                        </div>
                        <div className="mt-4 flex flex-row-reverse sm:flex-row sm:mt-2">
                            <div className="flex-1">
                                <a href="#" className="flex flex-row-reverse">
                                    <div className="bg-[url('/img/instagram.png')] w-[40px] h-[40px] bg-no-repeat bg-contain"></div>
                                </a>
                            </div>
                            <div className="flex-1">
                                <a href="#" className="flex flex-row-reverse">
                                    <div className="bg-[url('/img/facebook.png')] w-[40px] h-[40px] bg-no-repeat bg-contain"></div>
                                </a>
                            </div>
                            <div className="flex-1">
                                <a href="#" className="flex flex-row-reverse">
                                    <div className="bg-[url('/img/twitter.png')] w-[40px] h-[40px] bg-no-repeat bg-contain"></div>
                                </a>
                            </div>
                        </div>
                        <div className="text-sm font-light mt-3 sm:mt-0">
                            Copyright 2023
                        </div>
                        <div className="text-sm font-light">
                            All Rights Reserved by CryptoCares
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default Footer;