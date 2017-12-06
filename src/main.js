// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

Vue.config.productionTip = false

const messages = {
  'en-US': {
    message: {
      addFile: 'Add File',
      copy: 'Make & Copy',
      files: 'Files',
      noImageFiles: 'no image file',
      noMarkers: 'no rect selected, double click rect selecotr to add',
      markers: 'Markers',
      result: 'result',
      successful: 'successful',
      unsuccessful: 'unsuccessful',
      copyErr: 'Oops, unable to copy',
      copying: 'Copying '
    }
  },
  'zh-CN': {
    message: {
      addFile: '添加文件',
      copy: '复制',
      files: '文件',
      noImageFiles: '请先添加图像文件',
      noMarkers: '还没有任何选中标记，在选择框上双击即可添加',
      markers: '标记',
      result: '结果预览',
      successful: '成功',
      unsuccessful: '失败',
      copyErr: '复制失败！',
      copying: '复制'
    }
  }
}

const i18n = new VueI18n({
  locale: navigator.language,
  messages
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  i18n,
  components: { App }
})
