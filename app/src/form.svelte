<script>
  import Navbar from "./components/navbar.svelte";
</script>

<Navbar />
<main>
  <section class="hero bg-base-100 min-h-screen">
    <div class="hero-content flex-col">
      <h2 class="text-6xl">Create a PermaNote</h2>
      <p>
        When you create a note, it will be posted on the permaweb, and can never
        be removed, if you choose to keep it private it will be encrypted by
        your wallet.
      </p>
      <form class="w-full">
        <div class="form-control">
          <label for="title" class="label">Title</label>
          <input
            class="input input-bordered input-secondary"
            id="title"
            name="title"
          />
        </div>
        <div class="form-control">
          <label for="description" class="label">Description</label>
          <input
            class="input input-bordered input-secondary"
            id="description"
            name="description"
          />
        </div>
        <div class="form-control">
          <label for="content" class="label">Content(markdown)</label>
          <textarea
            class="textarea textarea-bordered textarea-secondary"
            id="content"
            name="content"
          />
        </div>
        <div class="form-control">
          <label for="tag" class="label">Tag</label>
          <input class="input input-bordered" id="tag" name="tag" />
        </div>
        <div class="form-control">
          <label for="public" class="label cursor-pointer">
            <span class="label-text">Public</span>
            <input type="checkbox" class="toggle toggle-secondary" />
          </label>
        </div>
        <div>
          <button class="btn">Create Note</button>
          <a class="btn" href="/notes">Cancel</a>
        </div>
      </form>
    </div>
  </section>
</main>
