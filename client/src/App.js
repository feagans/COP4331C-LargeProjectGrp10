import logo from './logo.svg';
import './App.css';

function App() {
  const [data1, setData1] = React.useState(null);
  fetch('http://localhost:5000')
  .then(res => res.json())
  .then(data => setData1(data));
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
