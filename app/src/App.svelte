<script>
  import { Route, router } from "tinro";

  import Home from "./home.svelte";
  import Learn from "./learn.svelte";
  import Connect from "./connect.svelte";

  router.mode.hash();
</script>

<Route path="/">
  <Home />
</Route>
<Route path="/learn">
  <Learn />
</Route>
<Route path="/connect">
  <Connect />
</Route>
<Route path="/notes">
  <p>TODO</p>
</Route>
<Route path="/notes/:id">
  <p>TODO</p>
</Route>
<Route path="/notes/:id/edit">
  <p>TODO</p>
</Route>
