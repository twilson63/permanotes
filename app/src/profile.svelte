<script>
  import { meta } from "tinro";
  import { handle as loadHandle } from "./services/arweave.js";
  import { notes } from "./app.js";

  const handle = meta().params.handle;
  const app = notes({ handle: loadHandle });
  const getHandle = async (h) => {
    //const result = await app.getProfile(h);
    const result = await loadHandle(h);
    console.log(result);
    return result;
  };
</script>

<h1>Profile</h1>

<pre>
  {#await getHandle(handle) then profile}
    {JSON.stringify(profile)}
  {/await}
</pre>
