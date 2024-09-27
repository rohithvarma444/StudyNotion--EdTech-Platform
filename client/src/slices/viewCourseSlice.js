import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courseSections: [],
    courseEntriesData: [],
    completedLectures: [],
    totalNoOfLectures: 0,
}

const viewCourseSlice = createSlice({
    setCourseSections: (state,action) => {
        state.courseSections = action.payload
    },
    setCourseEntries: (state,action) => {
        state.courseEntriesData = action.payload
    },
    setCompletedLectures: (state,action) => {
        state.completedLectures =  action.payload
    },
    setTotalNoOfLectures: (state,action) => {
        state.totalNoOfLectures = action.payload
    }
})


export const {
    setCompletedLectures,
    setCourseEntries,
    setCourseSections,
    setTotalNoOfLectures
} = viewCourseSlice.actions

export default viewCourseSlice.reducer