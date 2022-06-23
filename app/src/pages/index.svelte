<script>
  import NavBar from "../components/navbar.svelte";
  import { listANTs, updateSubDomain } from "../services/registry.js";
  import { gql } from "../services/arweave.js";
  import { pages } from "../app.js";
  import { address } from "../store.js";
  import Modal from "../components/modal.svelte";

  let changeDialog = false;
  let changeData = {};
  let successDialog = false;
  let successData = {};

  const { list } = pages({ gql });

  const account = $address;

  async function handleChange() {
    const result = await updateSubDomain(
      changeData.ANT,
      changeData.subdomain,
      changeData.transactionId
    );
    if (result.ok) {
      successData = {
        title: "Success!",
        description: "Successfully changed transaction id",
      };
      successDialog = true;
    }
  }
  function showChangeDialog(ANT, name) {
    return () => {
      changeData = { ANT, subdomain: name.toLowerCase() };
      changeDialog = true;
    };
  }
</script>

<NavBar />
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <img src="/permapages.svg" class="max-w-sm rounded-lg shadow-2xl" />
      <div class="flex flex-col space-y-16">
        <div>
          <h2 class="text-5xl font-bold mb-2">Permapages</h2>
          <div class="overflow-x-auto">
            {#await list(account)}
              Loading...
            {:then pageList}
              <table class="table w-full">
                <!-- head -->
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subdomain</th>
                    <th>TransactionId</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {#each pageList as { id, title, subdomain }}
                  <tbody>
                    <!-- row 1 -->
                    <tr>
                      <td>{title}</td>
                      <td>{subdomain}</td>
                      <td>{id}</td>

                      <td>
                        <button class="btn">Edit</button>
                      </td>
                    </tr>
                  </tbody>
                {/each}
              </table>
            {/await}
            <div class="mt-16">
              <a href="/pages/new" class="btn btn-primary">New Permapage</a>
            </div>
          </div>
        </div>
        <div>
          <h2 class="text-5xl font-bold">Arweave Name Tokens</h2>
          <div class="overflow-x-auto">
            {#await listANTs(account)}
              Loading...
            {:then ants}
              <table class="table w-full">
                <!-- head -->
                <thead>
                  <tr>
                    <th>Link</th>
                    <th>TransactionId</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {#each ants as ant}
                  <tbody>
                    <!-- row 1 -->
                    <tr>
                      <td
                        ><a
                          class="link"
                          target="_blank"
                          href={"https://" +
                            ant.name.toLowerCase() +
                            ".arweave.dev"}
                          >{"https://" +
                            ant.name.toLowerCase() +
                            ".arweave.dev"}</a
                        ></td
                      >
                      <td>{ant.records["@"]}</td>
                      <td>
                        <button
                          on:click={showChangeDialog(ant.id, ant.name)}
                          class="btn">Change</button
                        >
                        <button class="btn">Transfer</button>
                        <button class="btn">Remove</button>
                      </td>
                    </tr>
                  </tbody>
                {/each}
              </table>
            {/await}
            <!--
            <div class="mt-16">
              <a href="/pages/link" class="btn btn-primary">New ANT</a>
            </div>
            -->
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<Modal open={changeDialog} on:click={handleChange}>
  <h3 class="text-3xl">Change Transaction Id</h3>
  <div class="form-control">
    <label class="label">TransactionId</label>
    <input class="input input-bordered" bind:value={changeData.transactionId} />
  </div>
</Modal>

<Modal open={successDialog}>
  <h3 class="text-3xl text-success">{successData.title}</h3>
  <p class="my-4">{successData.description}</p>
</Modal>
