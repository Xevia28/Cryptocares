const Restricted = () => {
    return (
        <>
            <div className="min-h-screen flex flex-col gap-8 justify-center items-center">
                <h1 className="font-extrabold text-6xl text-red-500">Route Restricted!!</h1>
                <h3 className="font-semibold text-xl w-header text-center">Make sure that you are logged in as the right user and that you are attempting to access routes that you are allowed to access.</h3>
            </div>
        </>);
}

export default Restricted;