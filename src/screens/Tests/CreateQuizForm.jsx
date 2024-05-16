import {useState} from "react";
import {Input} from "../../components/ui/input";
import {Button} from "../../components/ui/button";
import {createQuiz} from "../../service/quiz.service";
import {toast} from "react-toastify";

export const CreateQuizForm = ({onQuizCreate}) => {
    const [title, setTitle] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (title.trim()) {
                const newQuiz = await createQuiz(title);
                console.log(newQuiz);
                onQuizCreate(newQuiz);
                toast.success(`Тест '${title}' був успішно створений, перейдіть на нього для додавання питань!`);
            }
            else{
                toast.info('Введіть назву теста!')
            }
        } catch (error) {
            console.error('Error creating quiz:', error);
            toast.error('Не вдалося створити тест, бо він вже існує!');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={'flex gap-10 w-1/2 py-4 items-start'}>
            <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введіть назву нового тесту"
            />
            <Button type="submit">Створити</Button>
        </form>
    );
};