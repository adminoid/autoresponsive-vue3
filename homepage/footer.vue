<template>
  <footer class="text-center">
    <hr/>
    &copy;&nbsp;<a href="//github.com/adminoid">adminoid</a> {{new Date().getFullYear()}}
  </footer>
</template>
<script>
export default {
  name: 'customFooter'
};
</script>
<style lang="less">
footer {
  padding: 20px 0;
}
</style>
