import { useState } from 'react';
import { Card, Container, Button, Row, Col, Alert, Modal, Form } from 'react-bootstrap';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Accounts = () => {
  const [showModal, setShowModal] = useState(false);
  const [accountType, setAccountType] = useState('SAVINGS');

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then(res => res.data)
  });

  const { mutate } = useMutation({
    mutationFn: () => api.post('/accounts', { accountType }),
    onSuccess: () => {
      toast.success('Account created successfully!');
      setShowModal(false);
    }
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Accounts</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create New Account
        </Button>
      </div>

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
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Account Type</Form.Label>
            <Form.Control
              as="select"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="SAVINGS">Savings Account</option>
              <option value="CURRENT">Current Account</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={mutate}>
            Create Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Accounts;