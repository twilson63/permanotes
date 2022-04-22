<script>
  import { Route, router } from "tinro";
  import { address } from "./store.js";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";
  import Home from "./home.svelte";
  import Learn from "./learn.svelte";
  import Connect from "./connect.svelte";
  import Notes from "./notes.svelte";
  import Account from "./account.svelte";
  import Form from "./form.svelte";
  import Show from "./show.svelte";
  import Test from "./test.svelte";

  import * as R from "ramda";

  const { not, isEmpty } = R;

  router.mode.hash();
  router.subscribe((_) => window.scrollTo(0, 0));
</script>

<Announcer />
<Transition>
  <Route path="/">
    <Home />
  </Route>
  <Route path="/learn">
    <Learn />
  </Route>
  <Route path="/connect">
    <Connect />
  </Route>
  <Route path="/notes/*" firstmatch>
    <Route path="/new">
      {#if not(isEmpty($address))}
        <Form />
      {:else}
        <Connect />
      {/if}
    </Route>
    <Route path="/:id">
      <Show />
    </Route>
    <Route fallback>
      {#if not(isEmpty($address))}
        <Notes />
      {:else}
        <Connect />
      {/if}
    </Route>
  </Route>

  <Route path="/notes/:id/edit">
    <p>TODO</p>
  </Route>
  <Route path="/account">
    {#if not(isEmpty($address))}
      <Account />
    {:else}
      <Connect />
    {/if}
  </Route>
  <Route path="/test">
    <Test />
  </Route>
</Transition>
