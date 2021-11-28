<!--
  Only dimension allocation, global styles & context switching goes here
 -->
<script>
  import Work from "./components/work.svelte";
  import Contact from "./components/contact.svelte";
  import Intro from "./components/intro.svelte";
  import Nav from "./components/nav.svelte";
  import Content from "./components/content.svelte";

  import MobileMenu from "./components/mobile/nav.svelte";
  import MobileContent from "./components/mobile/content.svelte";
  import MobileIntro from "./components/mobile/intro.svelte";
  import MobileWork from "./components/mobile/work.svelte";
  import MobileContact from "./components/mobile/contact.svelte";

  let navState;
  $: innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

{#if innerWidth > 1200}
  <!-- DESKTOP BROWSER -->
  <div>
    <div class="navbar-container">
      <Nav bind:state={navState} />
    </div>
    <Content>
      {#if navState === "What I do"}
        <!-- What I do -->
        <Work />
      {:else if navState === "How to reach me"}
        <!-- How to reach me -->
        <Contact />
      {:else}
        <!-- Who I am -->
        <Intro />
      {/if}
    </Content>
  </div>
{:else}
  <div class="container">
    <!-- Entire mobile screen -->
    <div>
      <MobileContent>
        {#if navState === "What I do"}
        <!-- What I do -->
        <MobileWork />
      {:else if navState === "How to reach me"}
        <!-- How to reach me -->
        <MobileContact />
      {:else}
        <!-- Who I am -->
        <MobileIntro />
      {/if}
      </MobileContent>
      <!-- Nav Tabs -->
      <MobileMenu bind:state={navState}/>
    </div>
  </div>
{/if}

<style>
  * {
    font-family: "Inter", sans-serif;
  }
  :root {
    --primary-bg: #f5f5f5;
    --primary-text: #000000;
    --theme-color-1: #9966cc;
    --theme-color-2: #744c9b;
    --theme-color-3: #c4c4c4;
    --theme-color-4: #ff3d68;
  }
  :global(body) {
    background-color: var(--primary-bg);
    color: var(--primary-text);
  }
  :global(h1) {
    color: var(--primary-text);
  }
  :global(h2) {
    color: var(--theme-color-dark-2);
  }
  .container {
    display: flex;
    flex-direction: column;
  }
  .navbar-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 25vw;
    height: 100%;
    border-right: solid 1px var(--theme-color-3);
  }
</style>
