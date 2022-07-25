import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
//create a dataset for the chart MapPerformance that passes props for correct and incorrect

function QuizPerformance (props) {
    let data = {
        datasets: [
          {
            label: '# of Votes',
            data: [props.correct, props.incorrect],
            backgroundColor: [
              'green',
              'red',
            ],
            borderWidth: 1,
          },
        ]
    };
    return ( <div className="doughnut-chart"><Doughnut data={data}/></div> )
}



export default QuizPerformance;