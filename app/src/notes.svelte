<script>
  import Navbar from "./components/navbar.svelte";
  import NoteCard from "./components/note-card.svelte";
  import SearchForm from "./components/search-form.svelte";
</script>

<Navbar />
<main>
  <section class="hero bg-base-200">
    <div class="hero-content flex-col">
      <SearchForm />
      <h1>Notes</h1>
      <a href="/notes/new" class="btn btn-primary">New Note</a>
      <div class="flex flex-col space-y-4">
        <NoteCard tx="1" title="hello" description="A note about hello" />
        <NoteCard tx="2" title="goodbye" description="A note about goodbye" />
      </div>
    </div>
  </section>
</main>
