<script>
  export let id = "1234";
  export let open = false;
</script>

<input type="checkbox" {id} bind:checked={open} class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <slot />
    <div class="modal-action">
      <label for={id} class="btn">OK</label>
    </div>
  </div>
</div>
