import Vue from 'vue'

let minxin = {
  data() {
    return {
    }
  },
  methods: {
    /**
     * 获取上传图片地址
     * @returns {string}
     */
    getSysFileUpload(){
      return this.$store.state.uploadUrl+"/file/upload/";
    },
    /**
     * 获取文件路径
     * @returns {string}
     */
    getSysFileOrigin(){
      return this.$store.state.uploadUrl+"/file/origin/";
    },
    /**
     * 获取编辑器文件上传地址
     * @returns {string}
     */
    getSysEditorUpload(){
      return this.$store.state.uploadUrl+"/file/imageEditor/";
    },
    /**
     * 格式化时间格式 date -> str[yyyy-mm-dd hh:mm:ss]
     * @param time
     * @returns {string}
     */
    formatDateTime(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? ('0' + month) : month;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h=h < 10 ? ('0' + h) : h;
      let minute = date.getMinutes();
      minute = minute < 10 ? ('0' + minute) : minute;
      let second=date.getSeconds();
      second=second < 10 ? ('0' + second) : second;
      return year + '-' + month + '-' + d+' '+h+':'+minute+':'+second;
    },
    /**
     * 日期格式化 date -> [yyyy-mm-dd]
     * @param time
     * @returns {string}
     */
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? ('0' + month) : month;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return year + '-' + month + '-' + d;
    }
  }
};

Vue.mixin(minxin);
