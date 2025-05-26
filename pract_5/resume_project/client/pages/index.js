import { useState, useEffect } from 'react';

export default function Home() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/resumes');
      const data = await response.json();
      setResumes(data);
      setLoading(false);
    } catch (err) {
      setError('Помилка при завантаженні даних');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xl text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Резюме кандидатів
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {resume.name}
              </h2>
              <p className="text-lg text-blue-600 mb-4">{resume.title}</p>
              <div className="mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Досвід:</span> {resume.experience}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Освіта:</span> {resume.education}
                </p>
              </div>
              <div className="mb-4">
                <p className="font-medium text-gray-900 mb-2">Навички:</p>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{" "}
                  {resume.contacts.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Телефон:</span>{" "}
                  {resume.contacts.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}