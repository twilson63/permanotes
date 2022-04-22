<script>
  import { formatDistance } from "date-fns";

  export let id, title, description, topic, timestamp;
</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <div class="flex">
      <h2 class="card-title flex-1">{title}</h2>
      <p class="flex-none">#{topic}</p>
    </div>
    <p>{description || ""}</p>
    <div class="card-actions justify-end">
      <p class="mt-4">
        {formatDistance(new Date(timestamp), new Date(), { addSuffix: true })}
      </p>
      <a class="btn btn-primary" href="/notes/{id}">View</a>
    </div>
  </div>
</div>
