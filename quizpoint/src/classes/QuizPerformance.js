import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
//create a dataset for the chart MapPerformance that passes props for correct and incorrect

function QuizPerformance (props) {
    let data = {
      labels: ['Correct', 'Incorrect', 'Unanswered'],
      datasets: [
        {
          data: [props.correct, props.incorrect, (props.total - props.correct - props.incorrect)],
          backgroundColor: [
            'rgb(34 197 94)',
            'rgb(244 63 94)',
            'rgb(163 163 163)',
          ],
          borderWidth: 1,
        },
      ]
    };
    return ( <div className="doughnut-chart"><Doughnut data={data}/></div> )
}



export default QuizPerformance;