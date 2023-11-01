import Nav from "@/components/donorNav";
import Footer from "@/components/footer";
const DonorLayout = ({ children }) => {
    return (
        <>
            <Nav />
            {children}
            <Footer />
        </>
    );
}

export default DonorLayout;