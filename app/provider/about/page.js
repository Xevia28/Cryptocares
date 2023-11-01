const About = () => {
  return (
    <>
      <div className="min-h-screen">
        <div className="bg-[url('/rip.jpg')] bg-center bg-cover h-[50vh] sm:h-bgHeight flex font-bold text-3xl lg:text-5xl justify-center items-center">
          <h1>
            About CryptoCares
          </h1>
        </div>
        <div className="w-full sm:w-3/4 mx-auto text-justify my-6 sm:my-16 p-4 opacity-75">
          <p>
            CryptoCares is a blockchain-based charity platform that provides a transparent, secure, and accountable way of donating money to people in need of help. Charitable organizations face significant challenges in ensuring transparency, accountability, and trust in the donations they receive and distribute. Donors often lack visibility into how their contributions are used, while charities struggle to demonstrate the impact of their work and ensure that funds are being used effectively. Additionally, existing donation systems are often subject to high fees, slow processing times, and potential fraud or misuse. These challenges can undermine public trust in charitable organizations and discourage donations.
          </p>
          <p className="mt-4 sm:mt-6">
            So CryptoCares, a blockchain-based charity system, has the potential to address these challenges by providing a secure, transparent, and efficient platform for charitable donations and distribution. By leveraging blockchain technology, donors can have visibility into the use and impact of their donations, while charities can demonstrate their accountability and impact. Additionally, blockchain can reduce transaction costs and increase the speed of donation processing, making it easier and more cost-effective to donate to charitable causes. Because blockchain transactions can be automated and don&apos;t require intermediaries like banks or payment processors, it may be possible to streamline the donation process and reduce administrative costs.
          </p>
          <p className="mt-4 sm:mt-6">
            Finally, a blockchain-based charity platform could potentially increase access to charitable giving by making it easier and more secure to donate funds. For example, it could allow for donations to be made from anywhere in the world and could facilitate donations in cryptocurrencies or other non-traditional forms of payment. This could help expand the pool of potential donors and increase the overall impact of charitable giving.
          </p>
        </div>

        <div className="w-full sm:w-3/4 mx-auto p-4 my-10 flex flex-col sm:flex-row justify-center items-center sm:justify-around gap-4 sm:gap-10">
          <div className="text-center sm:w-1/2">
            <div className="text-2xl font-semibold">
              Benefits of CryptoCares
            </div>
            <div className="mt-4 opacity-75">
              ChainFund crowdfunding offers several benefits over traditional crowdfunding models. It eliminates the need for intermediaries, reduces transaction costs, increases transparency and security, and enables small investors to participate in projects that were previously only available to large investors.
            </div>
          </div>
          <div className="w-full sm:w-1/3 mt-6 sm:mt-0 text-center">
            <div className="bg-[url('/abot.jpg')] w-full h-[220px] rounded-2xl bg-cover mx-auto"></div>
          </div>
        </div>

        <div className="my-10 sm:my-20 w-1/2 lg:w-3/4  mx-auto p-4">
          <p className="text-medium font-bold lg:text-3xl">
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
      </div>
    </>
  );
};

export default About;