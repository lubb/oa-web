<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @import "./assets/style/main.scss";
  /*@import "./assets/style/color-dark.css";     !*深色主题*!*/
  @import "./assets/style/theme-green/color-green.css"; /*浅绿色主题*/

</style>
