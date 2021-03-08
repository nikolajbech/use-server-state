import { useContext, useEffect } from 'react'
import './App.css';

import { useServerState } from './client/useServerState'

function App() {
  const [testValue, setTestValue] = useServerState('test-value', 'testUID')

  return (
    <div className="App">
      <h2>Test value is:</h2>
      <h1>{testValue}</h1>
      <button onClick={() => setTestValue(testValue - 1)}>Decrease</button>
      <button onClick={() => setTestValue(testValue + 1)}>Increase</button>
    </div>
  );
}

export default App;
