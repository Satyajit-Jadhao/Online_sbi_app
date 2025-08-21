import { useState } from 'react';
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const Transfer = () => {
  const [formData, setFormData] = useState({
    fromAccountNumber: '',
    toAccountNumber: '',
    amount: '',
    description: ''
  });

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts').then(res => res.data)
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => api.post('/transactions/transfer', formData),
    onSuccess: () => {
      toast.success('Transfer completed successfully!');
      setFormData({
        fromAccountNumber: accounts?.[0]?.accountNumber || '',
        toAccountNumber: '',
        amount: '',
        description: ''
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <Card>
        <Card.Body>
          <Card.Title className="text-center">Fund Transfer</Card.Title>
          {error && <Alert variant="danger">{error.response?.data?.message || 'Transfer failed'}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>From Account</Form.Label>
              <Form.Control
                as="select"
                name="fromAccountNumber"
                value={formData.fromAccountNumber || (accounts?.[0]?.accountNumber || '')}
                onChange={handleChange}
                required
              >
                {accounts?.map((account) => (
                  <option key={account.id} value={account.accountNumber}>
                    {account.accountType} - {account.accountNumber} (₹{account.balance.toFixed(2)})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>To Account Number</Form.Label>
              <Form.Control
                type="text"
                name="toAccountNumber"
                value={formData.toAccountNumber}
                onChange={handleChange}
                placeholder="Enter recipient account number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
                min="0.01"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>

            <Button type="submit" className="w-100" disabled={isPending}>
              {isPending ? <Spinner size="sm" className="me-2" /> : null}
              Transfer
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Transfer;