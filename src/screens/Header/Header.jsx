import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "../../components/ui/avatar";
import {useHistory} from "react-router-dom";
import {useEffect} from "react";
import ppv_book from "../../assets/docs/ppv_book.doc"
const Header = () => {
    const history = useHistory();
    const handleLogout = () => {
        history.push('/login');
        localStorage.removeItem('authToken');  // Remove authToken from localStorage
    };

    const handleToTests = () =>{
        history.push('/quizzes')
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.shiftKey && event.key === 'Q') {
                handleLogout();
            }
            if(event.shiftKey && event.key === 'T'){
                handleToTests();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    console.log()
    return (
        <header
            key="1"
            className="fixed inset-x-0 top-0 h-16 z-50 flex items-center px-4 bg-opacity-90 backdrop-blur-sm border-b border-gray-200 backdrop-filter dark:border-gray-800 dark:bg-gray-950/90"
        >
            <nav className="flex-1 flex items-center justify-between px-12">
                <a href="/">
                    <p>Система професійно-психологічного відбору</p>
                </a>
                <div className="flex-1 flex justify-end items-center space-x-8">
                    <a className="font-semibold relative" href="/quizzes">
                        Тести
                        <span
                            className="absolute bottom-0 left-0 w-full h-0.5 bg-black transition-transform transform origin-bottom scale-x-0 group-hover:scale-x-100"/>
                    </a>
                    <a className="font-semibold relative" href={ppv_book} download="ppv_book.doc">
                        Інформація
                        <span
                            className="absolute bottom-0 left-0 w-full h-0.5 bg-black transition-transform transform origin-bottom scale-x-0 group-hover:scale-x-100"/>
                    </a>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar>
                                <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="@shadcn" />
                                <AvatarFallback>UA</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Мій аккаунт</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Профіль
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleToTests}>
                                    Тести
                                    <DropdownMenuShortcut>⇧T</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Статистика
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Налаштування
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Підтримка</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                Вийти
                                <DropdownMenuShortcut>⇧Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    )
}

export default Header