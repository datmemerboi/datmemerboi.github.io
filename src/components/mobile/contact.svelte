<script>
  import { fancyWords, hyperlinks } from "../../constants.js";
  import Github from "../icons/github.svelte";
  import Mail from "../icons/mail.svelte";
  import Resume from "../icons/resume.svelte";
  import Linkedin from "../icons/linkedin.svelte";
</script>

<div class="contact__container">
  <div class="icon__wrapper">
    <a href={hyperlinks[0]} target="_blank" rel="noreferer">
      <Github />
    </a>
    {@html fancyWords[0]}
  </div>
  <div class="icon__wrapper">
    <a href={hyperlinks[1]} target="_blank" rel="noreferer">
      <Mail />
    </a>
    {@html fancyWords[1]}
  </div>
  <div class="icon__wrapper">
    <a href={hyperlinks[2]} target="_blank" rel="noreferer">
      <Resume />
    </a>
    {@html fancyWords[2]}
  </div>
  <div class="icon__wrapper">
    <a href={hyperlinks[3]} target="_blank" rel="noreferer">
      <Linkedin />
    </a>
    {@html fancyWords[3]}
  </div>
</div>

<style>
  .contact__container {
    display: flex;
    flex-direction: column;
  }
  .icon__wrapper {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 3vmin;
  }
  a {
    display: flex;
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
