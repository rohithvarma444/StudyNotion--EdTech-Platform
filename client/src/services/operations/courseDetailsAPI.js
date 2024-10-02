import { toast } from "react-hot-toast"
import { courseEndpoints } from "../apis"
import { apiConnector } from "../apiconnector"

const {
    GET_ALL_COURSE_API,
    COURSE_DETAILS_API,
    EDIT_COURSE_API,
    COURSE_CATEGORIES_API,
    CREATE_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    LECTURE_COMPLETION_API,
    CREATE_RATING_API
} = courseEndpoints


//fetching all the courses
export const getAllCourses = async () => {
    const toastId = toast.loading("Loading...")
    let result = []

    try {
        const response = await apiConnector(
            'GET',
            GET_ALL_COURSE_API,
            null,
        )

        if (!response?.data?.success) {
            throw new Error(response?.data?.message)
        }

        result = response?.data?.data
    } catch (error) {
        toast.error("Error in fetching courses")
        console.log("Error in getAllCourses:", error)
    }

    toast.dismiss(toastId)
    return result
}

//fetching specific courseDetails
export const fetchCourseDetails = async (courseId) => {
    const toastId = toast.loading("Loading...")
    let result = null

    try {
        const response = await apiConnector(
            'POST',
            COURSE_DETAILS_API,
            { courseId }, 
        )

        if (!response?.data?.success) {
            throw new Error(response.data.message)
        }

        result = response?.data?.data
    } catch (error) {
        toast.error("Error in fetching the course details")
        console.log("Error in fetchCourseDetails:", error)
    }

    toast.dismiss(toastId)
    return result
}

//fetching tags
export const fetchCourseCategories = async () => {
    const toastId = toast.loading("Loading...");
    let result = [];
    try {
        const response = await apiConnector('GET', COURSE_CATEGORIES_API);

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
    } catch (error) {
        toast.error("Error in fetching course categories");
        console.log("Error in fetchCourseCategories:", error);
    }
    toast.dismiss(toastId);
    return result;
};

// Add Course Details
export const addCourseDetails = async (data, token) => {
    const toastId = toast.loading("Loading...");
    console.log("Printing DATA",data[0]);
    let result;
    try {
        const response = await apiConnector('POST', CREATE_COURSE_API, data, {
                Authorization: `Bearer ${token}`,
            });

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        toast.success("Updated the course details successfully");
        result = response?.data?.data;
    } catch (error) {
        toast.error("Error in updating the course details, try again later");
        console.log("Error in addCourseDetails:", error);
    }
    toast.dismiss(toastId);
    return result;
};

export const editCourseDetails = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", EDIT_COURSE_API, data, {
        "Content-Type": "multipart/form-data",
        Authorisation: `Bearer ${token}`,
      })
      console.log("EDIT COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Update Course Details")
      }
      toast.success("Course Details Updated Successfully")
      result = response?.data?.data
    } catch (error) {
      console.log("EDIT COURSE API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }

//creating a section
export const createSection = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector(
            'POST',
            CREATE_SECTION_API,
            data,
            {
                    Authorization: `Bearer ${token}`
            }
        );

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
        toast.success("Section created successfully");
    } catch (error) {
        toast.error("Error in creating the section");
        console.log("Error in createSection:", error);
    }
    toast.dismiss(toastId);
    return result;
};

// creating subsection
export const createSubSection = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector(
            'POST',
            CREATE_SUBSECTION_API,
            data,
            {
                    Authorization: `Bearer ${token}`
            }
        );

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
        toast.success("Subsection created successfully");
    } catch (error) {
        toast.error("Error in creating the subsection");
        console.log("Error in createSubSection:", error);
    }
    toast.dismiss(toastId);
    return result;
};


export const updateSection = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    console.log(token);
    try {
        const response = await apiConnector(
            'POST',
            UPDATE_SECTION_API,
            data,
            {
                Authorization: `Bearer ${token}`
            }
        );

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
        toast.success("Section updated successfully");
    } catch (error) {
        toast.error("Error in updating Section");
        console.log("Error in updateSubsection:", error);
    }
    toast.dismiss(toastId);
    return result;
};

export const updateSubSection = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector(
            'POST',
            UPDATE_SUBSECTION_API,
            data,
            {
                    Authorization: `Bearer ${token}`
            }
        );

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
        toast.success("Subsection updated successfully");
    } catch (error) {
        toast.error("Error in updating the subsection");
        console.log("Error in updateSubsection:", error);
    }
    toast.dismiss(toastId);
    return result;
};

export const deleteSection = async(data,token) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector(
            'POST',
            DELETE_SECTION_API,
            data,
            {
                    Authorization: `Bearer ${token}`
            }
        );

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
        toast.success("Section deleted successfully");
    } catch (error) {
        toast.error("Error in deleting the section");
        console.log("Error in deleteSection:", error);
    }
    toast.dismiss(toastId);
    return result;
}

export const deleteSubSection = async(data,token) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector(
            'POST',
            DELETE_SUBSECTION_API,
            data,
            {
                    Authorization: `Bearer ${token}`
            }
        );

        if (!response?.data?.success) {
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
        toast.success("SubSection deleted successfully");
    } catch (error) {
        toast.error("Error in deleting the Subsection");
        console.log("Error in deleteSubSection:", error);
    }
    toast.dismiss(toastId);
    return result;
}

export const deleteCourse = async (data, token) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE COURSE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Delete Course")
      }
      toast.success("Course Deleted")
    } catch (error) {
      console.log("DELETE COURSE API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
}

export const fetchInstructorCourses = async (token) => {
    let result = []
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        "GET",
        GET_ALL_INSTRUCTOR_COURSES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
      console.log("INSTRUCTOR COURSES API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Fetch Instructor Courses")
      }
      result = response?.data?.data
    } catch (error) {
      console.log("INSTRUCTOR COURSES API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result;
  }
  // get full details of a course
  export const getFullDetailsOfCourse = async (courseId, token) => {
    const toastId = toast.loading("Loading...")
    //   dispatch(setLoading(true));
    let result = null
    try {
      const response = await apiConnector(
        "POST",
        GET_FULL_COURSE_DETAILS_AUTHENTICATED,
        {
          courseId,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      )
      console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      result = response?.data?.data
    } catch (error) {
      console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
      result = error.response.data
      // toast.error(error.response.data.message);
    }
    toast.dismiss(toastId)
    //   dispatch(setLoading(false));
    return result
  }
  
  // mark a lecture as complete
  export const markLectureAsComplete = async (data, token) => {
    let result = null
    console.log("mark complete data", data)
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log(
        "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
        response
      )
  
      if (!response.data.message) {
        throw new Error(response.data.error)
      }
      toast.success("Lecture Completed")
      result = true
    } catch (error) {
      console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
      toast.error(error.message)
      result = false
    }
    toast.dismiss(toastId)
    return result
  }
  
  // create a rating for course
  export const createRating = async (data, token) => {
    const toastId = toast.loading("Loading...")
    let success = false
    try {
      const response = await apiConnector("POST", CREATE_RATING_API, data, {
        Authorization: `Bearer ${token}`,
      })
      console.log("CREATE RATING API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Create Rating")
      }
      toast.success("Rating Created")
      success = true
    } catch (error) {
      success = false
      console.log("CREATE RATING API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return success
  }