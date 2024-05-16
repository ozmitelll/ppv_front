import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table"
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getQuiz, getResult} from "../../service/quiz.service";

const QuizResults = () => {
    const {id} = useParams()
    const [quiz, setQuiz] = useState(null);
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getQuiz(id)
            .then(response => {
                setQuiz(response);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });
        getResult(id).then(response => {
            setResult(response);
        })
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={'w-[100vw] h-[100vh] flex flex-col justify-center items-center'}>
            <p className={'text-3xl text-center pb-10'}>Результати тесту з : ≪<b>{quiz.title}</b>≫</p>
            <div className={'flex justify-center items-center w-full px-60'}>
                <Table className={''}>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">№</TableHead>
                            <TableHead className="text-center">Призвіще</TableHead>
                            <TableHead className="text-center">Ім'я</TableHead>
                            <TableHead className="text-center">По батькові</TableHead>
                            <TableHead className="text-center">Результат</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result && result.participants.map((partisipant, index) => (

                        <TableRow key={index}>
                            <TableCell className="font-medium">{index+1}</TableCell>
                            <TableCell className="font-medium text-center">{partisipant.surname}</TableCell>
                            <TableCell className="font-medium text-center">{partisipant.name}</TableCell>
                            <TableCell className="font-medium text-center">{partisipant.thirdname}</TableCell>
                            <TableCell className="font-medium text-center">{partisipant.score}/{quiz.questions.length}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default QuizResults