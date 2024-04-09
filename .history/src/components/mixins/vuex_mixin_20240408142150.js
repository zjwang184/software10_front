import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState({ m_dataList: "dataList" }),
    ...mapGetters({ m_dataDisList: "dataDisList" }),
    m_step() {
      return this.$store.state[this.moduleName].step;
    },
    m_taskName() {
      return this.$store.state[this.moduleName].taskName;
    },
    m_principal() {
      return this.$store.state[this.moduleName].principal;
    },
    m_participants() {
      return this.$store.state[this.moduleName].participants;
    },
    m_disease() {
      return this.$store.state[this.moduleName].disease;
    },
    m_comment() {
      return this.$store.state[this.moduleName].comment;
    },
    m_dataset() {
      return this.$store.state[this.moduleName].dataset;
    },
    m_all_features() {
      return this.$store.state[this.moduleName].all_features;
    },
    m_use_features() {
      return this.$store.state[this.moduleName].use_features;
    },
    m_known_features() {
      return this.$store.state[this.moduleName].known_features;
    },
    m_target_features() {
      return this.$store.state[this.moduleName].target_features;
    },
    m_algorithm() {
      return this.$store.state[this.moduleName].algorithm;
    },
    m_SF_DRMB() {
      return this.$store.state[this.moduleName].SF_DRMB;
    },
    m_DQN() {
      return this.$store.state[this.moduleName].DQN;
    },
    m_SVM() {
      return this.$store.state[this.moduleName].SVM;
    },
    m_KNN() {
      return this.$store.state[this.moduleName].SVM;
    },
    m_models(newdata) {
      return this.$store.state[this.moduleName].models;
    },

    m_result() {
      return this.$store.state[this.moduleName].result;
    },
  },
  methods: {
    m_changeStep(newStep) {
      this.$store.commit(`${this.moduleName}/ChangeStep`, newStep);
    },
    m_changeTaskInfo(newValue) {
      this.$store.commit(`${this.moduleName}/ChangeTaskInfo`, newValue);
    },
    m_SF_DRMB_update(newdata) {
      this.$store.commit(`${this.moduleName}/SF_DRMB_update`, newdata);
    },
    m_DQN_update(newdata) {
      this.$store.commit(`${this.moduleName}/DQN_update`, newdata);
    },
    m_SVM_update(newdata) {
      this.$store.commit(`${this.moduleName}/SVM_update`, newdata);
    },
    m_KNN_update(newdata) {
      this.$store.commit(`${this.moduleName}/KNN_update`, newdata);
    },

    m_models_update(payload) {
      this.$store.commit(`${this.moduleName}/models_update`, payload);
    },

    m_models_update_res(payload) {
      this.$store.commit(`${this.moduleName}/models_update_res`, payload);
    },
  },
};
