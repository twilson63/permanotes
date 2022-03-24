<script>
  export let tx, title, description;
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">{title}</h2>
    <p>{description}</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">View</button>
    </div>
  </div>
</div>
