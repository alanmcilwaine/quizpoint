import Dropdown from '../construct/Dropdown'
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
function CreateQuizTable(props) {
    //Props: 
    // props.question -- list of questions
    // props.hasQuestion -- if the user hasn't made any questions yet
    console.log(props.hasQuestion)
    console.log(props.question)
    if (!props.hasQuestion) {
        return(
            <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                    <table class="min-w-full border">
                        <thead class="bg-white border-b">
                            <tr>
                            <th scope="col" class="text-sm font-medium text-black px-6 py-4 text-left">
                                #
                            </th>
                            <th scope="col" class="text-sm font-medium text-black px-6 py-4 text-left">
                                Name:
                            </th>
                            <th scope="col" class="text-sm font-medium text-black px-6 py-4 text-left">
                                Answers:
                            </th>
                            <th scope="col" class="text-sm font-medium text-black px-6 py-4 text-left">
                                Correct Answer:
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-gray-100 border-b">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-black"></td>
                                    <td class="text-sm text-black px-6 py-4 whitespace-nowrap">
                                        
                                    </td>
                                    <td class="text-sm text-black px-6 py-4 whitespace-nowrap">
                                        
                                    </td>
                                    <td class="text-sm text-black px-6 py-4 whitespace-nowrap">
                                        
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
        )
    }
    return(
        <div class="flex flex-col">
            <div class="sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full sm:px-6 lg:px-8">
                <div class="">
                    <table class="min-w-full border">
                        <thead class="bg-white border-b">
                            <tr>
                            <th scope="col" class="text-sm font-medium text-black px-6 py-4 text-left">
                                #
                            </th>
                            <th scope="col" class="text-sm font-medium text-black px-6 py-4 text-left">
                                Name:
                            </th>
                            <th scope="col" class="text-sm font-medium text-black px-6 py-4 text-left">
                                Answers:
                            </th>
                            <th scope="col" class="text-sm font-medium text-black px-6 py-4 text-left">
                                Correct Answer:
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.question.map((question, index) => {
                                return (
                                    <tr class="bg-gray-100 border-b">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{index + 1}</td>
                                        <td class="text-sm text-black px-6 py-4 whitespace-nowrap">
                                            {props.question[index].title}
                                        </td>
                                        <td class="text-sm text-black px-6 py-4 whitespace-nowrap">
                                            <Dropdown question={props.question}/>
                                        </td>
                                        <td class="text-sm text-black px-6 py-4 whitespace-nowrap">
                                            Test Name
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
    )
}
export default CreateQuizTable;