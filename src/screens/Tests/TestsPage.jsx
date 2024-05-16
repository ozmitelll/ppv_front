import {Card, CardHeader} from "../../components/ui/card";
import {useEffect, useState} from "react";
import {getQuizzes} from "../../service/quiz.service";
import {CreateQuizForm} from "./CreateQuizForm";
import {getID, isAdmin} from "../../service/auth.service";
import {toast, ToastContainer} from "react-toastify";
import {Button} from "../../components/ui/button";
import {useHistory} from "react-router-dom";

const TestsPage = () => {
    const history = useHistory()
    const [quizzes, setQuizzes] = useState([])

    useEffect(() => {
        const ids = getID()
        getQuizzes(ids)
            .then(quizzes => {
                setQuizzes(quizzes);
            })
            .catch(error => console.error('Failed to fetch quizzes:', error));
    }, [])

    const handleAddQuiz = (newQuiz) => {
        setQuizzes(prevQuizzes => [...prevQuizzes, newQuiz]);
    }

    const handleQuizAbout = (id) => {
        history.push(`/quizzes/${id}`)
    }
    const handleQuizStart = (id) => {
        history.push(`/quizzes/${id}/test`)
    }

    return (
        <div className={'flex flex-col justify-center items-center w-[100vw] h-[100vh] px-10 py-24'}>
            <h1 className={'text-center font-bold text-3xl py-4'}>Тести для професійно-психологічного відбору</h1>
            {isAdmin() ? <CreateQuizForm onQuizCreate={handleAddQuiz}/> : <></>}
            {quizzes.length> 0? <div className={'grid grid-cols-4 gap-4 pt-6'}>
                {quizzes.map((quiz, index) => (
                    <Card key={index} className={'hover:scale-105 ease-in-out transition hover:border-black h-full'}>
                        <CardHeader className={'h-3/5'}>
                            <div><p className={'text-xl font-bold line-clamp-2'}>{quiz.title}</p><p
                                className={'text-sm text-gray-400 h-4'}>ID: {quiz.id}</p></div>
                        </CardHeader>
                        <div className={'flex justify-between items-center p-6'}><p className={'text-sm'}>Кількість
                            питань: {quiz.question_count}</p>{isAdmin() ?
                            <Button onClick={(id) => handleQuizAbout(quiz.id)}>Налаштування</Button> :
                            <Button onClick={(id) => handleQuizStart(quiz.id)} disabled={quiz.question_count> 0 ? false: true}>Проходити</Button>}</div>
                    </Card>
                ))}
            </div> : <h1>Ви пройшли всі доступні вам тести!</h1>}
            <ToastContainer position={"bottom-right"} theme={"dark"} hideProgressBar={true}/>
        </div>
    )
}

export default TestsPage