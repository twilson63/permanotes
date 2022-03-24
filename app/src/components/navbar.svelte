<script>
  import { router } from "tinro";
  import { address } from "../store.js";
  import * as R from "ramda";

  function disconnect() {
    if (window.arweaveWallet) window.arweaveWallet.disconnect();
    address.set("");
    router.goto("/connect");
  }
</script>

<div class="navbar bg-base-100">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost normal-case text-xl">PERMA-NOTES</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal p-0">
      <li><a href="/learn">Learn</a></li>
      {#if R.isEmpty($address)}
        <li><a href="/connect">Connect</a></li>
      {:else}
        <li>
          <button class="btn btn-ghost" on:click={disconnect}>Disconnect</button
          >
        </li>
      {/if}
    </ul>
  </div>
</div>
