export const state = () => ({
  order: null
});

export const mutations = {
  addOrder: (state, order) => {
    state.order = order;
  },
  addPersonCharge: state => {
    state.order.price += 100;
  },
  saveAnswersToOrder: (state, answers) => {
    state.order.answers = answers;
  },
  clearCart: state => {
    state.order = null;
  }
};

export const actions = {
  addOrder: ({ commit }, order) => {
    commit("addOrder", order);
  }
};
