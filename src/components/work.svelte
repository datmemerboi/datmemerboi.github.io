<!--
  Work page rendering
 -->
<script>
  import { projects, jobs, buildTime } from "../constants.js";
  import Row from "./job/job-row.svelte";
  import Card from "./project/project-card.svelte";
</script>

<!-- MARKUP -->
<div>
  <!-- WORK CONTAINER -->
  <div id="at_office">
    <!-- OFFICE CONTAINER -->
    <h1>At the office</h1>
    <div>
      <!-- JOBS CONTAINER -->
      {#each jobs as j}
        <Row job={j} />
      {/each}
    </div>
  </div>
  <div id="outside_office">
    <!-- OUTSIDE CONTAINER -->
    <h1>Outside of work</h1>
    <div class="card-container">
      <!-- PROJ CONTAINER -->
      {#each projects.slice(0, 2) as p}
        <Card project={p} />
        <!-- <p>{JSON.stringify(project)}</p> -->
      {/each}
    </div>
  </div>
  <footer>
    This page was last updated at: <code
      >"{new Date(buildTime).toISOString()}"</code
    >. Those damn
    <a
      href="https://github.com/datmemerboi?tab=repositories"
      target="_blank"
      rel="noreferrer"
      class="ext-link">github repos</a
    > might have caught up.
  </footer>
</div>

<style>
  #at_office, #outside_office {
    padding: 1vmin 0 1vmin 0;
  }
  h1 {
    color: var(--theme-color-dark-1);
  }
  .card-container {
    display: flex;
    flex-direction: row;
  }
  footer {
    position: absolute;
    bottom: 0;
    left: 10vw;
    text-align: center;
  }
  .ext-link {
    color: var(--theme-color-2);
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  div {
    animation: fadeIn 1s;
  }
</style>
