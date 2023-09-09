const inputFiles = document.querySelector("#inputFiles");
const downloadBtn = document.querySelector(".DownloadFile");
let convertedPNGs = [];
const makeZip = new JSZip();

inputFiles.addEventListener("change", async () => {
  let files = inputFiles.files;
  if (files != null) {
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.name.endsWith(".svg")) {
        // Read the SVG file as text
        const reader = new FileReader();
        reader.onload = (event) => {
          const svgText = event.target.result;
          // Create a Blob from the SVG content
          const blob = new Blob([svgText], { type: "image/svg+xml" });
          // Create a URL for the Blob
          const url = URL.createObjectURL(blob);
          // Create a canvas element
          const canvas = document.createElement("canvas");
          // Wait for the SVG image to load
          const imgEle = new Image();
          imgEle.onload = () => {
            // Set canvas dimensions based on the SVG image's natural dimensions
            canvas.width = imgEle.width;
            canvas.height = imgEle.height;
            const ctx = canvas.getContext("2d");
            // Draw the SVG image onto the canvas
            ctx.drawImage(imgEle, 0, 0);
            // Convert the canvas to a data URL (PNG)
            const pngDataURL = canvas.toDataURL("image/png");
            makeZip.file(
              f.name.slice(0, f.name.length - 3) + "png",
              dataURLtoFile(
                pngDataURL,
                f.name.slice(0, f.name.length - 3) + "png"
              )
            );
            convertedPNGs.push(pngDataURL);
            // Create a download link for the PNG
            // const link = document.createElement("a");
            // link.href = pngDataURL;
            // link.download = "p.png";
            // // document.body.appendChild(link);
            // // link.click();
          };
          // Set the source of the Image element to the SVG URL
          imgEle.src = url;
        };
        // Read the SVG file as text
        reader.readAsText(f);
      } else {
        alert(
          "This is not an SVG file.\nPlease make sure your selected file is an SVG file.\n" +
            f.name
        );
        files = null;
        break;
      }
    }
  } else {
    alert("Please select a file to download.");
  }
  files = null;
});

downloadBtn.addEventListener("click", () => {
  // your code geos here...
  makeZip.generateAsync({ type: "blob" }).then((e) => {
    downloadZipFile(e);
    // location.href = "data:application/zip;base64," + e;
  });
  convertedPNGs = [];
});

function downloadZipFile(zipFile) {
  // Create a download link for the PNG
  const link = document.createElement("a");
  const url = URL.createObjectURL(zipFile);
  link.href = url;
  link.download = "SVGtoPNG.zip";
  document.body.appendChild(link);
  link.click();
}

// It only works for base64 to png
function dataURLtoFile(dataurl, filename) {
  console.log("-----------------------------------------------------");
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  console.log("arr:", arr);
  console.log("mime:", mime);
  console.log("bstr:", bstr);
  console.log("n:", n);
  console.log("u8arr:", u8arr);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  console.log("u8arr:", u8arr);
  return new File([u8arr], filename, { type: mime });
}
