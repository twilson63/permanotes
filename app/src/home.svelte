<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <figure class="flex items-center justify-center">
        <img class="w-64 rounded-lg" src="permanote.png" alt="logo" />
      </figure>

      <h1 class="mt-8 text-5xl">
        <span class="uppercase text-primary">PermaNotes</span>
      </h1>
      <div class="flex mt-8 space-x-2">
        <h2 class="text-3xl text-secondary">✨ CREATE</h2>
        <h2 class="text-3xl text-primary">🗄 STORE</h2>
        <h2 class="text-3xl text-accent">🧠 SHARE</h2>
      </div>
      <div class="mt-16 space-x-4">
        <a href="/connect" class="btn btn-primary">Connect</a>
        <a
          href="/notes/Xx8lQw1q9xOUn1mB7CMagKHgv8XUy9NxsrQLtfqZItY"
          class="btn btn-outline btn-secondary">Learn More</a
        >
      </div>
    </div>
  </div>
  <div class="absolute bottom-8 left-8">
    <figure>
      <img
        src={window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "ar-light.png"
          : "ar-dark.png"}
        alt="permanent"
      />
    </figure>
  </div>
</div>
