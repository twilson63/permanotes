<script>
  import Navbar from "./components/navbar.svelte";
  import { meta } from "tinro";
  import { arweave } from "./services/arweave.js";
  import { marked } from "marked";

  const route = meta();
  async function getNote(tx) {
    console.log({ tx });
    const result = await arweave.api.get(tx);
    const note = result.data;
    console.log("note", note);
    // console.log("buffer", note.content);
    // const ctx = await arweave.crypto
    //   .decrypt(arweave.utils.stringToBuffer(note.content), note.owner)
    //   .catch((e) => console.log(e));
    //console.log("ctx", ctx);
    if (!note.public) {
      const ctx = await arweaveWallet.decrypt(
        new Uint8Array(Object.values(note.content)),
        {
          algorithm: "RSA-OAEP",
          hash: "SHA-256",
        }
      );
      console.log("ctx", ctx);
      note.content = ctx;
    }
    return note;
  }
</script>

<Navbar />
<main>
  <section
    class="mt-8 text-gray-700 relative w-full px-6 py-12 bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28"
  >
    {#await getNote(route.params.id) then note}
      <h1 class="text-3xl">Title: {note.title}</h1>
      <p class="mb-16">Description: {note.description}</p>
      <div>{@html marked.parse(note.content)}</div>
    {/await}
  </section>
</main>
