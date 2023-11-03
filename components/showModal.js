// This is the modal that shows when a beneficiary creates a project. A wallet will be created for the project and the wallet credentials will be displayed on this modal

const Modal = ({ data, onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-screen z-10 bg-bgDark flex justify-center items-center">
            <div className="bg-dark px-8 py-10 rounded w-subheader">
                <h1 className="text-3xl text-center my-2 font-bold">Wallet Credentials</h1>
                <h3><strong>Caution:</strong> Please keep these details safe and do not lose them. They may contain important information that you will need later.</h3>
                <p className="break-words mt-3">Wallet Address: <span className="text-gray-500"> {data.address}</span></p>
                <p className="break-words mt-3">Public Key: <span className="text-gray-500"> {data.publicKey}</span></p>
                <p className="break-words mt-3">Private Key: <span className="text-gray-500"> {data.privateKey}</span></p>
                <p className="break-words mt-3">Seed Value: <span className="text-gray-500"> {data.seed}</span></p>
                <button className="p-3 bg-darkGreenish rounded block w-full mt-4" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
