import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Calendar from './components/Calendar';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa' }}>
      <h1 style={{ textAlign: 'center' }}>Календарь задач</h1>
      <Calendar />
    </div>
  );
}

export default App;
