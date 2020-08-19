<template>
  <div class="tile">
    <h1>{{ msg1 }}</h1>
  </div>
</template>

<script>
export default {
  name: 'ChessTile',
  props: {
    msg1: Boolean
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
