import { OrderCreateInput } from "../.keystone/schema-types";
import { KeystoneContext, SessionStore } from '@keystone-next/types';
import stripeConfig from "../lib/stripe";

const graphql = String.raw;

interface Arguments {
  token: string;
}

async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
    const userId = context.session.itemId;
  if(!userId) {
    throw new Error('Sorry! You must be signed in to create an order!')
  }
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `
  });
  console.dir(user, { depth: null })
 
  
  const cartItems = user.cart.filter(cartItem => cartItem.product);
  const amount = cartItems.reduce(function(tally: number, cartItem: CartItemCreateInput) {
    return tally + cartItem.quantity * cartItem.product.price*100;
  }, 0);
  console.log(amount);
  console.log(cartItems.total);
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'Kes',
    confirm: true,
    payment_method: token,
  }).catch(err => {
    console.log(err);
    throw new Error(err.message);
  });

  const orderItems = cartItems.map(cartItem => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id }},
    }
    return orderItem;
  })
  console.log('gonna create the order')

  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId }}
    },
    resolveFields: false,
  });
  
  const cartItemIds = user.cart.map(cartItem => cartItem.id);
  console.log('gonna create delete cartItems')
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds
  });
  return order;

}

export default checkout;