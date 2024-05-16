import 'react-day-picker/dist/style.css';
import {BrowserRouter as Router, Route, Switch, useLocation} from 'react-router-dom';
import Login from "./screens/Auth/Login";
import {isAuth} from "./service/auth.service";
import Redirect from "react-router-dom/es/Redirect";
import PrivateRoute from "./screens/Auth/PrivateRoute"
import HomePage from "./screens/HomePage";
import Registration from "./screens/Auth/Registration";
import Header from "./screens/Header/Header";
import Footer from "./screens/Footer/Footer";
import TestsPage from "./screens/Tests/TestsPage";
import Quiz from "./screens/Tests/Quiz";
import StartQuiz from "./screens/Tests/StartQuiz";
import QuizResults from "./screens/Tests/QuizResults";
function App() {
  return (
    <div className="App">

        <Router>
            <ConditionalHeader/>
            <Switch>
                <Route
                    path={'/login'}
                    render={()=> isAuth() ? <Redirect to={'/'}/> : <Login/>
                    }
                />
                <Route
                path={'/registration'}
                render={()=> isAuth() ? <Redirect to={'/'}/> : <Registration/>
                }
                />

                <PrivateRoute path={'/quizzes/:id/results'} component={QuizResults} />
                <PrivateRoute path={'/quizzes/:id/test'} component={StartQuiz}/>
                <PrivateRoute path={'/quizzes/:id'} component={Quiz}/>
                <PrivateRoute path={'/quizzes'} component={TestsPage}/>

                <PrivateRoute path={'/'} component={HomePage}/>



            </Switch>
            <ConditionalFooter/>
        </Router>
    </div>
  );
}
function ConditionalHeader() {
    const location = useLocation();
    const noHeaderRoutes = ['/login', '/registration'];

    if (noHeaderRoutes.includes(location.pathname)) {
        return null;
    }

    return <Header />;
}

function ConditionalFooter() {
    const location = useLocation();
    const noHeaderRoutes = ['/login', '/registration'];

    if (noHeaderRoutes.includes(location.pathname)) {
        return null;
    }

    return <Footer />;
}

export default App;
