import { useContext, useEffect } from 'react'
import './App.css';

import { useServerState } from './client/useServerState'

function App() {
  const [test1Value, setTest1Value] = useServerState('test-value-1', 'testUID')
  const [test2Value, setTest2Value] = useServerState('test-value-2', 'testUID')

  return (
    <div className="App">
    <h2>Test1 value is:</h2>
    <h1>{test1Value}</h1>
    <button onClick={() => setTest1Value(test1Value - 1)}>Decrease</button>
    <button onClick={() => setTest1Value(test1Value + 1)}>Increase</button>
      <h2>Test2 value is:</h2>
      <h1>{test2Value}</h1>
      <button onClick={() => setTest2Value(test2Value - 1)}>Decrease</button>
      <button onClick={() => setTest2Value(test2Value + 1)}>Increase</button>
    </div>
  );
}

export default App;
