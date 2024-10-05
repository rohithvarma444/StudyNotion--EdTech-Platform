import { toast } from "react-hot-toast";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} = settingsEndpoints;

// Updated updateDisplayPicture function
export function updateDispalyPicture(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector(
                "PUT",
                UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            );
            console.log("UPDATE_DISPLAY_PICTURE_API RESPONSE.............", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Display Picture Updated Successfully");
            console.log("Updated DP: ", response.data.data)
            dispatch(setUser(response.data.data));
            localStorage.setItem("user",JSON.stringify(response.data.data));

        } catch (error) {
            console.log(error);
            toast.error("Error in updating profile picture");
        }
        toast.dismiss(toastId);
    };
}

// Updated updateProfile function
export function updateProfile(token, formData) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      try {
        const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
          Authorization: `Bearer ${token}`,
        })
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        console.log("Check me Here: ",response.data.data)

        dispatch(setUser(response.data.data));
        localStorage.setItem("user",JSON.stringify(response.data.data));
        toast.success("Profile Updated Successfully")
      } catch (error) {
        console.log("UPDATE_PROFILE_API API ERROR............", error)
        toast.error("Could Not Update Profile")
      }
      toast.dismiss(toastId)
    }
  }

// Updated changePassword function
export function changePassword(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading....");
        try {
            const response = await apiConnector(
                "POST",
                CHANGE_PASSWORD_API,
                formData,
                {
                    Authorization: `Bearer ${token}`, 
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Password Updated Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Error in updating password");
        }
        toast.dismiss(toastId);
    };
}

// Updated deleteProfile function
export function deleteProfile(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        try {
            const response = await apiConnector(
                "DELETE",
                DELETE_PROFILE_API,
                null,
                {
                    Authorization: `Bearer ${token}`, 
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success("Profile Deleted Successfully");
            dispatch(logout(navigate));
            navigate("/");
            
        } catch (error) {
            console.log("Error", error);
            toast.error("Error in deleting the profile");
        }
        toast.dismiss(toastId);
    };
}
