<!--
  Introduction page rendering
 -->
<script>
  import { intro, introTLDR } from '../constants.js';

  let tldr = true;
  function toggleTLDR() {
    tldr = !tldr;
  }
</script>

<div class="container">
  <div class="img__container">
    <div class="img__wrapper">
      <img
        src="https://github.com/datmemerboi.png"
        alt="Profile pic"
        width="275"
        height="275"
      />
    </div>
  </div>
  <div on:click={toggleTLDR} class="desc__container">
    {#if tldr}
      <!-- Short description -->
      <p>
        {@html introTLDR}
      </p>
      <span id="extra">pst.. pst.. over here! Click me</span>
    {:else}
      <!-- Long description -->
      <p class="long-intro">
        {@html intro}
      </p>
    {/if}
  </div>
</div>

<style>
  .container {
    flex-direction: column;
    position: relative;
    top: 10vh;
  }
  .img__container {
    display: flex;
    justify-content: center;
  }
  .img__wrapper img{
    max-width: 275px;
    max-height: 275px;
    border-radius: 50%;
  }
  .desc__container {
    display: flex;
    /* justify-content: center; */
    flex-direction: column;
    padding: 3vmin;
  }
  p {
    font-size: 32px;
    text-align: center;
  }
  .long-intro {
    font-size: 28px;
    text-align: center;
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
  span#extra {
    font-size: 8px;
    text-align: center;
    animation: fadeIn 10s 30s;
  }
</style>
