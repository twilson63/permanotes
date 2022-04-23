<script>
  import Navbar from "./components/navbar.svelte";
  import { Jumper } from "svelte-loading-spinners";
  import { meta } from "tinro";
  import { account, load } from "./services/arweave.js";
  import { notes } from "./app.js";
  import { marked } from "marked";
  import { format } from "date-fns";

  let loading = false;

  const route = meta();
  async function getNote(tx) {
    loading = true;
    const app = notes({ load, account });
    const note = await app.get(tx);
    console.log(note);
    note.handle = await app.getHandle(note.owner);
    loading = false;
    return note;
  }
</script>

<Navbar />
<main>
  <section
    class="mt-8 text-gray-700 relative w-full px-6 py-12 bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28"
  >
    {#await getNote(route.params.id) then note}
      <div class="float-right pr-8">
        <button class="btn btn-ghost">
          <img class="w-8" src="heart.svg" alt="like button" />
        </button>
        <div class="text-center">0</div>
      </div>
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
  id="save-note"
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
