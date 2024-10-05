import React from 'react'

import {Chart,registerables} from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useState } from 'react'

Chart.register(...registerables)


function InstructorChart({courses}) {



    const [currChart,setCurrChart] = useState("student")
    

    //function to  generate radom colors
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
    <div>
        <p>Visualise</p>
        <div className='flex gap-x-5'>
            <button
            onClick={() => setCurrChart("students")}
            >
                Student
            </button>
            <button
            onClick={() => setCurrChart("income")}
            >
                Income
            </button>
        </div>

        <Pie
        data={currChart === "student" ? chartForStudents :  chartForIncome}
        options={options}
        />
    </div>
  )
}

export default InstructorChart