import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
//create a dataset for the chart MapPerformance that passes props for correct and incorrect

function QuizPerformance(props) {
  let quizInfo = {
    total: props.total,
    correct: props.correct,
    incorrect: props.incorrect
  }
  if (props.total === undefined) {
    quizInfo.total = 1;
    quizInfo.correct = 0;
    quizInfo.incorrect = 0;
  }
  let data = {
    labels: ['Correct', 'Incorrect', 'Unanswered'],
    datasets: [
      {
        data: [quizInfo.correct, quizInfo.incorrect, (quizInfo.total - quizInfo.correct - quizInfo.incorrect)],
        backgroundColor: [
          'rgb(34 197 94)',
          'rgb(244 63 94)',
          'rgb(163 163 163)',
        ],
        borderWidth: 1,
      },
    ]
  };
  return (<div className="doughnut-chart"><Doughnut data={data} /></div>)
}


export default QuizPerformance;