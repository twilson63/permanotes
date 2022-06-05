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
  let toggleInfo = false;
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

  function like(note) {
    return async (e) => {
      if (!window.arweaveWallet) {
        likeModal = true;
        return;
      }
      try {
        console.log("like clicked");
        disableLike = true;
        note.id = route.params.id;
        await app.like(likeContract, owner, note);
        liked = true;
        likeCount = likeCount + 1;
      } catch (err) {
        disableLike = false;
        alert("ERROR: " + err.message);
      }
    };
  }

  function unlike(note) {
    return async (e) => {
      if (!window.arweaveWallet) {
        likeModal = true;
        return;
      }
      try {
        disableUnlike = true;
        note.id = route.params.id;
        await app.unlike(likeContract, owner, note);
        liked = false;
        likeCount = likeCount - 1;
      } catch (err) {
        disableLike = false;
        alert("ERROR: " + err.message);
      }
    };
  }

  async function getNote(tx) {
    try {
      loading = true;

      const note = await app.get(tx);
      console.log(note);
      likeCount = note.public && note.likes ? note.likes.length : 0;
      likeContract = note.public ? note.likeContract : "";
      liked =
        $address && note.public && note.likes
          ? note.likes.includes($address)
          : false;

      note.handle = await app.getHandle(note.owner).catch(() => note.owner);
      owner = note.owner;

      loading = false;
      return note;
    } catch (e) {
      console.log(e.message);
      router.goto("/404");
    }
  }

  function encodeText(...args) {
    return encodeURI(args.join(" "));
  }
</script>

<Navbar />
<main>
  <section
    class="mt-8 text-gray-700 relative w-full px-6 py-12 bg-base-200 shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28"
  >
    {#await getNote(route.params.id) then note}
      <div class="float-right pr-8">
        {#if note.owner === $address}
          <a class="btn btn-outline" href="/notes/new?fork={route.params.id}"
            >Fork</a
          >
        {/if}
        {#if note.public}
          <div class="flex flex-col">
            {#if !liked}
              <button
                class="btn btn-ghost"
                on:click={like(note)}
                disabled={disableLike}
              >
                <img class="w-8" src="heart.svg" alt="like button" />
              </button>
            {:else}
              <button
                class="btn btn-ghost"
                on:click={unlike(note)}
                disabled={disableUnlike}
              >
                <img class="w-8" src="fullheart.svg" alt="like button" />
              </button>
            {/if}
            <div class="text-center">{likeCount}</div>
          </div>
        {/if}
      </div>

      <div class="">
        <button
          class="btn btn-outline"
          on:click={() => (toggleInfo = !toggleInfo)}>info</button
        >
      </div>
      {#if toggleInfo}
        <div class="card p-4 shadow-xl">
          <h1 class="text-3xl">{note.title}</h1>
          <p class="">Description: {note.description}</p>
          <p class="">
            By: <a class="underline" href="/profiles/{note.handle}"
              >{note.handle || note.owner}</a
            >
          </p>
          <p class="">
            Topic: <a class="underline" href="/topics/{note.topic}"
              >{note.topic}</a
            >
          </p>
          <p class="">
            Created: {format(
              new Date(note.timestamp),
              "MM-dd-yyyy HH:mm:ss.SSSxxx"
            )}
          </p>
          <p>
            Id: {route.params.id}
            <a
              class="underline"
              target="_blank"
              href="https://twitter.com/intent/tweet?text={encodeText(
                note.title,
                note.description
              )}&url={window.location.href.replace('#', '%23')}">share</a
            >
          </p>
        </div>
      {/if}
      <div class="mt-16 prose prose-lg bg-base-200">
        {@html marked.parse(note.content)}
      </div>
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
