import { useNavigate } from 'react-router-dom';

const ClassCards = (props) => {
    let navigate = useNavigate()
    console.log(props.classInfo)
    return (
        <>    
    <div className="bg-indigo-900 w-[21rem] h-[23rem] rounded-lg border-slate-300 border px-2 py-2">
        <div className="w-auto h-20 rounded-t-lg">
            <p className="flex justify-center items-center text-medium font-medium text-2xl w-full h-full text-white">{props.classInfo.className}</p>

        </div>
        <div className="h-auto">
            <button onClick={() => navigate('/class/' + props.classInfo.code)}>Go to class</button>
            <p className="flex items-end text-white">Created By: {props.classInfo.classCreator}</p>
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