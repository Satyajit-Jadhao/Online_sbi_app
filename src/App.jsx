import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Accounts from './pages/Accounts';
import AccountDetail from './pages/AccountDetail';
import Transfer from './pages/Transfer';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
   
        <BrowserRouter>
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/accounts/:accountNumber" element={<AccountDetail />} />
                <Route path="/transfer" element={<Transfer />} />
              </Route>
            </Routes>
          </div>
          <Toaster position="top-right" />
        </BrowserRouter>

    </QueryClientProvider>
  );
}

export default App;