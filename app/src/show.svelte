<script>
  import Navbar from "./components/navbar.svelte";
  import { meta } from "tinro";
  import { arweave } from "./services/arweave.js";

  const route = meta();
  async function getNote(tx) {
    const result = await arweave.api.get(tx);
    const note = result.data;
    // console.log("buffer", note.content);
    // const ctx = await arweave.crypto
    //   .decrypt(arweave.utils.stringToBuffer(note.content), note.owner)
    //   .catch((e) => console.log(e));
    //console.log("ctx", ctx);
    const ctx = await arweaveWallet.decrypt(
      arweave.utils.stringToBuffer(note.content)
    );
    console.log("ctx", ctx);
    note.content = arweave.utils.bufferToString(ctx);
    return note;
  }
</script>

<Navbar />
<main class="hero min-h-screen bg-base-100">
  <section class="hero-content flex-col">
    {#await getNote(route.params.id) then note}
      <h1 class="text-3xl">{note.title}</h1>
      <p>{note.description}</p>
      <p>{note.content}</p>
    {/await}
  </section>
</main>
