import Nav from "@/components/beneNav";
const Create = () => {
  return (
    <>
      <Nav />
      <div className="absolute top-20 left-0 bg-[url('/Vector.png')] bg-contain h-vectorHeight w-full z-[-1]"></div>
      <div className="h-custom mx-36 flex items-center">
        <div className="my-12 w-full h-full flex justify-around items-center">
          <div className="flex flex-col justify-center gap-5">
            <h1 className="font-extrabold text-6xl w-subheader">Start a Ripple, Make a Wave</h1>
            <h5 className="font-medium w-miniheader">Create Inspiring Campaigns with Blockchain Technology. Create, Share, and Amplify with the XRP Ledger.</h5>
          </div>
          <div className="container bg-veryDarkGreenish p-5 rounded w-miniheader">
            <h2 className="font-bold text-xl my-4 text-center">Create Project</h2>
            <form className="flex flex-col gap-4">
              <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Project Name" /></div>
              <div><textarea className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Project Description" /></div>
              <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Target Amount" /></div>
              <div><input type="text" className="h-full w-full rounded p-3 text-whitish bg-inpBg border border-slate-500" placeholder="Project Deadline" /></div>
              <div>
                <label className="block">Proof of need (documentation of the financial situation or proof of status (ex. a refugee, disaster victim)):</label>
                <div className="w-full">
                  <input className="w-3/4" type="file" />
                  <button className="p-2 w-1/4 bg-darkGreenish rounded">Upload</button>
                </div>
              </div>
              <div>
                <label className="block">Image</label>
                <div className="w-full">
                  <input className="w-3/4" type="file" />
                  <button className="p-2 w-1/4 bg-darkGreenish rounded">Upload</button>
                </div>
              </div>
              <button className="p-3 bg-darkGreenish rounded">Create Project</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
