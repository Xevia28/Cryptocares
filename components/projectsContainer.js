import Image from "next/image";

const ProjectContainer = async ({ promise }) => {
    const projects = await promise;
    function calcProgress(amountRaised, targetAmount) {
        return ((amountRaised / targetAmount) * 100).toFixed(2);
    }

    function calcProgressbar(amountRaised, targetAmount) {
        let percent = ((amountRaised / targetAmount) * 100).toFixed(2);
        if (percent >= 100) return 100;
        return percent;
    }
    return (
        <>
            {projects.map((project, index) => (
                project.status !== "pending" &&
                <div key={index} className="flex flex-col gap-2 w-96 bg-whitish text-dark rounded">
                    <div className="flex gap-3 mt-2 px-3 items-center">
                        <Image className="rounded-full w-10 h-10 object-cover" src={"/profile.jpg"} width={100} height={100} alt="prof" />
                        <div>
                            <h3 className="font-bold">{project.name}</h3>
                            <h5 className="font-medium text-xs text-gray-500">{project.status === "approved" ? "In progress" : project.status === "completed" ? "Completed" : "Pending Approval"}</h5>
                        </div>
                    </div>
                    <Image className="w-full" src={"/profile.jpg"} width={1200} height={1200} alt="prof" />
                    <div className="pt-2 pb-6 px-6 flex flex-col gap-3">
                        <p className="font-xs">{project.description.slice(0, 90)}...</p>
                        <div>
                            <div className="text-lightGreenish text-xs">{calcProgress(project.amountRaised, project.targetAmount)}%</div>
                            <div className="w-full h-3 rounded-full bg-gray-400"><div style={{ width: `${calcProgressbar(project.amountRaised, project.targetAmount)}%` }} className="h-full rounded-full bg-lightGreenish"></div></div>
                            <p className="text-sm"><strong>{project.amountRaised} XRP</strong> raised out of <strong>{project.targetAmount} XRP</strong></p>
                        </div>
                        <button className="p-3 bg-darkGreenish rounded text-whitish">View</button>
                    </div>
                </div>
            ))}
        </>);
}

export default ProjectContainer;