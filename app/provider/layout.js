import Nav from "@/components/provNav";
import Footer from "@/components/footer";

const ProvLayout = ({ children }) => {
    return (
        <>
            <Nav />
            {children}
            <Footer />
        </>
    );
}

export default ProvLayout;