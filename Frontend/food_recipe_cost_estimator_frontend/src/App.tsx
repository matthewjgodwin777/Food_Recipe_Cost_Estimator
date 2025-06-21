import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { useRecipe } from './RecipeContext';
import Home from './Home';
import RecipeAdd from './RecipeAdd';
import RecipeDisplayUpdate from './RecipeDisplayUpdate';

export default function App() {
  const { recipe } = useRecipe();

  return (
    <div
      className="App"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(254, 255, 244) 100%)'
      }}
    >
      <h1 style={{
        textAlign: 'center',
        background: 'linear-gradient(90deg,rgb(255, 230, 230) 0%,rgb(255, 235, 215) 100%)',
        marginTop: 0,
        marginBottom: 0,
        padding: '1.5rem 0'
      }}>Food Recipe Cost Estimator</h1>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #eaf0fb 0%, #fed6e3 100%)',
        padding: '0.75rem 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        borderTop: '1px solid #000000',
        borderBottom: '1px solid #000000'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#2a3d8f', fontWeight: 600 }}>
          Home
        </Link>
        <span style={{ color: '#bbb', fontWeight: 600, fontSize: '1.2em' }}>|</span>
        <Link to="/InsertRecipe" style={{ textDecoration: 'none', color: '#2a3d8f', fontWeight: 600 }}>
          Insert Recipe
        </Link>
      </nav>
      <main style={{ width: '100%', flex: 1, minHeight: 0 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/InsertRecipe" element={<RecipeAdd />} />
          <Route path="/GetRecipe" element={recipe ? <RecipeDisplayUpdate /> : <p>Nothing to display!<br/><br/>Looks like someone here, is trying to navigate through the wrong way...<br/>Ensure to go to Home and search for the recipe.</p>} />
        </Routes>
      </main>
      <footer style={{ textAlign: 'right', background: '#ffffff' }}>
        <span style={{ display: 'inline', color: '#ffffff'}}>
          {atob('TWF0dGhldyBKb25hdGhhbiBHCg==')}
        </span> &copy; 2025 Food Recipe Cost Estimator&nbsp;&nbsp;
      </footer>
    </div>
  );
}