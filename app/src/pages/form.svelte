<script>
  import { router, meta } from "tinro";
  import Navbar from "../components/navbar.svelte";
  import Modal from "../components/modal.svelte";
  import { postPageTx, postWebpage, loadPage } from "../services/arweave.js";
  import { register } from "../services/registry.js";
  import { Jumper } from "svelte-loading-spinners";
  import { pages } from "../app.js";
  import { address, account } from "../store.js";
  import { marked } from "marked";
  import DOMPUrify from "dompurify";
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
    console.log($account);
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
        {#if page.profile && $account.profile}
          <div class="hero">
            <div class="hero-content flex-col text-center">
              <img
                class="mask mask-squircle"
                src={`https://arweave.net/${$account.profile.avatar}`}
                alt={$account.profile.name}
                width="94"
                height="94"
              />
              <h1 class="text-6xl">{$account.profile.name}</h1>
              <p class="text-2xl">{$account.profile.bio}</p>
              <div class="flex underline space-x-8">
                {#if $account.profile.links.twitter}
                  <a href="https://twitter.com/{$account.profile.links.twitter}"
                    >twitter</a
                  >
                {/if}
                {#if $account.profile.links.github}
                  <a href="https://github.com/{$account.profile.links.github}"
                    >github</a
                  >
                {/if}
                {#if $account.profile.links.discord}
                  <a
                    href="https://discordapp.com/users/{$account.profile.links
                      .discord}">discord</a
                  >
                {/if}
                {#if $account.profile.links.instagram}
                  <a
                    href="https://www.instagram.com/{$account.profile.links
                      .instagram}">instagram</a
                  >
                {/if}
                {#if $account.profile.links.facebook}
                  <a
                    href="https://facebook.com/{$account.profile.links
                      .facebook}">facebook</a
                  >
                {/if}
              </div>
            </div>
          </div>
        {/if}
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
        {#if page.weavemail && $account.profile}
          <div class="card">
            <h1 class="text-3xl">Write to me!</h1>
            <input type="hidden" name="to" value={$account.profile.address} />
            <div class="form-control">
              <label class="label" for="subject">Subject</label>
              <input
                class="input input-bordered"
                type="text"
                placeholder="Subject"
                id="subject"
              />
            </div>
            <div class="form-control">
              <label class="label" for="content">Mail contents</label>
              <textarea
                class="textarea textarea-bordered h-16"
                id="content"
                placeholder="Hello there..."
              />
            </div>
            <div class="form-control">
              <label class="label" for="donate"> (Optional) Send me AR</label>
              <input
                class="input input-bordered"
                type="text"
                placeholder="0 AR"
                id="donate"
              /><br />
            </div>
            <button disabled class="btn">Send</button>
          </div>
        {/if}
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
        {#if false}
          <h2 class="text-3xl my-8">My NFTs</h2>
          {#await getnfts(page.ethwallet) then nfts}
            <div class="carousel rounded-box w-full">
              {#each nfts as nft}
                <div class="carosel-item">
                  <div class="card w-96 h-full">
                    <figure><img src={nft.image_url} alt={nft.name} /></figure>
                    <div class="card-body">
                      <h2 class="card-title">{nft.name}</h2>
                      <p>{nft.description}</p>
                      <div class="card-actions justify-end">
                        <a
                          href={nft.permalink}
                          target="_blank"
                          class="btn btn-primary">View</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/await}
        {/if}
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
<Modal open={submitting}>
  <h3 class="text-2xl">Creating Webpage!</h3>
  <ul class="steps steps-vertical">
    <li class="step {step === 1 ? 'step-primary' : ''}">Generating Page</li>
    <li class="step {step === 2 ? 'step-primary' : ''}">Publishing Page</li>
    <li class="step {step === 3 ? 'step-primary' : ''}">Saving Source</li>
  </ul>
</Modal>
