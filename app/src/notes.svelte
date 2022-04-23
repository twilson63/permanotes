<script>
  import Navbar from "./components/navbar.svelte";
  import NoteCard from "./components/note-card.svelte";
  import SearchForm from "./components/search-form.svelte";
  import { Jumper } from "svelte-loading-spinners";
  import { address } from "./store.js";
  import { gql } from "./services/arweave.js";
  import { notes } from "./app.js";

  let search = false;
  let loading = false;

  async function listNotes() {
    try {
      loading = true;
      const results = await notes({ gql }).byOwner($address);
      loading = false;
      return results;
    } catch (e) {
      loading = false;
      alert(e.message);
    }
  }
</script>

<Navbar />
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col w-full">
      {#if search}
        <SearchForm />
      {/if}
      <div class="flex w-full">
        <h1 class="text-2xl flex-1">Notes</h1>
        <div class="flex-none flex space-x-4">
          <button
            on:click={() => {
              search = !search;
            }}
            class="btn btn-ghost"
          >
            <img src="search.svg" alt="search button" style="width: 32px;" />
          </button>
          <a href="/notes/new" class="btn btn-primary">New Note</a>
        </div>
      </div>
      <div class="flex flex-col space-y-4 w-full">
        {#await listNotes() then notes}
          {#each notes as note}
            <NoteCard
              id={note.id}
              title={note.title}
              description={note.description}
              topic={note.topic}
              timestamp={note.timestamp}
            />
          {/each}
        {/await}
        <!--
        <NoteCard
          tx="2"
          title="goodbye"
          description="A note about goodbye"
          topic="work"
        />
        -->
      </div>
    </div>
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
    <h3 class="font-bold text-lg">Loading Notes</h3>
    <div class="flex items-center justify-center">
      <Jumper size="60" color="rebeccapurple" unit="px" duration="2s" />
    </div>
  </div>
</div>
