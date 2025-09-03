import { Routes, Route } from 'react-router-dom';
import SchedulePage from './pages/Schedule';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SchedulePage />} />
    </Routes>
  );
}

export default App;
