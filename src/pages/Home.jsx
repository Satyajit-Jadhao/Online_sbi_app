import { Card, Container, Row, Col } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then(res => res.data)
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container>
      <h2 className="my-4">Welcome, {user.username}</h2>
      
      <h3 className="my-4">Your Accounts</h3>
      <Row>
        {accounts?.map((account) => (
          <Col md={4} key={account.id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{account.accountType} Account</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {account.accountNumber}
                </Card.Subtitle>
                <Card.Text>
                  Balance: ₹{account.balance.toFixed(2)}
                </Card.Text>
                <Card.Link as={Link} to={`/accounts/${account.accountNumber}`}>
                  View Details
                </Card.Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;