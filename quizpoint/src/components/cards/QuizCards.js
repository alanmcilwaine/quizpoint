import QuizPerformance from '../classes/QuizPerformance'
const QuizCards = (props) => {
    /*
    Props: 
        props.quiz
        props.user
        props.page (ClassPage, HomePage)
        props.graphType (doughnut or bar)
        props.status (completed or assigned)
    */
   let quizCode = props.quiz.code;
   let quizPath = props.user.quizzes;
   if (props.status === "completed") {
        console.log(props.user.quizzes.turnedin[quizCode].score)
   } else {
        console.log(props.user.quizzes.active[quizCode].score)
   }


    return (
        <div className="bg-slate-100 shadow-md w-[21rem] h-[23rem] rounded-lg border-slate-300 border">
            <div className="w-auto h-20 rounded-t-lg">
                <div className="flex bg-indigo-800 rounded-t-lg shadow-md justify-center items-center min-h-[5rem] text-white font-medium text-lg border-b-[1px]">{props.quiz.name}</div>
            </div>
            <div className="h-auto">
                <div className="flex justify-center items-center min-h-[10rem]">
                    {props.graphType === "bar" && <QuizPerformance correct={quizPath.active[quizCode].score.correct} incorrect={quizPath.active[quizCode].score.incorrect} total={quizPath.active[quizCode].score.total} type="bar"/>}
                    {props.graphType === "doughnut" && <QuizPerformance correct={quizPath.turnedin[quizCode].score.correct} incorrect={quizPath.turnedin[quizCode].score.incorrect} total={quizPath.turnedin[quizCode].score.total} type="doughnut"/>}
                </div>
                <div className="flex h-20 pt-2 align-middle justify-center items-center rounded-b-lg ">
                    {props.graphType === "bar" && <a href={`/quiz/${props.quiz.code}`}><button className="overflow-hidden bg-indigo-700 relative before:absolute before:bg-primary-100 before:bottom-0 before:left-0 before:h-full before:w-full before:-translate-x-full hover:before:translate-x-0 before:transition before:ease-in-out before:duration-500"><p className="relative z-0 text-white transition ease-in-out duration-500">Start Quiz</p></button></a>}
                    {props.graphType === "doughnut" && <a href={`/quiz/${props.quiz.code}`}><button className="overflow-hidden relative before:absolute bg-indigo-700 before:bg-primary-100 before:bottom-0 before:left-0 before:h-full before:w-full before:-translate-x-full hover:before:translate-x-0 before:transition before:ease-in-out before:duration-500"><p className="relative z-0 text-white transition ease-in-out duration-500">Resubmit</p></button></a>}
                </div>
            </div>
        </div> 
    )
}
 
export default QuizCards;