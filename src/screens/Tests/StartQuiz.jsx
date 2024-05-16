import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {completeQuiz, getQuiz} from "../../service/quiz.service";
import {Button} from "../../components/ui/button";
import {useHistory} from 'react-router-dom';
import {Check} from "lucide-react";
import {getID} from "../../service/auth.service";  // import useHistory to navigate after quiz completion

const StartQuiz = () => {
    const {id} = useParams();
    const history = useHistory();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timer, setTimer] = useState(0);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        setLoading(true);
        getQuiz(id)
            .then(response => {
                setQuiz(response);
                setTimer(response.time_for_test * 60); // Initialize timer in seconds
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load quiz:", err);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (completed) {
            console.log('Final score at finish:', score);
            completeQuiz(id, getID(), score).finally(() => {
                setTimeout(() => {
                    history.push('/quizzes'); // Adjust the path as needed for your application
                }, 2000); // Delay in milliseconds (2000 ms = 2 seconds)
            });
        }
    }, [completed, score]);

    useEffect(() => {
            const interval = !loading && timer > 0 ? setInterval(() => {
                    setTimer(t => {
                        if (t === 1) { // When the timer hits zero on the next tick
                            autoFinishQuiz(); // Call the finish function when time runs out
                        }
                        return t - 1
                    });
                }, 1000)
                :
                null;
            return () => clearInterval(interval);
        }, [loading, timer]
    )
    ;


    const handleAnswer = (questionId, answer) => {
        if (answer.is_correct) {
            setScore(prevScore => {
                const newScore = prevScore + 1;
                return newScore;
            });
        }
        nextQuestion()
    };

    const autoFinishQuiz = () => {
        if (!completed) { // Check if the quiz isn't already marked as completed
            setScore(0);  // Set score to 0 because time ran out
            setCompleted(true); // Mark as completed to prevent re-entry
            completeQuiz(id, getID(), 0) // Send completion data to server
                .then(() => {
                    history.push('/quizzes'); // Redirect to the quizzes page
                })
                .catch(err => {
                    console.error("Error completing quiz on timeout:", err);
                });
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setCompleted(true)
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    const handleToQuizzes = () => {
        history.push('/quizzes')
    }

    if (completed) {
        return <div className='w-full h-screen flex flex-col items-center justify-center gap-10'>
            <div className={'rounded-full bg-green-500 w-[100px] h-[100px] flex items-center justify-center'}><Check
                className={'scale-150 text-white'}></Check></div>
            <h1 className={'text-2xl'}>Тест пройдено!</h1>
            <Button className={'hover:bg-green-500 hover:text-black'} onClick={handleToQuizzes}>До тестів</Button>
        </div>
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    return (
        <div className='w-full h-screen flex flex-col items-center justify-center'>
            <div className={'flex items-center gap-20'}>
                <h1 className={'text-3xl'}>Тестування: <b>{quiz.title}</b></h1>
                <p className={'text-2xl'}>
                    Часу лишилось: <b>{minutes}</b> хв <b>{seconds.toString().padStart(2, '0')}</b> сек
                </p>
            </div>
            <div className={'flex w-full flex-col justify-between items-center'}>
                <p className={'text-xl pb-10 pt-20'}>Питання <b>№ {currentQuestionIndex + 1}</b></p>
                <h2 className={'text-2xl'}><b>{currentQuestion.text}</b></h2>
                <div className={'flex justify-center items-center gap-5 py-10'}>
                    {currentQuestion.answers.map((ans) => (
                        <Button key={ans.id} onClick={() => handleAnswer(currentQuestion.id, ans)}>
                            {ans.text}
                        </Button>
                    ))}
                </div>
            </div>
            {/*<Button className={'bg-green-500 hover:bg-green-600'} onClick={nextQuestion}>Далі</Button>*/}
        </div>
    );
}

export default StartQuiz;
