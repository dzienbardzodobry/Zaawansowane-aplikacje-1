export interface Test {
    title: string,
    questions: Question[]
}

export interface Question {
    question: string;
    answers: Answer[];
    timeSpent: number;
    correctAnswer: string;
    locked: boolean; 
    timeSpent: number;
}


interface Answer {

    id: string;

    content: string;

    selected?: boolean;

    locked?: boolean;

}


