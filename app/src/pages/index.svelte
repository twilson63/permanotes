<script>
  import NavBar from "../components/navbar.svelte";
  import { listANTs } from "../services/registry.js";
  import { address } from "../store.js";

  const account = $address;
</script>

<NavBar />
<main>
  <section class="hero bg-base-200 min-h-screen items-start">
    <div class="hero-content flex-col lg:flex-row-reverse w-full">
      <img src="/permapages.svg" class="max-w-sm rounded-lg shadow-2xl" />
      <div>
        <h1 class="text-5xl font-bold">Permapages</h1>
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
                          ".arweave.net"}
                        >{"https://" +
                          ant.name.toLowerCase() +
                          ".arweave.net"}</a
                      ></td
                    >
                    <td>{ant.records["@"]}</td>
                    <td>
                      <button class="btn">Change</button>
                      <button class="btn">Transfer</button>
                      <button class="btn">Remove</button>
                    </td>
                  </tr>
                </tbody>
              {/each}
            </table>
          {/await}
          <div class="mt-16">
            <a href="/pages/new" class="btn btn-primary">New Permapage</a>
            <a href="/pages/link" class="btn btn-primary">New Permalink</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
