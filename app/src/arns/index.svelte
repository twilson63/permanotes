<script>
  import { router } from "tinro";
  import NavBar from "../components/navbar.svelte";
  import Modal from "../components/modal.svelte";
  import { address } from "../store.js";
  import SubdomainTable from "../components/subdomains.svelte";
  import { search, listANTs, register } from "../services/registry.js";
  import { pages } from "../app.js";
  import { gql } from "../services/arweave.js";

  let changeDialog = false;
  let transferDialog = false;
  let removeDialog = false;
  let searchDialog = false;
  let searchMessage = "";
  let searchText = "";
  let connectDialog = false;
  let registerDialog = false;
  let registerData = {};
  let successDialog = false;
  let errorDialog = false;
  let errorMessage = "";

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
  async function submitRegistration() {
    registerDialog = false;
    const result = await pages({ register }).purchase({
      name: registerData.subdomain,
      owner: $address,
      transactionId: registerData.transactionId,
    });
    if (result.ok) {
      successDialog = true;
    } else {
      errorMessage = result.message;
      errorDialog = true;
    }
  }
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
      <input class="input input-bordered" bind:value={registerData.subdomain} />
    </div>
    <div class="form-control">
      <label class="label">Choose reference</label>
      <label class="label">
        <input
          type="radio"
          name="reference"
          class="radio radio-primary"
          value="permapage"
          bind:group={registerData.type}
        />
        Permapage
      </label>
      <label class="label">
        <input
          type="radio"
          name="reference"
          class="radio radio-primary"
          bind:group={registerData.type}
          value="arweave"
        />
        Arweave Transaction
      </label>
    </div>
    {#if registerData.type === "permapage"}
      <div class="form-control">
        <label class="label">Select Permapage</label>
        <select
          class="select select-bordered"
          bind:value={registerData.transactionId}
        >
          <option class="option" value="">Select Permapage</option>
          {#await pages({ gql }).list($address) then permapages}
            {#each permapages as p}
              <option value={p.id}>{p.title}</option>
            {/each}
          {/await}
        </select>
      </div>
    {/if}
    {#if registerData.type === "arweave"}
      <div class="form-control">
        <label class="label">Arweave Transaction</label>
        <input
          class="input input-bordered"
          bind:value={registerData.transactionId}
        />
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
<Modal open={successDialog}>
  <h3 class="text-3xl text-success">Success!</h3>
  <p class="my-8">
    Congrats! You have successfully registered your subdomain {registerData.subdomain}!
  </p>
  <p class="my-8">
    The processing of the gateway does take some time, it will take a few
    minutes to get your subdomain installed on the gateway.
  </p>
</Modal>

<Modal open={errorDialog}>
  <h3 class="text-3xl text-error">Error!</h3>
  <p class="my-8">
    {errorMessage}
  </p>
</Modal>