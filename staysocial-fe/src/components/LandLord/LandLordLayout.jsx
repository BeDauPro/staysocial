import React from 'react'
import { Outlet } from "react-router-dom";
const LandLordLayout = () => {
    return (
        <div>
            {/* Thêm navbar/sidebar cho landlord nếu cần */}
            <Outlet />
        </div>
    )
}

export default LandLordLayout
