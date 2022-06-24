<script>
  export let records = [];
</script>

<table class="table w-full">
  <!-- head -->
  <thead>
    <tr>
      <th>Title</th>
      <th>Description</th>
      <th>TransactionId</th>
      <th>Actions</th>
    </tr>
  </thead>
  {#each records as { id, title, description }}
    <tbody>
      <!-- row 1 -->
      <tr>
        <td>{title}</td>
        <td>{description}</td>
        <td>{id}</td>

        <td>
          <a href="https://arweave.net/{id}" class="link uppercase">Link</a>
          <a href="/pages/new?fork={id}" class="link uppercase">Edit</a>
        </td>
      </tr>
    </tbody>
  {/each}
</table>
