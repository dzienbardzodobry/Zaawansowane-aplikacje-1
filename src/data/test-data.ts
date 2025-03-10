import { Test } from "./data";
 
export default {
    title: "Test wiedzy na temat Counter-Strike 1.6",
    questions: [
        {
            timeSpent: 0,
            question: "W której wersji Counter-Strike'a po raz pierwszy pojawiła się mapa de_dust2?",
            correctAnswer: "Counter-Strike 1.1",
            answers: [
                { content: "Counter-Strike 1.0", id: "first" },
                { content: "Counter-Strike 1.1", id: "second" },
                { content: "Counter-Strike 1.3", id: "third" },
                { content: "Counter-Strike 1.6", id: "fourth" }
            ],
            locked: false
        },
        {
            timeSpent: 0,
            question: "Która broń ma najwyższą szybkostrzelność w CS 1.6?",
            correctAnswer: "MAC-10",
            answers: [
                { content: "AK-47", id: "first" },
                { content: "M4A1", id: "second" },
                { content: "MAC-10", id: "third" },
                { content: "AWP", id: "fourth" }
            ],
            locked: false
        },
        {
            timeSpent: 0,
            question: "Ile rund trzeba wygrać, aby zwyciężyć w standardowym meczu?",
            correctAnswer: "16 rund",
            answers: [
                { content: "12 rund", id: "first" },
                { content: "14 rund", id: "second" },
                { content: "16 rund", id: "third" },
                { content: "18 rund", id: "fourth" }
            ],
            locked: false
        },
        {
            timeSpent: 0,
            question: "Która z tych map nie jest standardową mapą w CS 1.6?",
            correctAnswer: "de_inferno2",
            answers: [
                { content: "de_dust", id: "first" },
                { content: "de_aztec", id: "second" },
                { content: "de_inferno", id: "third" },
                { content: "de_inferno2", id: "fourth" }
            ],
            locked: false
        },
        {
            timeSpent: 0,
            question: "Która broń ma największy odrzut w CS 1.6?",
            correctAnswer: "AK-47",
            answers: [
                { content: "M4A1", id: "first" },
                { content: "AK-47", id: "second" },
                { content: "MP5", id: "third" },
                { content: "P90", id: "fourth" }
            ],
            locked: false
        },
        {
            timeSpent: 0,
            question: "Która z tych granatów nie istnieje w CS 1.6?",
            correctAnswer: "Granat dymny",
            answers: [
                { content: "Granat błyskowy", id: "first" },
                { content: "Granat HE", id: "second" },
                { content: "Granat dymny", id: "third" },
                { content: "Granat ogłuszający", id: "fourth" }
            ],
            locked: false
        },
        {
            timeSpent: 0,
            question: "Który z tych przedmiotów można kupić będąc po stronie terrorystów?",
            correctAnswer: "Kevlar + Helmet",
            answers: [
                { content: "Defuse Kit", id: "first" },
                { content: "Kevlar", id: "second" },
                { content: "Kevlar + Helmet", id: "third" },
                { content: "Night Vision Goggles", id: "fourth" }
            ],
            locked: false
        },
        {
            timeSpent: 0,
            question: "Jaki jest maksymalny limit graczy w standardowym meczu CS 1.6?",
            correctAnswer: "32 graczy",
            answers: [
                { content: "16 graczy", id: "first" },
                { content: "20 graczy", id: "second" },
                { content: "24 graczy", id: "third" },
                { content: "32 graczy", id: "fourth" }
            ],
            locked: false
        }
    ]
} as Test;