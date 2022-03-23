<script>
  import Navbar from "./components/navbar.svelte";
  import NoteCard from "./components/note-card.svelte";
  import SearchForm from "./components/search-form.svelte";
</script>

<Navbar />
<main>
  <section>
    <SearchForm />
    <h1>Notes</h1>
    <div class="flex">
      <NoteCard tx="1" title="hello" description="A note about hello" />
      <NoteCard tx="2" title="goodbye" description="A note about goodbye" />
    </div>
  </section>
</main>
