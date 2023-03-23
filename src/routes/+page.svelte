<script lang="ts">
  import dayjs from "dayjs";
  let today = dayjs(Date.now()).format("YYYYMMDD");
</script>

<a href={today}>Go To Today</a>
