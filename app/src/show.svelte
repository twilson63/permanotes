<script>
  import Navbar from "./components/navbar.svelte";
  import { Jumper } from "svelte-loading-spinners";
  import { router, meta } from "tinro";
  import { arweave, account, load } from "./services/arweave.js";
  import { notes } from "./app.js";
  import { marked } from "marked";
  import { format } from "date-fns";
  import { address } from "./store.js";
  import { init as initLikes } from "./services/likes.js";

  let loading = false;

  let likeModal = false;
  let likeContract = "";

  const likes = initLikes(arweave);
  const app = notes({ load, account, likes });
  const route = meta();

  let likeCount = 0;
  let liked = false;
  let disableLike = false;
  let disableUnlike = false;
  let owner = "";

  async function like(e) {
    if (!window.arweaveWallet) {
      likeModal = true;
      return;
    }
    disableLike = true;
    await app.like(likeContract, owner);
    liked = true;
    likeCount = likeCount + 1;
  }

  async function unlike(e) {
    disableUnlike = true;
    await app.unlike(likeContract, owner);
    liked = false;
    likeCount = likeCount - 1;
  }

  async function getNote(tx) {
    try {
      loading = true;

      const note = await app.get(tx);

      likeCount = note.public ? note.likes.length : 0;
      likeContract = note.public ? note.likeContract : "";
      liked =
        window.arweaveWallet && note.public
          ? note.likes.includes(await window.arweaveWallet.getActiveAddress())
          : false;

      note.handle = await app.getHandle(note.owner);
      owner = note.owner;

      loading = false;
      return note;
    } catch (e) {
      console.log(e.message);
      router.goto("/404");
    }
  }
</script>

<Navbar />
<main>
  <section
    class="mt-8 text-gray-700 relative w-full px-6 py-12 bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28"
  >
    {#await getNote(route.params.id) then note}
      {#if note.public}
        <div class="float-right pr-8">
          {#if note.owner === $address}
            <a class="btn btn-outline" href="/notes/new?fork={route.params.id}"
              >Fork</a
            >
          {/if}
          <div class="flex flex-col">
            {#if !liked}
              <button
                class="btn btn-ghost"
                on:click={like}
                disabled={disableLike}
              >
                <img class="w-8" src="heart.svg" alt="like button" />
              </button>
            {:else}
              <button
                class="btn btn-ghost"
                on:click={unlike}
                disabled={disableUnlike}
              >
                <img class="w-8" src="fullheart.svg" alt="like button" />
              </button>
            {/if}
            <div class="text-center">{likeCount}</div>
          </div>
        </div>
      {/if}
      <h1 class="text-3xl">{note.title}</h1>
      <p class="">Description: {note.description}</p>
      <p class="">By: {note.handle || note.owner}</p>
      <p class="">
        Created: {format(
          new Date(note.timestamp),
          "MM-dd-yyyy HH:mm:ss.SSSxxx"
        )}
      </p>
      <div class="mt-16 prose prose-lg">{@html marked.parse(note.content)}</div>
    {/await}
  </section>
</main>

<input
  type="checkbox"
  id="loading-note"
  bind:checked={loading}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Loading Note</h3>
    <div class="flex items-center justify-center">
      <Jumper size="60" color="rebeccapurple" unit="px" duration="2s" />
    </div>
  </div>
</div>

<input
  type="checkbox"
  id="like-note"
  bind:checked={likeModal}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Liking a Note</h3>
    <p class="py-4">
      Thank you for wanting to like this note! Likes are small tips for the
      content creator, in order to like the note, you must have an AR Wallet,
      you can download and install an AR Wallet here:
      <a class="underline" target="_blank" href="https://arconnect.io"
        >https://arconnect.io</a
      >
    </p>

    <div class="modal-action">
      <label for="like-note" class="btn">OK</label>
    </div>
  </div>
</div>
