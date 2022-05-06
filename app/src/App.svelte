<script>
  import { Route, router } from "tinro";
  import { address } from "./store.js";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";
  import Home from "./home.svelte";
  import Connect from "./connect.svelte";
  import Notes from "./notes.svelte";
  import Account from "./account.svelte";
  import Form from "./form.svelte";
  import Show from "./show.svelte";
  import Notfound from "./404.svelte";
  import Topic from "./topic.svelte";
  import Profile from "./profile.svelte";
  import ProfileNotes from "./profile-notes.svelte";
  import About from "./about.svelte";

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
  <Route
    path="/learn"
    redirect="/notes/Xx8lQw1q9xOUn1mB7CMagKHgv8XUy9NxsrQLtfqZItY"
  />
  <Route path="/connect">
    {#if not(isEmpty($address))}
      <Home />
    {:else}
      <Connect />
    {/if}
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
  <Route path="/profiles/:handle">
    <Profile />
  </Route>
  <Route path="/profiles/:handle/notes">
    <ProfileNotes />
  </Route>
  <Route path="/topics/:topic">
    <Topic />
  </Route>
  <Route path="/about">
    <About />
  </Route>
  <Route path="/404">
    <Notfound />
  </Route>
</Transition>
