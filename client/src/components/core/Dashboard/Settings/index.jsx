import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";
import Footer from "../../../common/Footer";

export default function Settings(){
    return(
        <div className="items-center text-white justify-center">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 ">
            Edit Profile
        </h1>
        <ChangeProfilePicture/>
        <EditProfile/>
        <UpdatePassword />
        <DeleteAccount/>
        <Footer/>

        </div>
    )
}