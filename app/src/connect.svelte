<script>
  import Navbar from "./components/navbar.svelte";
</script>

<Navbar />
<main>
  <section class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-6xl">Connect Wallet</h1>
        <div class="mt-16 flex space-x-8">
          <div class="card bg-base-100 shadow-xl hover:border">
            <figure class="px-10 pt-10">
              <img
                src="https://bgwysvp67cg4wxfsvgktephcajni7ggdsa7kgpo5rl637avdlc2a.arweave.net/Ca2JVf74jctcsqmVMjziAlqPmMOQPqM93Yr9v4KjWLQ"
                alt="arconnect logo"
                class="rounded-xl"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title">ArConnect</h2>
            </div>
          </div>
          <div class="card bg-base-100 shadow-xl hover:border">
            <figure class="px-10 pt-10">
              <img
                src="https://tgbcqufuppegmlhigt2zosiv2q55qty4t4rg2gebmfm4vpvf.arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0"
                alt="arweave logo"
                class="rounded-x1"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title">ArWeave App</h2>
            </div>
          </div>
        </div>
        <div class="mt-16">
          <p>Need help?</p>
          <p>
            If you are new to ARWeave and don't understand what a wallet is? How
            do I get a wallet? Etc? Click <a href="/learn">here</a> to learn more
            about web3 and ArWeave
          </p>
        </div>
      </div>
    </div>
  </section>
</main>
