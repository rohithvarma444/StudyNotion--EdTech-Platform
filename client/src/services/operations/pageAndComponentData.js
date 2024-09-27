import { toast } from "react-hot-toast";
import { catalogData } from "../apis";
import { apiConnector } from "../apiconnector";

export const getCatalogPageData = async (catalogId) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector(
            'POST',
            catalogData.CATALOGPAGEDATA_API,
            { categoryId: catalogId }  
        );

        if (!response?.data.success) {
            throw new Error(response.data.message);
        }

        result = response?.data;
    } catch (error) {
        console.log("There is an error in fetching the CategoryCourses"); 
        toast.error("Couldn't fetch category courses");
    }
    toast.dismiss(toastId);
    return result;
};
