<script>
  import { router } from "tinro";
  import NavBar from "../components/navbar.svelte";
  import Modal from "../components/modal.svelte";
  import { address } from "../store.js";
  import SubdomainTable from "../components/subdomains.svelte";
  import { search, listANTs } from "../services/registry.js";

  let changeDialog = false;
  let transferDialog = false;
  let removeDialog = false;
  let searchDialog = false;
  let searchMessage = "";
  let searchText = "";
  let connectDialog = false;
  let registerDialog = false;
  let register = {};

  async function doSearch() {
    const result = await search(searchText);
    if (result.ok) {
      searchMessage = "No registration found. You may register this subdomain";
      searchDialog = true;
    } else {
      searchText = "";
      searchMessage = "This subdomain is already registered";
      searchDialog = true;
    }
  }

  async function registerDomain() {
    if ($address) {
      registerDialog = true;
      // load pages
      // show dialog
    } else {
      // show message dialog
      connectDialog = true;
    }
  }
  async function submitRegistration() {}
</script>

<NavBar />
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <div class="flex flex-col space-y-16 w-full">
        <div>
          <div class="flex">
            <div class="flex-1 flex items-center space-x-8">
              <h2 class="text-2xl mb-2">ArNS Registry Portal</h2>
              <a class="link" href="https://ar.io/arns">More Information</a>
            </div>
            <div class="flex-none6">
              <button on:click={registerDomain} class="btn btn-secondary"
                >Register</button
              >
            </div>
          </div>
          <div class="overflow-x-auto">
            <div class="flex space-x-4 justify-center my-16">
              <label class="label">Is subdomain available</label>
              <input
                class="input input-bordered"
                placeholder="enter subdomain"
                bind:value={searchText}
              />
              <button class="btn btn-outline" on:click={doSearch}>Search</button
              >
            </div>
            {#if $address}
              {#await listANTs($address) then records}
                <SubdomainTable
                  title="My Records"
                  {records}
                  on:change={() => (changeDialog = true)}
                  on:transfer={() => (transferDialog = true)}
                  on:remove={() => (removeDialog = true)}
                />
              {/await}
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
<Modal open={changeDialog}>
  <h3 class="text-2xl">🛠 Feature coming soon!</h3>
</Modal>
<Modal open={transferDialog}>
  <h3 class="text-2xl">🛠 Feature coming soon!</h3>
</Modal>
<Modal open={removeDialog}>
  <h3 class="text-2xl">🛠 Feature coming soon!</h3>
</Modal>
<Modal open={searchDialog} on:click={() => (searchDialog = false)}>
  <h3 class="text-2xl">Search Result</h3>
  <p class="my-8">{searchMessage}</p>
</Modal>
<Modal
  open={connectDialog}
  on:click={() => {
    connectDialog = false;
    router.goto("/connect");
  }}
>
  <h3 class="text-2xl">Wallet Connection Required!</h3>
  <p class="my-8">
    To register a subdomain you must be connected to permanotes.
  </p>
</Modal>
<Modal open={registerDialog} ok={false}>
  <h3 class="text-2xl">Register subdomain</h3>
  <p class="my-4">
    To register a subdomain, you need a name and arweave transaction to
    reference. You may choose a permapage or arweave transaction.
  </p>
  <form on:submit|preventDefault={submitRegistration}>
    <div class="form-control">
      <label class="label">Subdomain</label>
      <input class="input input-bordered" bind:value={register.subdomain} />
    </div>
    <div class="form-control">
      <label class="label">Choose reference</label>
      <label class="label">
        <input
          type="radio"
          name="reference"
          class="radio radio-primary"
          value="permapage"
          bind:group={register.type}
        />
        Permapage
      </label>
      <label class="label">
        <input
          type="radio"
          name="reference"
          class="radio radio-primary"
          bind:group={register.type}
          value="arweave"
        />
        Arweave Transaction
      </label>
    </div>
    {#if register.type === "permapage"}
      <div class="form-control">
        <label class="label">Select Permapage</label>
        <select class="select select-bordered">
          <option class="option">Tom's Page</option>
        </select>
      </div>
    {/if}
    {#if register.type === "arweave"}
      <div class="form-control">
        <label class="label">Arweave Transaction</label>
        <input class="input input-bordered" />
      </div>
    {/if}
    <div class="mt-8 flex space-x-8 justify-right">
      <button class="btn btn-primary">Register</button>
      <button class="btn" on:click={() => (registerDialog = false)}
        >Cancel</button
      >
    </div>
  </form>
</Modal>
