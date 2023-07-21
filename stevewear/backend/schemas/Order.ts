import {
    integer,
    text,
    relationship,
  } from '@keystone-next/fields';
  import { list } from '@keystone-next/keystone/schema';
  import formatMoney from '../lib/formatMoney';
  
  export const Order = list({
    fields: {
      total: integer(),
      items: relationship({ ref: 'OrderItem.order', many: true }),
      user: relationship({ ref: 'User.orders' }),
      charge: text(),
    },
  });