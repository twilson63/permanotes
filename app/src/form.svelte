<script>
  import { router } from "tinro";
  import Navbar from "./components/navbar.svelte";
  import { postTx, waitfor } from "./services/arweave.js";
  import { createNote } from "./models/notes.js";
  import { address } from "./store.js";

  //import EasyMDE from "easymde";
  import { onMount } from "svelte";

  var easymde = null;
  let error = null;

  onMount(() => {
    easymde = new window.EasyMDE();
  });

  let note = { public: false };

  async function submit() {
    note.content = easymde.value();
    console.log("CONTENT: ", note.content);
    note.owner = $address;
    const data = createNote(note);
    console.log("data", data);
    const id = await postTx(data);
    window.scrollTo(0, 0);
    await waitfor(id);
    router.goto("/notes");
  }
</script>

<Navbar />
<main>
  <section class="hero bg-base-100 min-h-screen">
    <div class="hero-content flex-col">
      {#if error}
        <div class="alert alert-error">
          {error}
        </div>
      {/if}
      <form class="w-full" on:submit|preventDefault={submit}>
        <div class="form-control">
          <label for="title" class="label">Title</label>
          <input
            class="input input-bordered"
            id="title"
            name="title"
            maxlength="20"
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
            maxlength="50"
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
            bind:value={note.topic}
            placeholder="(optional) Enter a topic for your note."
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
