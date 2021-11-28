<!--
  Navigation on Mobile device
 -->
<script>
  export let content = "", onClickHandler;
</script>

<div class="tab" on:click={onClickHandler(content)}>
  <div class="tab__content">
    {content}
  </div>
</div>

<style>
  .tab {
    min-height: 5vh;
    border: solid 2px var(--theme-color-3) !important;
    color: var(--theme-color-2);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .tab__content {
    min-height: inherit;
    display: flex;
    align-items: center;
    text-align: center;
  }
</style>
