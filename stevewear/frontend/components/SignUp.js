import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const Success = styled.text`
  color: green;
`;

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $password: String!
    $name: String!
  ) {
    createUser(data: { email: $email, password: $password, name: $name }) {
      id
      name
      email
    }
  }
`;
export default function SignUp() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });
  const [signup, { data, error }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
  });
  async function handleSubmit(e) {
    e.preventDefault();
    console.log(inputs);
    const res = await signup().catch(console.error);
    console.log(res);
    resetForm();
  }
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign Up For an Account</h2>
      <ErrorMessage error={error} />
      <fieldset>
        {data?.createUser && (
          <Success>
            Signed up with {data.createUser.email} - Please Go Head and Sign in!
          </Success>
        )}
        <label htmlFor="name">
          Your Name
          <input
            type="text"
            name="name"
            placeholder="Enter your Name"
            autoComplete="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Enter your Email address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign Up</button>
      </fieldset>
    </Form>
  );
}
