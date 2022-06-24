<script>
  import { router, meta } from "tinro";
  import Navbar from "../components/navbar.svelte";
  import Modal from "../components/modal.svelte";
  import { postPageTx, postWebpage, loadPage } from "../services/arweave.js";
  import { register } from "../services/registry.js";
  import { pages } from "../app.js";
  import { address, account } from "../store.js";
  import { marked } from "marked";
  import weavemail from "../widgets/weavemail.js";
  import opensea from "../widgets/opensea.js";
  import Mustache from "mustache";
  //import EasyMDE from "easymde";
  import { onMount } from "svelte";

  var easymde = null;
  let error = null;
  let submitting = false;
  let confirm = false;
  let step = 0;
  let frame;
  let frameDialog = false;

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
    // if (!meta().query.fork) {
    //   easymde.value = "";
    //   page.content = "";
    // }
  });

  let page = { public: true };

  if (meta().query.fork) {
    // getNote from meta().query.fork
    pages({ load: loadPage })
      .get(meta().query.fork)
      .then((p) => {
        page.title = p.title;
        page.description = p.description;
        page.subdomain = p.subdomain;
        easymde.value(p.content);
        page.content = p.content;
        page.profile = p.profile;
      });
  } else {
  }

  async function submit() {
    confirm = true;
  }

  async function doConfirm() {
    try {
      submitting = true;

      page.content = easymde.value();
      page.owner = $address;
      page.html = `<div class="prose-lg">${marked.parse(page.content)}</div>`;

      if (page.ethwallet) {
        const data = await opensea.code.preRender({ address: page.ethwallet });
        page.html =
          Mustache.render(opensea.template(), data) + "\n" + page.html;
      }
      if (page.weavemail) {
        page.html = weavemail.script() + "\n" + page.html;
        page.html =
          Mustache.render(weavemail.template(), {
            address: $account.profile.addr,
          }) +
          "\n" +
          page.html;
      }

      if (page.profile) {
        page.html = hero($account.profile) + "\n" + page.html;
      }

      const result = await pages({
        register,
        post: postPageTx,
        postWebpage,
      }).create(page, (m) => {
        step = m.step;
      });

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

  function hero(profile) {
    function socialIcons(profile) {
      return `
<div class="space-x-8 underline">
  ${
    profile.links.twitter
      ? `<a href="https://twitter.com/${profile.links.twitter}">twitter</a>`
      : ""
  }
  ${
    profile.links.github
      ? `<a href="https://github.com/${profile.links.github}">github</a>`
      : ""
  }
  ${
    profile.links.discord
      ? `<a href="https://discordapp.com/users/${profile.links.discord}">discord</a>`
      : ""
  }
  ${
    profile.links.instagram
      ? `<a href="https://instagram.com/${profile.links.instagram}">instagram</a>`
      : ""
  }
  ${
    profile.links.facebook
      ? `<a href="https://facebook.com/${profile.links.facebook}">facebook</a>`
      : ""
  }
</div>
      `;
    }
    return `
<div class="hero">
  <div class="hero-content flex-col text-center">
    <img
      class="mask mask-squircle"
      src="https://arweave.net/${profile.avatar}"
      alt="${profile.name}"
      width="94"
      height="94"
    />
    <h1 class="text-6xl">${profile.name}</h1>
    <p class="text-2xl">${profile.bio}</p>
    ${socialIcons(profile)}
  </div>
</div>
    `;
  }

  async function getnfts(wallet) {
    const results = await fetch(
      "https://api.opensea.io/api/v1/assets?owner=" + wallet
    ).then((res) => res.json());
    console.log(results);
    return results.assets;
  }

  async function preview() {
    let html = marked.parse(easymde.value());
    html = `<div class="prose-lg mt-16">${html}</div>`;
    if (page.ethwallet) {
      const data = await opensea.code.preRender({ address: page.ethwallet });
      html = Mustache.render(opensea.template(), data) + "\n" + html;
    }
    if (page.weavemail) {
      html = weavemail.script() + "\n" + html;
      html =
        Mustache.render(weavemail.template(), {
          address: $account.profile.addr,
        }) +
        "\n" +
        html;
    }

    if (page.profile) {
      html = hero($account.profile) + "\n" + html;
    }

    sessionStorage.setItem("html", html);
    window.scrollTo(0, 0);
    frameDialog = true;
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
      <h1 class="text-2xl">Create Permapage</h1>
      <form class="w-full" on:submit|preventDefault={submit}>
        <div class="mt-4 form-control">
          <label for="profile" class="label cursor-pointer">
            <span class="label-text"
              >Profile (if marked the page will insert your account as a header
              to the page.)</span
            >
            <input
              type="checkbox"
              class="toggle toggle-secondary"
              bind:checked={page.profile}
            />
          </label>
        </div>
        <div class="mt-4 form-control">
          <label for="weavemail" class="label cursor-pointer">
            <span class="label-text"
              >WeaveMail - Toggle to on, to add Weavemail form</span
            >
            <input
              type="checkbox"
              class="toggle toggle-secondary"
              bind:checked={page.weavemail}
            />
          </label>
        </div>
        <div class="mt-4 form-control">
          <label for="gallery" class="label cursor-pointer">
            <span class="label-text"
              >NFT Gallery - Enter Etherium Wallet Address</span
            >
            <input
              type="input"
              class="input input-bordered w-1/2"
              bind:value={page.ethwallet}
            />
          </label>
        </div>
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
          never be removed, once published you register a subdomain on ArNS
          https://[subdomain].arweave.net.
        </p>
        <div class="mt-8">
          <button type="button" class="btn btn-secondary" on:click={preview}
            >Preview</button
          >
          <button type="submit" class="btn btn-primary">Publish</button>
          <a class="btn" href="/pages">Cancel</a>
        </div>
      </form>
    </div>
  </section>
</main>

<input
  type="checkbox"
  id="confirm"
  bind:checked={confirm}
  class="modal-toggle"
/>
<div class="modal">
  <div class="modal-box w-full relative">
    <label for="confirm" class="btn btn-sm btn-circle absolute right-2 top-2"
      >x</label
    >
    <h3 class="font-bold text-lg">Complete Permapage</h3>
    <form class="w-full space-y-8" on:submit|preventDefault={doConfirm}>
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
<Modal open={submitting}>
  <h3 class="text-2xl">Creating Webpage!</h3>
  <ul class="steps steps-vertical">
    <li class="step {step === 1 ? 'step-primary' : ''}">Generating Page</li>
    <li class="step {step === 2 ? 'step-primary' : ''}">Publishing Page</li>
    <li class="step {step === 3 ? 'step-primary' : ''}">Saving Source</li>
  </ul>
</Modal>
{#if frameDialog}
  <div class="absolute inset-0 p-8 bg-base-100">
    <div class="flex mb-16">
      <h3 class="text-lg flex-1">Preview Permapage</h3>
      <div class="flex-0 flex justify-end space-x-4">
        <button class="btn" on:click={() => (frameDialog = false)}
          >Close Preview</button
        >
      </div>
    </div>

    <div class="mockup-window border border-base-300">
      <iframe
        bind:this={frame}
        class="min-h-screen w-full m-8"
        src="/#/preview"
      />
    </div>
  </div>
{/if}
