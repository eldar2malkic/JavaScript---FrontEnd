const QUESTION_API_bASE_URL = 'https://www.algoexpert.io/api/fe/questions';
const SUBMISSIONS_API_bASE_URL = 'https://www.algoexpert.io/api/fe/submissions'

fetchAndAppendQuestions();

async function fetchAndAppendQuestions() {
    const [questions, submissions] = await fetchQuestionsAndSubmissions();
    const questionsByCategory = getQuestionsByCategory(questions);
    const submissionsById = getSubmissionsById(submissions);

    const wrapper = document.getElementById('wrapper');
    for (const [category, questions] of Object.entries(questionsByCategory)) {
        const categoryDiv = createCategory(category, questions, submissionsById);
        wrapper.append(categoryDiv);
    }

}

function createCategory(category, questions, submissionsById) {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    // const h2 = document.createElement('h2');
    // h2.textContent = category;
    // categoryDiv.append(h2);
    let correctCount = 0;
    questions.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        const status = document.createElement('div');
        status.classList.add('status');
        const statusClass = submissionsById[question.id]?.toLowerCase()?.replace('_', '-');
        status.classList.add(statusClass ?? 'unattempted');
        questionDiv.append(status);

        if (submissionsById[question.id] === 'CORRECT') {
            correctCount++;
        }

        const h3 = document.createElement('h3');
        h3.textContent = question.name;
        questionDiv.append(h3);
        categoryDiv.append(questionDiv);
    });

    const h2 = document.createElement('h2');
    h2.textContent = `${category} - ${correctCount} / ${questions.length}`
    categoryDiv.prepend(h2);
    return categoryDiv;
}

async function fetchQuestionsAndSubmissions() {
    const [questionsRes, submissionsRes] = await Promise.all([
        fetch(QUESTION_API_bASE_URL),
        fetch(SUBMISSIONS_API_bASE_URL)
    ]);
    
    return await Promise.all([
        questionsRes.json(),
        submissionsRes.json()
    ]);
}

function getQuestionsByCategory(questions) {
    const questionsByCategory = {};
    questions.forEach(question => {
        if (questionsByCategory.hasOwnProperty(question.category)) {
            questionsByCategory[question.category].push(question);
        } else {
            questionsByCategory[question.category] = [question];
        }
    });
    return questionsByCategory;
}

function getSubmissionsById(submissions) {
    const submissionsById = {};
    submissions.forEach(submission => {
        submissionsById[submissions.questionId] = submission.status;
    });
    return submissionsById;
}
