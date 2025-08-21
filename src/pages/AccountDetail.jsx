import { useParams } from 'react-router-dom';
import {useState } from 'react'
import { Table, Container, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const AccountDetail = () => {
  const { accountNumber } = useParams();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ['account', accountNumber],
    queryFn: () => api.get(`/accounts/${accountNumber}`).then(res => res.data)
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', accountNumber],
    queryFn: () => api.get(`/transactions/${accountNumber}`).then(res => res.data)
  });

  const depositMutation = useMutation({
    mutationFn: () => api.post('/transactions/deposit', {
      accountNumber,
      amount: parseFloat(amount),
      description
    }),
    onSuccess: () => {
      toast.success('Deposit successful!');
      setShowDepositModal(false);
      setAmount('');
      setDescription('');
    }
  });

  const withdrawMutation = useMutation({
    mutationFn: () => api.post('/transactions/withdraw', {
      accountNumber,
      amount: parseFloat(amount),
      description
    }),
    onSuccess: () => {
      toast.success('Withdrawal successful!');
      setShowWithdrawModal(false);
      setAmount('');
      setDescription('');
    }
  });

  if (accountLoading || transactionsLoading) return <LoadingSpinner />;

  return (
    <Container>
      {account && (
        <div className="my-4">
          <h2>{account.accountType} Account</h2>
          <p>Account Number: {account.accountNumber}</p>
          <p>Balance: ₹{account.balance.toFixed(2)}</p>
        </div>
      )}

      <div className="mb-3">
        <Button variant="success" className="me-2" onClick={() => setShowDepositModal(true)}>
          Deposit
        </Button>
        <Button variant="danger" onClick={() => setShowWithdrawModal(true)}>
          Withdraw
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((txn) => (
            <tr key={txn.id}>
              <td>{new Date(txn.transactionDate).toLocaleString()}</td>
              <td>{txn.type}</td>
              <td className={txn.type === 'DEPOSIT' ? 'text-success' : 'text-danger'}>
                {txn.type === 'DEPOSIT' ? '+' : '-'}₹{txn.amount.toFixed(2)}
              </td>
              <td>{txn.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Deposit Modal */}
      <Modal show={showDepositModal} onHide={() => setShowDepositModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deposit Money</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDepositModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={depositMutation.mutate}
            disabled={depositMutation.isPending}
          >
            {depositMutation.isPending ? <Spinner size="sm" className="me-2" /> : null}
            Deposit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Withdraw Modal */}
      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Withdraw Money</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWithdrawModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={withdrawMutation.mutate}
            disabled={withdrawMutation.isPending}
          >
            {withdrawMutation.isPending ? <Spinner size="sm" className="me-2" /> : null}
            Withdraw
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AccountDetail;