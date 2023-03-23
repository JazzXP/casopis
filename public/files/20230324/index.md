```json
{
    "test": true
}
```
```javascript
{
  function uploadImages(files: File[]) {
    return Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("date", $page.params.date);
        formData.append("file", file);
        const resp = await fetch("?/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = deserialize(await resp.text());
        // @ts-ignore
        if (result?.data?.["success"] === false) {
          return { url: "" };
        }
        return {
          // @ts-ignore
          url: result.data.filename,
        };
      })
    );
  }
}
```
:australia:
:grinning:
# :kissing_closed_eyes: #