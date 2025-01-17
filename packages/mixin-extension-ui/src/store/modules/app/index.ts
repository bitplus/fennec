import { Module, MutationTree, ActionTree } from "vuex";
import { Mutations, State, Actions, ActionTypes, MutationTypes } from "./types";
import { RootState } from "../../types";

const state: State = {
  initing: true,
  layout: "default",
  settings: {
    currency: "usd",
    colorStyle: "green_down_red_up",
    dark: false
  },
  appbar: {
    title: "",
    show: true,
    back: false
  },
  toast: {
    show: false,
    color: "info",
    message: ""
  },
  paying: {
    visible: false,
    timer: null
  }
};

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_INITING](state, value) {
    state.initing = value;
  },
  [MutationTypes.SET_APPBAR](state, data) {
    const defaultValue = {
      title: "",
      style: "",
      show: true,
      back: true
    };
    state.appbar = { ...defaultValue, ...data };
  },
  [MutationTypes.SET_LAYOUT](state, data) {
    state.layout = data;
  },
  [MutationTypes.SET_APP_SETINGS](state, data) {
    state.settings = { ...state.settings, ...data };
  },
  [MutationTypes.SET_TOAST](state, data) {
    state.toast = data;
  },
  [MutationTypes.SET_PAYING](state, data) {
    state.paying = data;
  }
};

const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.GET_COUTNER]({ commit }) {
    commit(MutationTypes.SET_APPBAR, { title: "" });
  }
};

const module: Module<State, RootState> = {
  namespaced: true,
  mutations,
  actions,
  state
};

export default module;
