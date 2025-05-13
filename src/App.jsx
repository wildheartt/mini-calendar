import './App.css';
import Calendar from './components/Calendar';

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa' }}>
      <h1 style={{ textAlign: 'center' }}>Календарь задач</h1>
      <Calendar />
    </div>
  );
}

export default App;
