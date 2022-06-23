<script>
  import { router, meta } from "tinro";
  import Navbar from "../components/navbar.svelte";
  import { postPageTx } from "../services/arweave.js";
  import { Jumper } from "svelte-loading-spinners";
  import { pages } from "../app.js";
  import { address, cache } from "../store.js";

  //import EasyMDE from "easymde";
  import { onMount } from "svelte";

  var easymde = null;
  let error = null;
  let submitting = false;
  let confirm = false;

  onMount(() => {
    easymde = new window.EasyMDE({
      autosave: {
        enabled: true,
        uniqueId: "new-permapage",
      },
      previewClass: "bg-base-200 p-4 prose prose-lg",
      spellChecker: false,
      nativeSpellcheck: false,
      //inputStyle: "contenteditable",
      //forceSync: true,
    });
  });

  let page = { public: true };

  /*
  if (meta().query.fork) {
    // getNote from meta().query.fork
    notes({ load })
      .get(meta().query.fork)
      .then((n) => {
        page.title = n.title;
        page.description = n.description;
        easymde.value(n.content);
        page.content = n.content;
        page.topic = n.topic;
        page.public = n.public;
      });
  }
  */

  async function submit() {
    confirm = true;
  }

  async function doConfirm() {
    try {
      submitting = true;

      page.content = easymde.value();
      page.owner = $address;

      const result = await pages({ post: postPageTx }).create(page);
      console.log(result);
      page.id = result.id;
      submitting = false;

      if (!result.foundPost) {
        window.scrollTo(0, 0);
        router.goto("/pages");
      } else {
        window.scrollTo(0, 0);
        router.goto("/pages");
      }
    } catch (e) {
      window.scrollTo(0, 0);
      error = e.message;
      submitting = false;
    }
  }
</script>

<Navbar />
<main>
  <section class="hero bg-base-100 min-h-screen items-start">
    <div class="hero-content flex-col">
      {#if error}
        <div class="alert alert-error">
          {error}
        </div>
      {/if}
      <h1 class="text-2xl md:text-6xl">Create Permapage</h1>
      <form class="w-full" on:submit|preventDefault={submit}>
        <div class="form-control">
          <label for="content" class="label">Page Content(markdown)</label>
          <textarea
            class="textarea textarea-bordered textarea-secondary bg-white"
            id="content"
            name="content"
            bind:value={page.content}
          />
        </div>

        <p class="mt-4 alert alert-info">
          When you create a page, it will be posted on the permaweb, and can
          never be removed, the page will be linked to
          https://[subdomain].arweave.net.
        </p>
        <div class="mt-8">
          <button type="submit" class="btn btn-primary">Create Page</button>
          <a class="btn" href="/pages">Cancel</a>
        </div>
      </form>
    </div>
  </section>
</main>

<input
  type="checkbox"
  id="save-note"
  bind:checked={submitting}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Saving Note to Arweave</h3>
    <p class="py-4">
      This should only take a few seconds to store your note on the Permaweb.
      Once successfully stored, it will be stored forever.
    </p>
    <div class="flex items-center justify-center">
      <Jumper size="60" color="rebeccapurple" unit="px" duration="2s" />
    </div>

    <!--
    <div class="modal-action">
      <label for="save-note" class="btn">OK</label>
    </div>
    -->
  </div>
</div>

<input
  type="checkbox"
  id="confirm"
  bind:checked={confirm}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box w-full">
    <h3 class="font-bold text-lg">Complete Permapage</h3>
    <form class="w-full space-y-8" on:submit|preventDefault={doConfirm}>
      <div class="form-control">
        <label for="title" class="label">SubDomain</label>
        <input
          required
          class="input input-bordered"
          id="subdomain"
          name="subdomain"
          maxlength="20"
          bind:value={page.subdomain}
          placeholder="Enter subdomain of your page"
        />
        <small>(max: 20 characters no spaces)</small>
      </div>
      <div class="form-control">
        <label for="title" class="label">Title</label>
        <input
          required
          class="input input-bordered"
          id="title"
          name="title"
          maxlength="20"
          bind:value={page.title}
          placeholder="Enter title of your page that will appear on the browser tab."
        />
        <small>(max: 20 characters)</small>
      </div>
      <div class="form-control">
        <label for="description" class="label">Description</label>
        <textarea
          required
          class="textarea textarea-bordered"
          id="description"
          name="description"
          maxlength="50"
          bind:value={page.description}
          placeholder="Enter a description of your page. This will appear in the meta data of your page for social networks and search engines"
        />
        <small>(max: 50 characters)</small>
      </div>

      <div class="modal-action">
        <button for="confirm" class="btn">Submit</button>
      </div>
    </form>
  </div>
</div>
