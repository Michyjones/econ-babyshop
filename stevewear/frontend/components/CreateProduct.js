import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useForm from '../lib/useForm';
import ErrorMessage from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';
import Form from './styles/Form';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      name
      description
    }
  }
`;
export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    image: '',
    name: '',
    price: 0,
    description: '',
  });
  const [createProduct, { loading, data, error }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    { variables: inputs, refetchQueries: [{ query: ALL_PRODUCTS_QUERY }] }
  );
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log(inputs);
        const res = await createProduct();
        clearForm();
        Router.push({
          pathname: `/product/${res.data.createProduct.id}`,
        });
      }}
    >
      <ErrorMessage error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image Upload:
          <input
            required
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            id="name"
            name="name"
            value={inputs.name}
            placeholder="Name"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Price:
          <input
            type="number"
            id="price"
            name="price"
            value={inputs.price}
            placeholder="Price"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description:
          <textarea
            type="text"
            id="description"
            name="description"
            value={inputs.description}
            placeholder="Description"
            onChange={handleChange}
          />
        </label>
        <button type="submit">+ Add Product</button>
      </fieldset>
    </Form>
  );
}
