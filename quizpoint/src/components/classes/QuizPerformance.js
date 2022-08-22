import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
//create a dataset for the chart MapPerformance that passes props for correct and incorrect

function QuizPerformance(props) {
  /* Props:
    props.total 
    props.correct
    props.incorrect
    props.type (input: doughnut or bar)
  */
  console.log(props.type)
  let quizInfo = {
    total: props.total,
    correct: props.correct,
    incorrect: props.incorrect
  }
  let barPercentage;
  // If the quiz has never been done, this makes it so something displays
  if (props.total === undefined) {
    quizInfo.total = 1;
    quizInfo.correct = 0;
    quizInfo.incorrect = 0;
  }
  
  let options = {
    //turn off labels
    plugins: {
      legend: {
        maxHeight: 50,
        // labels font color white
        labels: {
          boxWidth: 20,
          padding: 6,
          color: 'white',
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      }
    }


}
  let data = {
    labels: ['Correct', 'Incorrect', 'Unanswered'],
    datasets: [
      {
        data: [quizInfo.correct, quizInfo.incorrect, (quizInfo.total - quizInfo.correct + quizInfo.incorrect)],
        backgroundColor: [
          '#16a34a',
          '#dc2626',
          '#dbeafe',
        ],
        hoverBackgroundColor: [
          '#15803d',
          '#b91c1c',
          '#bfdbfe',
        ],
      },
    ]
  };
  //Render a bar chart is type is bar
  if (props.type === "bar") { 
    let barPercentage = (quizInfo.correct / quizInfo.total) * 100;
    return (
      <div className ="w-5/6 bg-blue-100 h-16 rounded-md">
        <div className ={`bg-emerald-600 h-16 text-lg underline underline-offset-4 font-medium text-blue-100 items-center flex justify-center leading-none rounded-md rounded-r-none`} style={{width: `${barPercentage}%`}}>{Math.round(Number(barPercentage))}%</div>
      </div>
    )
  } else {
  //Render a doughnut chart if type is doughnut or default
    return (<div className="relative pt-2 h-48 w-48 font-white"><Doughnut options={options} data={data}/></div> )
  }
}


export default QuizPerformance;