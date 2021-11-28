
<script>
  import MobileTab from "./tab.svelte";

  let titles = ["Who I am", "What I do", "How to reach me"];
  export let state = titles[0];
  function stateSetter(value) {
    state = value;
  }
</script>

{#each titles.filter(t => t != state) as title}
  <MobileTab content={title} onClickHandler={stateSetter}/>
{/each}
