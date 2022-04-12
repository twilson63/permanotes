<script>
  export let tx, title, description, topic;
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <div class="flex">
      <h2 class="card-title flex-1">{title}</h2>
      <p class="flex-none">#{topic}</p>
    </div>
    <p>{description}</p>
    <div class="card-actions justify-end">
      <p class="mt-4">Created: Less than a minute</p>
      <button class="btn btn-primary">View</button>
    </div>
  </div>
</div>
