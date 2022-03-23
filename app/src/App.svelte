<script>
  import { Route, router } from "tinro";

  router.mode.hash();
</script>

<Route path="/">
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <svg
          class="ml-16"
          width="300px"
          height="300px"
          version="1.1"
          viewBox="0 0 1200 1200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m860.4 423.6-144-144c-2.3984-2.4023-4.7969-3.6016-8.3984-3.6016h-360c-7.1992 0-12 4.8008-12 12v624c0 7.1992 4.8008 12 12 12h504c7.1992 0 12-4.8008 12-12v-480c0-3.6016-1.1992-6-3.6016-8.3984zm-140.4-106.8 103.2 103.2h-103.2zm-360 583.2v-600h336v132c0 7.1992 4.8008 12 12 12h132v456z"
            fill="#4c25e0"
          />
        </svg>

        <h1 class="text-6xl">
          Welcome to <span class="uppercase">Perma-Notes</span>
        </h1>
        <div class="mt-16 space-x-8">
          <a href="/learn" class="btn btn-primary">Learn More</a>
          <a href="/connect" class="btn">Connect</a>
        </div>
      </div>
    </div>
  </div>
</Route>
<Route path="/learn">
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost normal-case text-xl">PERMA-NOTES</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal p-0">
        <li><a>Learn</a></li>
        <li><a href="/connect">Connect</a></li>
      </ul>
    </div>
  </div>
  <main>
    <section
      class="mt-8 text-gray-700 relative w-full px-6 py-12 bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:max-w-3xl md:mx-auto lg:max-w-4xl lg:pt-16 lg:pb-28"
    >
      <h2 class="text-3xl">Learn More</h2>
      <p class="mt-8">
        Perma-Notes is a responsive application that provides a permanent
        storage space for every note you can think of creating. This application
        focuses on simplicity and accessibility, so that you can quickly access
        notes that you have created over time.
      </p>
      <h3 class="mt-8 text-xl">Features</h3>
      <div class="flex">
        <div class="card">
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
        <div class="card">
          <div class="card-body">
            <h2 class="card-title">Sharability</h2>
            <p>
              There are times you may want to share your notes with others, all
              you need to do is add a `arweave-account` username or `wallet`
              address to your note.
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h2 class="card-title" />
          </div>
        </div>
      </div>
    </section>
  </main>
</Route>
