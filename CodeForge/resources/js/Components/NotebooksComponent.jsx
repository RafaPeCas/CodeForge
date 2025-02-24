import  { useState } from 'react';
import axios from 'axios';

const NotebooksComponent = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [singleNotebook, setSingleNotebook] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [spaceId, setSpaceId] = useState('');//create a notebook
  const [spaceId2, setSpaceId2] = useState('');//all notebooks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get all notebooks in a space
  const getNotebooks = (spaceId) => {
    console.log(spaceId);
    
    setLoading(true);
    axios
      .get(`/notebooks/${spaceId}`)
      .then((response) => {
        setNotebooks(response.data);
      })
      .catch((err) => {
        setError('Error fetching notebooks');
      })
      .finally(() => setLoading(false));
  };

  // Get a single notebook by ID
  const getNotebook = (id) => {
    setLoading(true);
    axios
      .get(`/notebooks/show/${id}`)
      .then((response) => {
        setSingleNotebook(response.data);
      })
      .catch((err) => {
        setError('Error fetching notebook');
      })
      .finally(() => setLoading(false));
  };

  // Create a new notebook
  const createNotebook = () => {
    console.log({
      name,
      description,
      spaceId
    });
    setLoading(true);
    axios
      .post('/notebooks', {
        name,
        description,
        spaceId,
      })
      .then((response) => {
        setNotebooks([...notebooks, response.data]);
        setName('');
        setDescription('');
        setSpaceId('');
      })
      .catch((err) => {
        setError('Error creating notebook');
      })
      .finally(() => setLoading(false));
  };

  // Delete a notebook
  const deleteNotebook = (id) => {
    setLoading(true);
    axios
      .delete(`/notebooks/${id}`)
      .then(() => {
        setNotebooks(notebooks.filter((notebook) => notebook.id !== id));
      })
      .catch((err) => {
        setError('Error deleting notebook');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className='bg-black text-white p-4'>
      <h1>Notebooks</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className='bg-blue-900'>
        <h2>Create a new notebook</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='border-2 border-white'
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='border-2 border-white'

        />
        <input
          type="text"
          placeholder="Space ID"
          value={spaceId}
          onChange={(e) => setSpaceId(e.target.value)}
          className='border-2 border-white'

        />
        <button onClick={createNotebook} disabled={loading} className='bg-white text-black'>
          {loading ? 'Creating...' : 'Create Notebook'}
        </button>
      </div>

      <div className='bg-green-900'>
        <h2>All Notebooks</h2>
        <input
          type="text"
          placeholder="Space ID"
          onBlur={(e) => getNotebooks(e.target.value)}
          className='border-2 border-white'
          onChange={(e) => setSpaceId2(e.target.value)}
        />
        <button className='bg-white text-black' onClick={() => getNotebooks(spaceId2)}>Get Notebooks</button>

        {loading && <p>Loading...</p>}

        <ul className='flex flex-col'>
          {notebooks.map((notebook) => (
            <li key={notebook.id}>
              <span>{notebook.name}</span>
              <button className='bg-blue-700' onClick={() => getNotebook(notebook.id)}>View</button>
              <button className='bg-amber-700' onClick={() => deleteNotebook(notebook.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div className='bg-gray-800 p-4'>
        <h2>Notebook</h2>
        {singleNotebook ? (
          <div>
            <h3>Name: {singleNotebook.name}</h3>
            <p>Description: {singleNotebook.description}</p>
          </div>
        ) : (
          <p>No notebook selected</p>
        )}
      </div>
    </div>
  );
};

export default NotebooksComponent;
