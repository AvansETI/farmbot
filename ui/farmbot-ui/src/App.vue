<template>
  <div id="nav">
    <div id=title>
      <span> Farmbot UI</span>
      </div>
      <div id="menu">
        <router-link to="/">Home</router-link> |
      <router-link to="/welcom">Welkom</router-link>
        </div>
      
  </div>
  <router-view />
</template>

<script>


export default {
  name: 'App',
  components: {
    
  }
}
</script>

<style lang="scss">
html{
  margin: 0;
}

body{
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

#nav {
  width: 100%;
  background: limegreen;
  height: 30px;
  color:white;

  #title{
    text-align: left;
    color: white;
  }

  router-link{
    color: white;
  }
  router-link:hover{
    color: gray;
  }
}
</style>
