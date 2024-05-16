import {useHistory, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    addAnswersToQuestion,
    createQuizQuestion,
    deleteQuestion,
    getAnswersToQuestion,
    getQuiz,
    saveQuiz
} from "../../service/quiz.service";
import {Textarea} from "../../components/ui/textarea";
import {Accordion} from "../../components/ui/accordion";
import {Card, CardHeader} from "../../components/ui/card";
import {Input} from "../../components/ui/input"
import {toast, ToastContainer} from "react-toastify";
import {EditIcon, XIcon} from "lucide-react";
import {Button} from "../../components/ui/button";
import {Checkbox} from "../../components/ui/checkbox";

const Quiz = () => {
    const history = useHistory()
    const {id} = useParams()
    const [quiz, setQuiz] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [quizTime, setQuizTime] = useState(0)
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [newAnswerText, setNewAnswerText] = useState('');
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        setLoading(true);
        getQuiz(id)
            .then(response => {
                setQuiz(response);
                setQuizDescription(response.description);
                setQuizTime(response.time_for_test)
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }


    const handleQuestionCreate = async () => {
        try {
            if (newQuestionText.trim()) {
                const newQuestion = await createQuizQuestion(newQuestionText, id);
                setQuiz(prevState => ({
                    ...prevState,
                    questions: [...prevState.questions, newQuestion] // Append new question to the existing questions array
                }));
                setNewQuestionText(''); // Clear input after adding
                setShowModal(false); // Close modal after adding
            } else{
                toast.info('Заповніть поле для питання!')
            }
        } catch (error) {
            console.error('Error creating question:', error);
            alert('Не вдалося створити питання!');
        }
    };

    const handleSaveQuiz = async () => {
        try {
            if (quiz.description == null && quiz.time_for_test == 0) {
                await saveQuiz(quizDescription, quizTime, id);
                toast.success('Опис тесту успішно збережено!');
                window.location.reload()
            } else {
                toast.success('Налаштування тесту успішно збережено!');
            }
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert('Помилка при збереженні опису тесту!');
        }
    };

    const handleDeleteQuestion = async (question_id) => {
        try {
            await deleteQuestion(id, question_id);
            setQuiz(prevState => ({
                ...prevState,
                questions: prevState.questions.filter(q => q.id !== question_id)
            }));
            toast.info('Питання було видалено!');
        } catch (error) {
            console.error('Error deleting question:', error);
            toast.error('Не вдалося видалити питання!');
        }
    }

    const handleEditQuestion = async (question) => {
        setSelectedQuestion(question);
        setShowAnswerModal(true);
        setAnswers(await getAnswersToQuestion(id, question.id))
    };

    const handleAddAnswer = () => {
        if (newAnswerText.trim()) {
            const newAnswer = {
                text: newAnswerText,
                is_correct: isCorrect,
            };
            setAnswers([...answers, newAnswer]);
            setNewAnswerText('');
            setIsCorrect(false);
        }
        console.log(answers)
    };

    const handleDeleteAnswer = (index) => {
        const updatedAnswers = answers.filter((_, idx) => idx !== index);
        setAnswers(updatedAnswers);
    };

    const handleCheckboxChange = (event) => {
        console.log(isCorrect)
        setIsCorrect(!isCorrect)
    };

    const handleSubmitAnswers = async () => {
        if(answers.length>=2) {
            await addAnswersToQuestion(id, selectedQuestion.id, answers)
            setAnswers([])
            setNewAnswerText('');
            setIsCorrect(false);
            setShowAnswerModal(false)
            toast.success('Відповіді на питання були створені!')
        } else{
            toast.info('Відповідей на питання повинно бути більше або рівно 2!')
        }
    }
    // console.log(quiz)

    const handleBack = () => {
        history.push('/quizzes')
    }

    const handleToResults = () => {
        history.push(`/quizzes/${id}/results`);
    }

    return (
        <div className={'w-[100vw] h-[100vh] flex flex-col justify-around'}>
            <div className={'flex items-center justify-around'}>
                <div className={'flex flex-col w-1/2 p-8 h-[400px]'}>
                    <p className={'text-3xl py-4'}><b>{quiz.title}</b></p>
                    {quiz.description ? <div className={'flex flex-col items-start w-full'}><p
                            className={'text-xl font-bold w-full border-b-2'}>Опис тесту</p><p
                            className={'pt-2'}>{quiz.description}</p></div> :
                        <Textarea className={'resize-none h-full'} placeholder={'Напишіть детальніше про тест'}
                                  value={quizDescription}
                                  onChange={(e) => setQuizDescription(e.target.value)}></Textarea>
                    }
                    {quiz.time_for_test != 0 ? <div className={'flex items-center  gap-4 py-4'}><p
                            className={'text-xl font-bold border-b-2'}>Час на проходження тесту: </p><p
                            className={'text-xl'}>{quiz.time_for_test} хвилин</p></div> :
                        <Input placeholder={'Час на проходження тесту (в хвилинах)'} type={'number'}
                               onChange={(e) => setQuizTime(e.target.value)} className={'my-2'}/>}
                </div>
                <div className={'flex flex-col w-1/2 p-8'}>
                    <div className={'flex justify-center items-center gap-10'}>
                        <Button className={'w-1/4 hover:bg-white hover:border-2 hover:border-black hover:text-black'}
                                onClick={handleToResults}>Результати</Button>
                        <Button className={'w-1/4 hover:bg-white hover:border-2 hover:border-black hover:text-black'}
                                onClick={handleBack}>Повернутись до тестів</Button>
                    </div>
                    <p className={'text-3xl py-4'}>Питання тесту</p>
                    {quiz.questions.length > 0 ? <Accordion type={'single'} collapsible>
                            {quiz.questions.map((question, index) => (
                                <Card key={index}
                                      className={'hover:scale-105 h-10 transition ease-in-out duration-500 hover:border-black cursor-pointer'}>
                                    <CardHeader
                                        className={'text-left p-0 py-2 px-4 flex flex-row justify-between hover:font-bold transition duration-500 ease-in-out'}>{index + 1}: {question.text}
                                        <div className={'flex gap-4'}>
                                            <EditIcon
                                                className={'hover:text-yellow-500 ease-in-out transition duration-500'}
                                                onClick={() => handleEditQuestion(question)}>
                                            </EditIcon>
                                            <XIcon
                                                className={'hover:text-red-500 ease-in-out transition duration-500'}
                                                onClick={() => handleDeleteQuestion(question.id)}/>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                            <Card
                                className={'hover:scale-105 h-10 my-2 bg-black transition ease-in-out duration-500 hover:border-black cursor-pointer'}>
                                <CardHeader className={'text-center p-0 py-2 text-white'}
                                            onClick={() => setShowModal(true)}>Додати питання</CardHeader>
                            </Card>
                        </Accordion> :
                        <Card
                            className={'hover:scale-105 h-10 my-2 bg-black transition ease-in-out duration-500 hover:border-black cursor-pointer'}>
                            <CardHeader className={'text-center  p-0 py-2   text-white'}
                                        onClick={() => setShowModal(true)}>Додати питання</CardHeader>
                        </Card>
                    }
                </div>
            </div>
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    {/* Оверлей */}
                    <div
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-1/3"> {/* Модальне вікно */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Нове питання</h2>
                            <button
                                className="text-xl font-semibold text-gray-800 hover:text-gray-600"
                                onClick={() => setShowModal(false)}
                            >
                                &#10005; {/* Unicode символ X */}
                            </button>
                        </div>
                        <Input className={'mt-4'} placeholder="Назва питання" value={newQuestionText}
                               onChange={(e) => setNewQuestionText(e.target.value)}
                        />
                        <div className="flex justify-between mt-4">
                            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    onClick={handleQuestionCreate}
                            >
                                Створити питання
                            </button>
                        </div>
                    </div>
                </>
            )}
            {showAnswerModal && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                    {/* Оверлей */}
                    <div
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-1/3"> {/* Модальне вікно */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Обране питання - ({selectedQuestion.text})</h2>
                            <button
                                className="text-xl font-semibold text-gray-800 hover:text-gray-600"
                                onClick={() => setShowAnswerModal(false)}
                            >
                                &#10005; {/* Unicode символ X */}
                            </button>
                        </div>

                        <div className={'flex flex-col'}>
                            <p className={'border-b-2 py-2'}>Додати відповідь</p>
                            {answers.map((answer, index) => (

                                <div key={index} className="flex items-center justify-center gap-2 py-2">
                                    <XIcon onClick={() => handleDeleteAnswer(index)} className="">
                                        &minus;
                                    </XIcon>
                                    <Input
                                        value={answer.text}
                                        disabled
                                    />
                                    <Checkbox
                                        checked={answer.is_correct}
                                        disabled
                                    />
                                </div>
                            ))}
                            <div className="flex items-center justify-center gap-2 py-2">
                                <Input
                                    placeholder="Текст відповіді"
                                    value={newAnswerText}
                                    onChange={(e) => setNewAnswerText(e.target.value)}
                                />
                                <Checkbox
                                    id="answer"
                                    checked={isCorrect}
                                    onClick={(e) => handleCheckboxChange(e)}
                                />
                                <label htmlFor="answer"
                                       className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Правильна
                                </label>
                            </div>
                            <div className={'flex items-center justify-between py-2'}>
                                <Button onClick={handleAddAnswer} className={''}>Додати відповідь</Button>
                                <Button onClick={handleSubmitAnswers} className={'bg-gray-600'}>Зберегти</Button>

                            </div>

                        </div>

                    </div>
                </>
            )}
            <div className={'pl-8 w-1/4'}>
                <Card
                    className={'hover:scale-105 f h-10 my-2 bg-black transition ease-in-out duration-500 hover:border-black cursor-pointer'}>
                    <CardHeader className={'text-center p-0 py-2 text-white'}

                                onClick={handleSaveQuiz}>Зберегти налаштування тесту </CardHeader>
                </Card>
            </div>
            <ToastContainer position={"bottom-right"} theme={"dark"} hideProgressBar={true}/>
        </div>
    )
}

export default Quiz