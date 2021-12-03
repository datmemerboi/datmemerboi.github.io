<script>
  export let selected = false, text, onClickHandler;
</script>

<span
  on:click={onClickHandler(text)}
  class={ selected ? "selected" : "" }
>{text}</span>

<style>
  span {
    font-size: 32px;
  }
  .selected {
    font-weight: bold;
  }
</style>
