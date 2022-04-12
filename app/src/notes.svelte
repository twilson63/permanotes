<script>
  import Navbar from "./components/navbar.svelte";
  import NoteCard from "./components/note-card.svelte";
  import SearchForm from "./components/search-form.svelte";

  let search = false;
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
        <NoteCard
          tx="1"
          title="hello"
          description="A note about hello"
          topic="personal"
        />
        <NoteCard
          tx="2"
          title="goodbye"
          description="A note about goodbye"
          topic="work"
        />
      </div>
    </div>
  </section>
</main>
