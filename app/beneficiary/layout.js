import Nav from "@/components/beneNav";
import Footer from "@/components/footer";

const BeneLayout = ({ children }) => {
    return (
        <>
            <Nav />
            {children}
            <Footer />
        </>
    );
}

export default BeneLayout;