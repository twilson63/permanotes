<script>
  import { address, account, topics } from "./store.js";
  import Navbar from "./components/navbar.svelte";
  import { gql } from "./services/arweave.js";
  import { notes } from "./app.js";

  const profile = $account.profile;

  async function listWebpages() {
    const app = notes({ gql });
    const results = await app.listWebpages($address);
    console.log(results);
  }
  let webpages = [];
</script>

<Navbar />
<main>
  <section class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col">
      {#if profile}
        <img
          class="mask mask-squircle"
          src={`https://arweave.net/${profile.avatar}`}
          alt={profile.name}
          width="94"
          height="94"
        />
        <h1 class="text-6xl">{profile.name}</h1>
        <p>{profile.bio ? profile.bio : ""}</p>
      {:else}
        <h1 class="text-6xl">Anonymous</h1>
        <p>Profile not found!</p>
        <p>Do you want to create a profile?</p>
        <p>
          Create a profile at <a
            class="underline"
            target="_blank"
            href="https://arweave.net/HOHBm7vNOoDds4uah2Du2jr7nsELJx9V0C0h54MYLes"
            >Arweave Account</a
          >
        </p>
        <p>If not, you can still use PermaNotes...</p>
      {/if}
      {#if $topics.length > 0}
        <div class="flex space-x-4">
          <label>Topics: </label>
          {#each $topics as topic}
            <a class="underline" href="/topics/{topic}">{decodeURI(topic)}</a>
          {/each}
        </div>
      {/if}
      {#if webpages.length > 0}
        <div class="flex space-x-4">
          <label>Webpages: </label>
          {#each webpages as webpage}
            <a class="underline" href="https://arweave.net/{webpage.webpage}"
              >{webpage.title}</a
            >
          {/each}
        </div>
      {/if}
      <div class="flex space-x-8">
        <a href="/notes" class="btn btn-primary">My Notes</a>
        <a href="/favorites" class="btn btn-primary">Favorites</a>
        <a href="/notes/new" class="btn">New Note</a>
      </div>
    </div>
  </section>
</main>
