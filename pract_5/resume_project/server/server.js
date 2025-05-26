const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Тестові дані для резюме
const resumes = [
    {
        id: 1,
        name: "Іван Петренко",
        title: "Full Stack Developer",
        experience: "5 років",
        skills: ["JavaScript", "React", "Node.js", "MongoDB"],
        education: "Київський Політехнічний Інститут",
        contacts: {
            email: "ivan@example.com",
            phone: "+380991234567"
        }
    },
    {
        id: 2,
        name: "Марія Коваленко",
        title: "UI/UX Designer",
        experience: "3 роки",
        skills: ["Figma", "Adobe XD", "HTML/CSS", "Prototyping"],
        education: "Львівська Політехніка",
        contacts: {
            email: "maria@example.com",
            phone: "+380997654321"
        }
    }
];

// Endpoint для отримання всіх резюме
app.get('/api/resumes', (req, res) => {
    res.json(resumes);
});

// Endpoint для отримання конкретного резюме за id
app.get('/api/resumes/:id', (req, res) => {
    const resume = resumes.find(r => r.id === parseInt(req.params.id));
    if (!resume) {
        return res.status(404).json({ message: 'Резюме не знайдено' });
    }
    res.json(resume);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});