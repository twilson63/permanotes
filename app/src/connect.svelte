<script>
  import { router } from "tinro";
  import { connectApp, account as getAccount } from "./services/arweave.js";
  import { address, account } from "./store.js";
  import Navbar from "./components/navbar.svelte";

  async function appConnect() {
    const walletAddress = await connectApp().catch((e) => "");
    const a = await getAccount(walletAddress);
    address.set(walletAddress);
    account.set(a);
    router.goto("/account");
  }

  async function fileUpload() {}

  async function arConnect() {
    if (window.arweaveWallet === undefined) {
      window.location.href = "https://arconnect.io";
    }
    await arweaveWallet.connect(
      [
        "ACCESS_ADDRESS",
        "ACCESS_PUBLIC_KEY",
        "SIGN_TRANSACTION",
        "DISPATCH",
        "ENCRYPT",
        "DECRYPT",
      ],
      {
        name: "PermaNotes",
      }
    );
    const addr = await arweaveWallet.getActiveAddress();
    const a = await getAccount(addr);
    address.set(addr);
    account.set(a);
    router.goto("/account");
  }
</script>

<Navbar />
<main>
  <section class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-6xl">Connect Wallet</h1>
        <div class="mt-16 flex space-x-4">
          <div
            class="card bg-base-100 shadow-xl hover:border"
            on:click={arConnect}
          >
            <figure class="px-10 pt-10 bg-gray-400" style="height: 168px;">
              <img
                height="128px"
                src="https://bgwysvp67cg4wxfsvgktephcajni7ggdsa7kgpo5rl637avdlc2a.arweave.net/Ca2JVf74jctcsqmVMjziAlqPmMOQPqM93Yr9v4KjWLQ"
                alt="arconnect logo"
                class="rounded-xl"
              />
            </figure>
            <div class="card-body">
              <h2 class="card-title">ArConnect</h2>
            </div>
          </div>
          <div
            class="card bg-base-100 shadow-xl hover:border"
            on:click={appConnect}
          >
            <figure class="px-10 pt-10 bg-gray-400" style="height: 168px;">
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
