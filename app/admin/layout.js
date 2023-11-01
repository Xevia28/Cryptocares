import Nav from "@/components/adminSideNav";
const AdminLayout = ({ children }) => {
    return (
        <>
            <div className="flex">
                <Nav />
                {children}
            </div>
        </>
    );
}

export default AdminLayout;