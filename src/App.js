import './App.css';
import MainRouter from './MainRouter';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <ToastContainer position="top-center"/> 
      <MainRouter/>
    </div>
  );
}

export default App;
