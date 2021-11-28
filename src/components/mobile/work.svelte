<script>
  import { projects, jobs, buildTime } from "../../constants.js";
</script>

<div class="container">
  <div class="job__container">
    <h3>At the office</h3>
    <div class="job-title__wrapper">
      <span>
        <strong>{jobs[0].title}</strong>
      </span>&nbsp;
      <snap>at</snap>&nbsp;
      <span>
        <strong>{jobs[0].company}</strong>
      </span>
    </div>
    <div class="job-desc__wrapper">
      {@html jobs[0].description}
    </div>
  </div>
  <div class="code__container">
    <h3>Outside of work</h3>
    <div class="proj__container">
      {#each projects as proj}
        <div class="proj__wrapper">
          <a href={proj.url}>{proj.title}</a>
          <br/>
          <span class="desc">{proj.description}</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    min-height: inherit;
  }
  .job__container {
    flex: 1;
    text-align: center;
  }
  .job-title__wrapper {
    display: inline-flex;
    align-items: baseline;
    font-size: 14px;
  }
  .job-desc__wrapper {
    font-size: 10px;
    text-align: left;
  }
  .code__container {
    flex: 2;
    text-align: center;
  }
  .proj__container {
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
  }
  .proj__wrapper {
    padding: 5vmin 0 5vmin 0;
  }
  .desc {
    font-size: 10px;
    text-align: justify;
  }
  a {
    color: var(--theme-color-1);
    font-weight: bold;
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
