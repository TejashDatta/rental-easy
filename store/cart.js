export const state = () => ({
  orders: [],
});

export const mutations = {
  addOrder: (state, order) => {
    state.orders = state.orders.concat(order);
  },
  removeOrder: (state, itemID) => {
    state.orders = state.orders.filter(order => order.item.id !== itemID);
  },
  clearCart: state => {
    state.orders = [];
  },
};

export const actions = {
  addOrder: ({ commit }, order) => {
    commit("removeOrder", order.item.id);
    commit("addOrder", order);
  },
};
