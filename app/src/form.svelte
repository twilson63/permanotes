<script>
  import Navbar from "./components/navbar.svelte";
  import { postTx } from "./services/arweave.js";
  import { createNote } from "./models/notes.js";
  import { address } from "./store.js";

  import EasyMDE from "easymde";
  import { onMount } from "svelte";

  var easymde = null;

  onMount(() => {
    easymde = new EasyMDE();
  });

  let note = { tags: [], public: false };

  async function submit() {
    note.content = easymde.value();
    console.log("CONTENT: ", note.content);
    note.owner = $address;
    const data = createNote(note);
    console.log("data", data);
    //const result = await postTx(data);
    console.log("result", result);
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/easymde/dist/easymde.min.css"
  />
  <script src="https://unpkg.com/easymde/dist/easymde.min.js"></script>
</svelte:head>

<Navbar />
<main>
  <section class="hero bg-base-100 min-h-screen">
    <div class="hero-content flex-col">
      <form class="w-full" on:submit|preventDefault={submit}>
        <div class="form-control">
          <label for="title" class="label">Title</label>
          <input
            class="input input-bordered"
            id="title"
            name="title"
            bind:value={note.title}
            placeholder="Enter title of your note (max: 20 characters)"
          />
        </div>
        <div class="form-control">
          <label for="description" class="label">Description</label>
          <input
            class="input input-bordered"
            id="description"
            name="description"
            bind:value={note.description}
            placeholder="Enter a 50 character description of your note."
          />
        </div>
        <div class="form-control">
          <label for="content" class="label">Content(markdown)</label>
          <textarea
            class="textarea textarea-bordered textarea-secondary bg-white"
            id="content"
            name="content"
          />
        </div>
        <div class="form-control">
          <label for="topic" class="label">Topic</label>
          <input
            class="input input-bordered"
            id="topic"
            name="topic"
            bind:value={note.tags}
            placeholder="Enter a topic for your note."
          />
        </div>
        <div class="mt-4 form-control">
          <label for="public" class="label cursor-pointer">
            <span class="label-text"
              >Public (if marked public the note will be unencrypted and
              viewable by everyone.)</span
            >
            <input
              type="checkbox"
              class="toggle toggle-secondary"
              bind:checked={note.public}
            />
          </label>
        </div>
        <p class="mt-4 alert alert-info">
          When you create a note, it will be posted on the permaweb, and can
          never be removed, if you choose to keep it private it will be
          encrypted by your wallet.
        </p>
        <div class="mt-8">
          <button type="submit" class="btn">Create Note</button>
          <a class="btn" href="/notes">Cancel</a>
        </div>
      </form>
    </div>
  </section>
</main>
