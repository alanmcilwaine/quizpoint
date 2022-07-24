import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// const QuizPerformance = (props) => {
//   datasets: [
//     {
//       label: '# of Votes',
//       data: [props.correct, props.incorrect],
//       backgroundColor: [
//         'green',
//         'red',
//       ],
//       borderWidth: 1,
//     },
//   ],
// }

export default QuizPerformance;