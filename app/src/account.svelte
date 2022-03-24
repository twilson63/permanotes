<script>
  import { address, account } from "./store.js";
  import Navbar from "./components/navbar.svelte";
  const profile = $account.profile;
</script>

<Navbar />
<main>
  <section class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col">
      {#if profile}
        <img src={`https://arweave.net/${profile.avatar}`} alt={profile.name} />
        <h1 class="text-6xl">{profile.name}</h1>
        <p>{profile.bio}</p>
      {:else}
        <h1 class="text-6xl">{$address}</h1>
        <p>Profile not found!</p>
        <p>
          Create a profile at <a
            class="underline"
            href="https://arweave.net/HOHBm7vNOoDds4uah2Du2jr7nsELJx9V0C0h54MYLes"
            >Arweave Account</a
          >
        </p>
      {/if}
    </div>
  </section>
</main>
