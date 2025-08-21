import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
// import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  // const { login } = useAuth();

  const { mutate, isPending, isLoading, error } = useMutation({
    mutationFn: (userData) => api.post('/auth/signup', userData),
   onSuccess: (data) => {
  toast.success(data.message || "User registered successfully!");
  navigate("/"); // no token stored

},
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  });

  // ✅ Pick correct flag depending on React Query version
  const mutationInProgress = typeof isPending !== "undefined" ? isPending : isLoading;

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <Card>
        <Card.Body>
          <Card.Title className="text-center">Register</Card.Title>
          <Formik
            initialValues={{ 
              username: '',
              email: '',
              password: '',
              fullName: '',
              address: '',
              phone: ''
            }}
            validationSchema={Yup.object({
              username: Yup.string().required('Required'),
              email: Yup.string().email('Invalid email').required('Required'),
              password: Yup.string().min(6, 'Too short').required('Required'),
              fullName: Yup.string().required('Required'),
              address: Yup.string().required('Required'),
              phone: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number')
            })}
            onSubmit={(values) => mutate(values)}
          >
            <Form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <Field name="username" type="text" className="form-control" />
                <ErrorMessage name="username" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <Field name="email" type="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <Field name="fullName" type="text" className="form-control" />
                <ErrorMessage name="fullName" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <Field name="address" as="textarea" className="form-control" />
                <ErrorMessage name="address" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <Field name="phone" type="text" className="form-control" />
                <ErrorMessage name="phone" component="div" className="text-danger" />
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error.response?.data?.message || 'Registration failed'}
                </Alert>
              )}

              <Button type="submit" className="w-100" disabled={mutationInProgress}>
                {mutationInProgress ? <Spinner size="sm" className="me-2" /> : null}
                Register
              </Button>
            </Form>
          </Formik>
          <div className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
