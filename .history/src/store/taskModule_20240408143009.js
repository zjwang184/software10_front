export default {
  namespaced: true,
  state() {
    return {
      step: 1,
      taskName: "",
      principal: "",
      participants: "",
      disease: "",
      dataset: "",
      all_features: [],
      use_features: [],
      known_features: [],
      target_features: [],
      algorithm:'',
      SF_DRMB: {
        K_OR: 0.15,
        K_and_PC: 0.3,
        K_and_SP: 0.75,
      },

      models:[
        {
          name: "dqn",
          model_type: "dl",
          params:{
            reward: 1,
            epoch: 100,
            gamma: 0.8,
            learning_rate: 0.01,
          },
          res:{}
        },
        {
          name: "svm",
          model_type: "ml",
          params:{
            kernel: "linear",
            random_state: 42,     
            cv: 5,
          },
          res:{}
        },
        {
          name: "knn",
          model_type: "ml",
          params:{
            random_state: 42,     
            cv: 10,
            paramRange: 3
          },
          res:{}
        }
      ],
      DQN: {
        reward: 1,
        epoch: 100,
        gamma: 0.8,
        learning_rate: 0.01,
      },
      SVM: {
        kernel: "linear",
        random_state: 42,     
        cv: 5,
      },
      KNN: {        
        random_state: 42,     
        cv: 10,
        K: 3
      },

      result: [],
    };
  },
  getters: {},
  actions: {},
  mutations: {
    ChangeStep(state, step) {
      state.step = step;
    },
    ChangeTaskInfo(state, newInfo) {
      state = Object.assign(state, newInfo);
    },
    // ChangeTaskInfo没法深拷贝所以需要单独的函数处理
    SF_DRMB_update(state, newdata) {
      state.SF_DRMB = Object.assign(state.SF_DRMB, newdata);
    },
    DQN_update(state, newdata) {
      state.DQN = Object.assign(state.DQN, newdata);
    },
    SVM_update(state, newdata) {
      state.SVM = Object.assign(state.SVM, newdata);
    },
    KNN_update(state, newdata) {
      state.KNN = Object.assign(state.KNN, newdata);
    },

    models_update(state,payload){
      let name = payload.name;
      let newdata = payload.newdata;
      let all_models = state.models;
      console.log("all_models", all_models, " name:", name)
      all_models.forEach((model, index) => {
        if (model.name === name){
          console.log("all true")
          model.params = Object.assign(state.models[index].params, newdata);
          console.log("task",model.params, "\n", newdata)
        }
      })
      
    },
    models_update_res(state,payload){
      let name = payload.name;
      let res = payload.res;
      let all_models = state.models;
      console.log("all_models", all_models, " name:", name)
      all_models.forEach((model, index) => {
        if (model.name === name){
          console.log("all true_res")
          model.res = Object.assign(state.models[index].res, res);
          console.log("task_res",model.params, "\n", res)
        }
      })
      
    }
  },
};
