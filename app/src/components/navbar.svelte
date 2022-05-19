<script>
  import { router } from "tinro";
  import { address, account } from "../store.js";
  import * as R from "ramda";

  function disconnect() {
    if (window.arweaveWallet) window.arweaveWallet.disconnect();
    address.set("");
    router.goto("/connect");
  }
</script>

<div class="navbar bg-base-100 max-w-full">
  <div class="md:hidden dropdown">
    <label tabindex="0" class="btn mask mask-circle">
      {#if $account && $account.profile}
        <img
          src={`https://arweave.net/${$account.profile.avatar}`}
          alt="avatar"
          width="48"
          heigth="48"
        />
      {:else}
        <img
          class="bg-base-100"
          src="note.svg"
          alt="menu"
          width="48"
          height="48"
        />
      {/if}
    </label>
    <ul
      tabindex="0"
      class="dropdown-content menu p-2 shadow bg-base-100 rounded-box md:w-52"
    >
      <li>
        <a href="/notes/Xx8lQw1q9xOUn1mB7CMagKHgv8XUy9NxsrQLtfqZItY">Learn</a>
      </li>
      {#if R.isEmpty($address)}
        <li><a href="/connect">Connect</a></li>
      {:else}
        <li><a href="/notes">Notes</a></li>
        <li><a href="/account">Account</a></li>
        <li>
          <button class="btn-link" on:click|preventDefault={disconnect}
            >Disconnect</button
          >
        </li>
      {/if}
    </ul>
  </div>
  <div class="flex-1">
    <a href="/" class="btn btn-ghost normal-case text-xl">PERMA NOTES</a>
    <div class="badge badge-secondary">ALPHA 3a</div>
  </div>
  <div class="flex-none">
    <ul class="hidden md:inline-flex menu menu-horizontal p-0">
      <li>
        <a href="/notes/Xx8lQw1q9xOUn1mB7CMagKHgv8XUy9NxsrQLtfqZItY">Learn</a>
      </li>
      {#if R.isEmpty($address)}
        <li><a href="/connect">Connect</a></li>
      {:else}
        <li><a href="/notes">Notes</a></li>
        <li><a href="/account">Account</a></li>
        <li>
          <button class="btn-link" on:click={disconnect}>Disconnect</button>
        </li>
      {/if}
    </ul>
  </div>
</div>
