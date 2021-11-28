<!--
  Project Card rendering
 -->
<script>
  import Bubble from "./project-bubbles.svelte";
  export let project;
</script>

<div class="card-wrapper">
  <div id={project.id} class="card">
    <h2>{project.title}</h2>
    <p>{project.description}</p>
    <Bubble keywords={project.keywords} />
  </div>
</div>

<style>
  h2 {
    font-weight: normal;
  }
  .card-wrapper {
    padding: 1vmin;
    display: flex;
  }
  .card {
    border: 2px solid var(--theme-color-3);
    border-radius: 35px;
    padding: 2.5vmin;
    width: 30vw;
  }
  h2 {
    margin: 0;
    padding: 0;
  }
</style>
