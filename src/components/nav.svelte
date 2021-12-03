<!--
  Navigation control goes here
 -->
<script>
  import NavItem from "./nav-item.svelte";
  export let state = "Who I am";
  function stateSetter(value) {
    state = value;
  }
</script>

<div class="nav__container">
  <div class="nav-switch__container">
    <div class="nav-switch__wrapper">
      <ul>
        <li>
          <NavItem
            selected={state === "Who I am"}
            text={"Who I am"}
            onClickHandler={stateSetter}
          />
        </li>
        <li>
          <NavItem
            selected={state === "What I do"}
            text={"What I do"}
            onClickHandler={stateSetter}
          />
        </li>
        <li>
          <NavItem
            selected={state === "How to reach me"}
            text={"How to reach me"}
            onClickHandler={stateSetter}
          />
        </li>
      </ul>
    </div>
  </div>
</div>

<style>
  .nav__container {
    height: 99%;
    width: 100%;
    top: 0;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
  }
  .nav-switch__container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 90%;
  }
  .nav-switch__wrapper {
    align-self: center;
  }
  ul {
    padding: 0;
    list-style-type: none;
  }
  li {
    font-size: 24px;
    padding: 1.5vmin;
    text-align: center;
    color: var(--theme-color-2);
  }
</style>
