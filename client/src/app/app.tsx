// Uncomment this line to use CSS modules
// import styles from './app.module.css';

import { Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';

export function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignInPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
