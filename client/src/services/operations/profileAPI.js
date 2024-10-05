import { toast } from "react-hot-toast";
import { setLoading, setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import { courseEndpoints } from "../apis";
import { logout } from "./authAPI";

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API,GET_INSTRUCTOR_DATA_API } = profileEndpoints;
const {GET_ALL_INSTRUCTOR_COURSES_API} = courseEndpoints;


export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "GET",
        GET_USER_DETAILS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      console.log("Logging for allUserDetails",response.data.data);      
      dispatch(setUser(response.data.data));
    } catch (error) {
      toast.error("Could not get the User Details");
      console.log("error", error);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export async function getEnrolledCourses(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response.data.data;
  } catch (error) {
    console.log("Get User Enrolled courses error:", error);
    toast.error("Could not get enrolled courses");
  } finally {
    toast.dismiss(toastId);
  }
  return result;
}

export async function getInstructorCourses(token) {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      'GET',
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log(response)

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Fetched all the courses");
    result = response.data.data;
  } catch (error) {
    console.error("There is an error in fetching the instructor courses", error);
    toast.error("Failed to fetch courses");
  }
  toast.dismiss(toastId);
  return result;
}


export async function getInstructorData(token){
  const toastId = toast.loading("Loading...")
  let result = [];

  try {
    
    const response = await apiConnector(
      'GET',
      GET_INSTRUCTOR_DATA_API,
      null,
      {
        Authorization: `Bearer ${token}`
      }
    )

    console.log("GET ISNTRUCTOR COURSES IN INSTRUCTORDATA",response.data.courses)
    result = response?.data.courses

  } catch (error) {
    console.log("Errpr here at InstructorData: ",error)
  }
  toast.dismiss(toastId)
  return result;

}
