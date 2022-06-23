<script>
  import { createEventDispatcher } from "svelte";

  export let id = "1234";
  export let open = false;
  export let ok = true;

  const dispatch = createEventDispatcher();

  function okClick() {
    open = false;
    dispatch("click");
  }
</script>

<input type="checkbox" {id} bind:checked={open} class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <slot />
    {#if ok}
      <div class="modal-action">
        <button class="btn" on:click={okClick}>OK</button>
      </div>
    {/if}
  </div>
</div>
