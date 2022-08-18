import QuizPerformance from '../classes/QuizPerformance'
const QuizCards = (props) => {
    console.log(props.name)
    console.log(props.user)
    return (
        <div className="bg-primary-200 shadow-md w-72 h-72 rounded-lg border-slate-300 border">
            <div className="w-auto h-20 rounded-t-lg">
                <div className="flex bg-primary-100 rounded-t-lg shadow-md justify-center items-center min-h-[5rem] text-white font-medium text-lg border-b-[1px]">{props.name}</div>
            </div>
            <div className="flex justify-center items-center">
                {/* <QuizPerformance correct={0} incorrect={0} total={1}/> */}
            </div>
        </div> 
    )
}
 
export default QuizCards;