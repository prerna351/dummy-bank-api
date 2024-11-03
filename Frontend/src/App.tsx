import { useState } from 'react'
import axios from 'axios';


//get the token
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get('token'); 

const UserIDInput = () => {
  const [userID, setUserID] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserID(value);
    if (value.trim() === '') {
      setError('User ID is required');
    } else {
      setError('');
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (userID.trim() === '') {
      setError('User ID is required');
      return;
    }

    // Proceed after approval - backend call    
    try{

      //hit the bank webhook to update the database 
      const response = await axios.post("http://localhost:3004/sendWebHookRequest",{
        token
      });

      if (response.status === 200) {
        setSuccess(true); // Indicate success
        console.log('Webhook response:', response.data);
    }
    }catch(e){
      console.error('Error sending webhook request');
      setError('Failed to process payment. Please try again.');
    }
    console.log('User ID:', userID);
  };


  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">HDFC Netbanking Login</h2>
        <div className="mb-4">
          <label
            htmlFor="userID"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            User ID
          </label>
          <input
            type="text"
            id="userID"
            value={userID}
            onChange={handleChange}
            placeholder="Enter your User ID"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              error ? 'border-red-500' : ''
            }`}
          />
          {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          
        >
          Submit
        </button>
      </form>
    </div>
  );
};


function App() {
 
  
  return (
    <>
       <div className="App">
      <UserIDInput />
    </div>
    </>
  )
}

export default App
