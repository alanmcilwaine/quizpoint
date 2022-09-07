import { useNavigate } from 'react-router-dom';

const ClassCards = (props) => {
    let navigate = useNavigate()
    console.log(props.classInfo)
    return (
        <>    
    <div className="bg-slate-500 w-[21rem] h-[23rem] rounded-lg p-4 shadow-md">
        <div className="w-auto h-20 rounded-t-lg flex basis-1/3 flex-col">
            <p className="flex justify-start items-center text-medium font-medium text-3xl w-full h-full text-white">{props.classInfo.className}</p>
            <p className="flex text-white text-xl">{props.classInfo.classCreator}</p>
        </div>
        <div className="h-2/3 flex basis-2/3 items-end">
            <button className="p-8 h-24 w-full border-slate-400 border-3 bg-slate-100 text-slate-800" onClick={() => navigate('/class/' + props.classInfo.code)}><p className="text-xl underline underline-offset-8">Open Class</p></button>
        </div>

    </div>
    </>

    // <div className="bg-primary-300 shadow-md w-[21rem] h-[23rem] rounded-lg border-slate-300 border">
    //     <div className="w-auto h-20 rounded-t-lg">
    //         <div className="flex bg-primary-100 rounded-t-lg shadow-md justify-center items-center min-h-[5rem] text-white font-medium text-lg border-b-[1px]">{props.quiz.name}</div>
    //     </div>
    //     <div className="h-auto">
    //         <div className="flex justify-center items-center min-h-[10rem]">
    //             {props.graphType === "bar" && <QuizPerformance correct={quizPath.active[quizCode].score.correct} incorrect={quizPath.active[quizCode].score.incorrect} total={quizPath.active[quizCode].score.total} type="bar"/>}
    //             {props.graphType === "doughnut" && <QuizPerformance correct={quizPath.turnedin[quizCode].score.correct} incorrect={quizPath.turnedin[quizCode].score.incorrect} total={quizPath.turnedin[quizCode].score.total} type="doughnut"/>}
    //         </div>
    //         <div className="flex h-20 pt-2 align-middle justify-center items-center rounded-b-lg ">
    //             {props.graphType === "bar" && <a href={`/quiz/${props.quiz.code}`}><button className="overflow-hidden relative before:absolute before:bg-primary-100 before:bottom-0 before:left-0 before:h-full before:w-full before:-translate-x-full hover:before:translate-x-0 before:transition before:ease-in-out before:duration-500"><p className="relative z-0 text-black transition ease-in-out duration-500">Start Quiz</p></button></a>}
    //             {props.graphType === "doughnut" && <a href={`/quiz/${props.quiz.code}`}><button className="overflow-hidden relative before:absolute before:bg-primary-100 before:bottom-0 before:left-0 before:h-full before:w-full before:-translate-x-full hover:before:translate-x-0 before:transition before:ease-in-out before:duration-500"><p className="relative z-0 text-black transition ease-in-out duration-500">Resubmit</p></button></a>}
    //         </div>
    //     </div>
    // </div> 
    )
}

export default ClassCards;