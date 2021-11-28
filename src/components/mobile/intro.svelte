<script>
  import { introTLDR } from "../../constants.js";

</script>
<div class="container">
  <div class="img__container">
    <div class="img__wrapper">
      <img
        src="https://github.com/datmemerboi.png"
        alt="Profile pic"
        width="215"
        height="215"
      />
    </div>
  </div>
  <div class="desc__container">
    <p>
      {@html introTLDR}
    </p>
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
  .img__wrapper img {
    max-width: 215px;
    max-height: 215px;
    border-radius: 50%;
  }
  .desc__container {
    display: flex;
    /* justify-content: center; */
    flex-direction: column;
    padding: 3vmin;
  }
  p {
    font-size: 16px;
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
</style>
