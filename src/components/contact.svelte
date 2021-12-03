<!--
  Contact page rendering
 -->
<script>
  import { fancyWords, hyperlinks } from "../constants.js";
  import Github from "./icons/github.svelte";
  import Mail from "./icons/mail.svelte";
  import Resume from "./icons/resume.svelte";
  import Linked from "./icons/linkedin.svelte";
</script>

<div class="icon__container">
  <div class="icon__wrapper">
    <div class="icon__holder">
      <a href={hyperlinks[0]} target="_blank" rel="noreferrer">
        <Github />
      </a>
    </div>
    <div class="icon__text">{@html fancyWords[0]}</div>
  </div>
  <div class="icon__wrapper">
    <div class="icon__holder">
      <a href={hyperlinks[1]} target="_blank" rel="noreferrer">
        <Mail />
      </a>
    </div>
    <div class="icon__text">{@html fancyWords[1]}</div>
  </div>
  <div class="icon__wrapper">
    <div class="icon__holder">
      <a href={hyperlinks[2]} target="_blank" rel="noreferrer">
        <Resume />
      </a>
    </div>
    <div class="icon__text">{@html fancyWords[2]}</div>
  </div>
  <div class="icon__wrapper">
    <div class="icon__holder">
      <a href={hyperlinks[3]} target="_blank" rel="noreferrer">
        <Linked />
      </a>
    </div>
    <div class="icon__text">{@html fancyWords[3]}</div>
  </div>
</div>

<style>
  a {
    color: none !important;
    text-decoration: none;
  }
  .icon__container {
    top: 32vh;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .icon__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .icon__holder {
    align-self: center;
  }
  .icon__text {
    font-size: 14px;
    text-align: center;
    align-self: center;
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
