import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";
import Footer from "../../../common/Footer";

export default function Settings(){
    return(
        <>
        <div className="items-center text-white justify-center w-10/12 mx-auto">
        <h1 className="mb-7 text-3xl font-medium text-richblack-5 p-3">
            Edit Profile
        </h1>
        <ChangeProfilePicture/>
        <EditProfile/>
        <UpdatePassword />
        <DeleteAccount/>
        </div>
        </>
    )
}