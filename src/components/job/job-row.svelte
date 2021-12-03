<!--
  Job Row rendering
 -->
<script>
  export let job;
</script>

<div class="job-row">
  <div class="job-container">
    <div class="job-content">
      <div class="job-title__wrapper">
        <h2 class="job-title__text">{job.title}</h2>
        &nbsp;
        <span class="job-title__text" style="font-size: 24px">at</span>
        &nbsp;
        <h2 class="job-title__text">{job.company}</h2>
      </div>
      <div class="job-body__wrapper">
        <div class="job-description__wrapper">
          {@html job.description}
        </div>
      </div>
    </div>
    <div class="job-duration">
      <div class="job-duration__wrapper">
        <div class="job-duration-from__wrapper">
          <span id="job-from">{job.from}</span>
        </div>
        <div class="timeline" />
        <div class="job-duration-to__wrapper">
          <span id="job-to">{job.to}</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .job-row {
    /* border: 2px solid var(--theme-color-3); */
    border-radius: 3rem;
    padding: 2.5vmin;
    width: 96%;
  }
  .job-container {
    display: flex;
    flex-direction: row;
  }
  .job-content {
    width: 60vw;
  }
  .job-title__wrapper {
    display: flex;
    align-items: baseline;
  }
  .job-title__text {
    display: flex;
  }
  .job-duration {
    width: 12vw;
  }
  .job-duration__wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    align-items: flex-end;
  }
  .timeline {
    min-height: 60%;
    width: 6px;
    background-color: var(--theme-color-4);
  }
  #job-from,
  #job-to {
    font-size: 22px;
    color: var(--theme-color-4);
  }
  #job-from {
    align-self: flex-start;
  }
  #job-to {
    align-self: flex-end;
  }
</style>
