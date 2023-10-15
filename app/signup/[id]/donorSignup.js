import { useRouter } from "next/router";
import React from "react";
const DonorSignup = () => {
    const router = useRouter();
    const role = router.query.id;
    console.log(role)
    return (
        <>
            {role}
        </>
    );
}

export default DonorSignup;