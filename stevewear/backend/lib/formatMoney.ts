const formatMoney = {
  total: async (root) => {
    const totalInCents = root.total * 100;
    return totalInCents;
  },
  formattedTotal: async (root) => {
    const totalInCents = root.total * 100;
    return `KES ${totalInCents / 100}`;
  },
};

export default formatMoney;
