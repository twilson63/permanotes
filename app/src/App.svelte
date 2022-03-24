<script>
  import { Route, router } from "tinro";
  import { address } from "./store.js";
  import Home from "./home.svelte";
  import Learn from "./learn.svelte";
  import Connect from "./connect.svelte";
  import Notes from "./notes.svelte";
  import Account from "./account.svelte";
  import Form from "./form.svelte";

  import * as R from "ramda";

  const { not, isEmpty } = R;

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
{#if not(isEmpty($address))}
  <Route path="/notes">
    <Notes />
  </Route>
  <Route path="/notes/new">
    <Form />
  </Route>
  <Route path="/notes/:id/show">
    <p>TODO</p>
  </Route>
  <Route path="/notes/:id/edit">
    <p>TODO</p>
  </Route>
  <Route path="/account">
    <Account />
  </Route>
{/if}
