import { useState, useEffect } from 'react'

const domain = 'http://127.0.0.1:5000';

function App() {

  const [data, setData] = useState<{ members?: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(domain + "/auth/register")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Data received:', data);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {data.members ? (
        data.members.map((member, i) => <p key={i}>{member}</p>)
      ) : (
        <p>No members found</p>
      )}
    </div>
  );
}

export default App;