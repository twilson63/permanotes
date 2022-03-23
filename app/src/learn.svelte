<script>
  import Navbar from "./components/navbar.svelte";
</script>

<Navbar />
<main>
  <section
    class="mt-8 text-gray-700 relative w-full px-6 py-12 bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28"
  >
    <h2 class="text-3xl">Learn More</h2>
    <p class="mt-8">
      Perma-Notes is a responsive application that provides a permanent storage
      space for every note you can think of creating. This application focuses
      on simplicity and accessibility, so that you can quickly access notes that
      you have created over time.
    </p>
    <h3 class="mt-8 text-xl">Features</h3>
    <div class="flex flex-wrap">
      <div class="card md:w-1/3">
        <div class="card-body">
          <h2 class="card-title">Privacy</h2>
          <p>
            By default, every note you create is private, this means that the
            contents of the note will be encrypted using your wallets private
            key. By encrypting the content, only you will be able to read and
            modify the note.
          </p>
        </div>
      </div>
      <div class="card md:w-1/3">
        <div class="card-body">
          <h2 class="card-title">Sharability</h2>
          <p>
            There are times you may want to share your notes with others, all
            you need to do is add a `arweave-account` username or `wallet`
            address to your note.
          </p>
        </div>
      </div>
      <div class="card md:w-1/3">
        <div class="card-body">
          <h2 class="card-title">Publishability</h2>
          <p>
            Want to share your thoughts with the world, publish your note and
            create a public url to share in social media.
          </p>
        </div>
      </div>
    </div>
    <h3 class="mt-8 text-xl">Getting Started</h3>
    <p class="mt-8">How do I get started?</p>
    <p class="mt-4">
      PermaNotes uses crypto technology for power, so in order to use this
      platform, you need to get some `AR` coin. You can purchase `AR` from
      several crypto exchanges, then you will want to create a wallet.
    </p>
  </section>
</main>
