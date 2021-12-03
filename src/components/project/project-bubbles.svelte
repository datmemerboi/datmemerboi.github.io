<!--
  Project Bubble rendering
 -->
<script>
  export let keywords;
</script>

<!-- MARKUP -->
<div class="keyword-container">
  {#each keywords as kw}
    <div class="keyword-bubble">
      <span class="keyword">{kw}</span>
    </div>
  {/each}
</div>

<style>
  .keyword-container {
    display: inline-flex;
  }
  .keyword-bubble {
    padding: 5px 10px 8px 10px;
    margin: 0 3px 0 3px;
    border-radius: 40px;
    color: var(--primary-bg);
    background-color: var(--theme-color-4);
  }
</style>
