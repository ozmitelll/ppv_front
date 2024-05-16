import {Input} from "../../components/ui/input";
import {Label} from "../../components/ui/label";
import {Button} from "../../components/ui/button";
import {useHistory} from "react-router-dom";
import {useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {loginUser} from "../../service/auth.service";

const Login = () => {
    const history = useHistory();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleRegisterRedirect = () => {
        history.push("/registration");
    };

    const handleSubmit = async () => {
        if (login.trim() === "" || password.trim() === "") {
            toast.error("Please fill in both fields!");
            return;
        }

        const formData = {
            login,
            password
        };

        try {
            const result = await loginUser(formData)
            localStorage.setItem('authToken', result.access_token);
            history.push('/')
        } catch (err){
            console.error('Login failed:', err)
            toast.error("Помилка, перевірте свої дані!");
        }

    };
    return (
        <div className={'flex flex-col items-center justify-between pt-36'}>
            <h2 className={'text-2xl pb-10'}>Система професійно-психологічного відбору</h2>
            <div className={'flex flex-col gap-6 items-center border-2 rounded-xl p-6'}>
                <p className={'text-center text-xl font-bold'}>Увійти до системи</p>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="login">Логін</Label>
                    <Input
                        type="text"
                        id="login"
                        placeholder="Логін"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                        type="password"
                        id="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Label className={'flex gap-2'}>
                    Відсутній аккаунт?
                    <p
                        className={'cursor-pointer hover:text-sky-400 underline'}
                        onClick={handleRegisterRedirect}
                    >
                        Зареєструватись!
                    </p>
                </Label>
                <Button className={'w-1/2'} onClick={handleSubmit}>
                    Увійти
                </Button>
            </div>
            <ToastContainer position={"bottom-right"} theme={"dark"} hideProgressBar={true} />
        </div>
    )
}

export default Login