import {Input} from "../../components/ui/input";
import {Label} from "../../components/ui/label";
import {Button} from "../../components/ui/button";
import {useHistory} from "react-router-dom";
import {CustomForm} from "../../components/ui/datepicker";
import {useState} from "react";
import {format} from "date-fns";
import {createUser} from "../../service/auth.service";
import {toast, ToastContainer} from "react-toastify";

const Registration = () => {
    const history = useHistory();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [thirdName, setThirdName] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [date, setDate] = useState(new Date());

    const handleLoginRedirect = () => {
        history.push("/login");
    };

    const clearForm = () => {
        setName("");
        setSurname("");
        setThirdName("");
        setLogin("");
        setPassword("");
        setDate(new Date());
    };
    const handleSubmit = async () => {
        const formData = {
            name,
            surname,
            thirdName,
            dateOfBirth: format(date, "yyyy-MM-dd"),
            login,
            password,
        };

        const status = await createUser(formData)

        if (status === 201) {
            toast.success("Акаунт був успішно створений!");

            clearForm();

            setTimeout(() => {
                handleLoginRedirect();
            }, 2000);

        } else {
            toast.error("Ой, халепа , сталася помилка!");
        }
    };

    return (
        <div className="flex flex-col justify-between pt-16">
            <h2 className="text-2xl pb-10">Система професійно-психологічного відбору</h2>
            <div className="flex flex-col gap-6 items-center border-2 rounded-xl p-6">
                <p className="text-center text-xl font-bold">Зареєструватися в системі</p>
                <div className="flex w-full max-w-lg gap-4">
                    <div className="flex-1 flex-col items-center gap-1.5">
                        <Label htmlFor="name">Ім'я</Label>
                        <Input type="text" id="name" placeholder="Ім'я" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex-1 flex-col items-center gap-1.5">
                        <Label htmlFor="surname">Прізвище</Label>
                        <Input type="text" id="surname" placeholder="Прізвище" value={surname} onChange={(e) => setSurname(e.target.value)} />
                    </div>
                    <div className="flex-1 flex-col items-center gap-1.5">
                        <Label htmlFor="thirdname">По батькові</Label>
                        <Input type="text" id="thirdname" placeholder="По батькові" value={thirdName} onChange={(e) => setThirdName(e.target.value)} />
                    </div>
                </div>

                {/* Date Picker */}
                <div className="flex w-full max-w-lg gap-4">
                    <div className="flex-1 flex-col items-center gap-1.5">
                        <CustomForm date={date} setDate={setDate} />
                    </div>
                </div>

                {/* Login Field */}
                <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="login">Логін</Label>
                    <Input type="text" id="login" placeholder="Логін" value={login} onChange={(e) => setLogin(e.target.value)} />
                </div>

                {/* Password Field */}
                <div className="grid w-full max-w-lg items-center gap-1.5">
                    <Label htmlFor="password">Пароль</Label>
                    <Input type="password" id="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                {/* Redirect to Login */}
                <Label className="flex gap-2">
                    Є аккаунт?
                    <p className="cursor-pointer hover:text-sky-400 underline" onClick={handleLoginRedirect}>
                        Увійти!
                    </p>
                </Label>

                {/* Submit Button */}
                <Button className="w-1/2" onClick={handleSubmit}>
                    Зареєструватись
                </Button>
            </div>
            <ToastContainer position={"bottom-right"} theme={'dark'} hideProgressBar={true}/>
        </div>
    );
};
export default Registration