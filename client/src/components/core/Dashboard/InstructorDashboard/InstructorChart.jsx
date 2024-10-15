import React from 'react'

import {Chart,registerables} from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useState } from 'react'

Chart.register(...registerables)


function InstructorChart({courses}) {



    const [currChart,setCurrChart] = useState("student")
    

    const getRandomColors = (numOfColors) => {
        const colors = [];
        for(let i=0;i<numOfColors;i++){
            const color = `rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`
            colors.push(color);
        }

        return colors;

    }


    // for student Data

    const chartForStudents = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalStudentsEnrolled),
                backgroundColor: getRandomColors(courses.length)
            }
        ]
    }

    // for money Data

    const chartForIncome = {
        labels: courses.map((course)=> course.courseName),
        datasets: [

            {
                data: courses.map((course) => course.totalStudentsEnrolled),
                backgroundColor: getRandomColors(courses.length)
            }
        ]
    }

    //create options
    const options = {

    }

  return (
    <div className="p-10 bg-gray-800 rounded-lg shadow-lg bg-richblack-700 p-5 w-full ">
    <h2 className="text-2xl font-bold text-white mb-4">Visualize</h2>
    
    <div className="flex gap-x-5 mb-5">
        <button
            onClick={() => setCurrChart("student")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${currChart === "student" ? 'bg-yellow-400 text-gray-800' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
        >
            Students
        </button>
        
        <button
            onClick={() => setCurrChart("income")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${currChart === "income" ? 'bg-yellow-400 text-gray-800' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
        >
            Income
        </button>
    </div>

    <div className="flex justify-center">
        <Pie
            data={currChart === "students" ? chartForStudents : chartForIncome}
            options={options}
        />
    </div>
</div>

  )
}

export default InstructorChart