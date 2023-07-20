export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'Kes',
    minimumFractionDigits: 2,
  };
  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }
  const formatter = Intl.NumberFormat('en-US', options);
  return formatter.format(amount * 10000);
}

// const formatter = new Intl.NumberFormat('en-KE', {
//   style: 'currency',
//   currency: 'kes',
// });

// export default function formatMoney(cents: number) {
//   const ksh = cents * 10000;
//   return formatter.format(ksh);
// }