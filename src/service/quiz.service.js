export const getQuizzes = async (id) => {
    const config = {
        method: 'GET',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
    }
    try {
        const response = await fetch(`http://localhost:8001/api/v1/quizzes?user_id=${id}`, config);

        if (!response.ok) {
            console.error(`Error ${response.status}:`, await response.text());
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return 500;
    }
}

export const getQuiz = async (id) => {
    const config = {
        method: 'GET',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        },

    }
    try {
        const response = await fetch(`http://localhost:8001/api/v1/quizzes/${id}`, config);

        if (!response.ok) {
            console.error(`Error ${response.status}:`, await response.text());
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return 500;
    }
}


export const createQuiz = async (title)=>{
    const config = {
        method:'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'title': title
        })
    }
    try {
        const response = await fetch("http://localhost:8001/api/v1/quizzes", config);

        if (!response.ok) {
            console.error(`Error ${response.status}:`, await response.text());
            throw new Error('Цей тест вже можливо створений! Або трапилась помилка на сервері.')
        }

        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Помилка серверу!')
    }
}

export const createQuizQuestion = async (text_quetion, id)=>{
    const config = {
        method:'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'text': text_quetion,
            'image_url': null
        })
    }
    try {
        const response = await fetch(`http://localhost:8001/api/v1/quizzes/${id}/questions`, config);

        if (!response.ok) {
            console.error(`Error ${response.status}:`, await response.text());
            throw new Error('Це питання вже можливо створене! Або трапилась помилка на сервері.')
        }

        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Помилка серверу!')
    }
}

export const saveQuiz = async (description,time_for_test, id)=>{
    const config = {
        method:'PUT',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'description': description,
            'time_for_test': time_for_test
        })
    }
    try {
        const response = await fetch(`http://localhost:8001/api/v1/quizzes/${id}`, config);

        if (!response.ok) {
            console.error(`Error ${response.status}:`, await response.text());
            throw new Error('Це питання вже можливо створене! Або трапилась помилка на сервері.')
        }

        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Помилка серверу!')
    }
}

export const deleteQuestion = async (id, question_id)=>{
    const config = {
        method:'DELETE',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
    }
    try {
        const response = await fetch(`http://localhost:8001/api/v1/quizzes/${id}/questions/${question_id}`, config);

        if (!response.ok) {
            console.error(`Error ${response.status}:`, await response.text());
            throw new Error('Це питання вже можливо створене! Або трапилась помилка на сервері.')
        }

        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Помилка серверу!')
    }
}


export const getAnswersToQuestion = async (id,question_id) => {
    const config = {
        method: 'GET',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
    };
    try {
        const response = await fetch(`http://localhost:8001/api/v1/quizzes/${id}/questions/${question_id}/answers`, config);

        if (!response.ok) {
            console.error(`Error ${response.status}:`, await response.text());
            throw new Error('Це питання вже можливо створене! Або трапилась помилка на сервері.');
        }

        return response.json()
    }
    catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Помилка серверу!');
    }
}
export const addAnswersToQuestion = async (id, question_id, answers) => {
    try {
        for (const answer of answers) {
            console.log(answer)
            const config = {
                method: 'POST',
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: answer.text,
                    is_correct: answer.is_correct
                })
            };

            const response = await fetch(`http://localhost:8001/api/v1/quizzes/${id}/questions/${question_id}/answers`, config);

            if (!response.ok) {
                console.error(`Error ${response.status}:`, await response.text());
                throw new Error('Це питання вже можливо створене! Або трапилась помилка на сервері.');
            }

            // Опційно: обробка кожної відповіді
            const jsonResponse = await response.json();
            console.log('Відповідь додана:', jsonResponse);
        }

        console.log('Усі відповіді були успішно додані.');
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Помилка серверу!');
    }
}

export const completeQuiz = async (id, user_id, score) =>{
    const config = {
        method:'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'score': score,
            'user_id': user_id
        })
    }
    try {
        const response = await fetch(`http://localhost:8001/api/v1/quizzes/${id}/complete`, config);

        if (!response.ok) {
            console.error(`Error ${response.status}:`, await response.text());
            throw new Error('Це питання вже можливо створене! Або трапилась помилка на сервері.')
        }

        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Помилка серверу!')
    }
}

export const getResult = async (id) =>{
    const config = {
        method:'GET',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
    }
    try {
        const response = await fetch(`http://localhost:8001/api/v1/quizzes/${id}/results`, config);

        if (!response.ok) {
            console.error(`Error ${response.status}:`, await response.text());
            throw new Error('Це питання вже можливо створене! Або трапилась помилка на сервері.')
        }

        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Помилка серверу!')
    }
}


