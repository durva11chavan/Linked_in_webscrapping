// Function to handle the download of connections
function downloadConnections() {
  console.log("Downloading connections Array...");
  var connections = [];

  // Query all elements with the class name ".app-aware-link"
  var names = document.querySelectorAll(
    '.entity-result__title-text.t-16 .app-aware-link span[aria-hidden="true"]'
  );
  var places = document.querySelectorAll(
    ".entity-result__secondary-subtitle.t-14.t-normal"
  );
  var descriptions = document.querySelectorAll(
    ".entity-result__primary-subtitle.t-14.t-black.t-normal"
  );
  var profileLinks = document.querySelectorAll(
    ".entity-result__title-text.t-16 .app-aware-link"
  );

  // Iterate over the DOM elements and store connection details in the array
  for (var i = 0; i < names.length; i++) {
    var connection = {
      name: names[i].innerText,
      place: places[i]?.innerText ? places[i].innerText : "",
      description: descriptions[i]?.innerText ? descriptions[i]?.innerText : "",
      profileLink: profileLinks[i]?.href ? profileLinks[i]?.href : "",
    };
    connections.push(connection);
  }
  console.log(connections);
  console.log("Connections array retrieved successfully!");
  return connections;
}

function arrayToCsv(data) {
  const csvContents = data.map((connection) => [
    connection.name,
    connection.place,
    connection.description,
    connection.profileLink,
  ]);

  const csvStrings = csvContents
    .map((row) =>
      row
        .map((value) => {
          value = String(value).replace(/"/g, '""');
          if (value.includes(",") || value.includes("\n")) {
            value = `"${value}"`;
          }
          return value;
        })
        .join(",")
    )
    .join("\n");

  return csvStrings;
}

function downloadCSV(connections, folderName) {
  const csvContents = connections.map((connection) => ({
    Name: connection.name || "", // Use empty string if name is undefined
    Place: connection.place || "", // Use empty string if place is undefined
    Description: connection.description || "", // Use empty string if description is undefined
    "Profile Link": connection.profileLink || "", // Use empty string if profileLink is undefined
  }));

  const columnNames = Object.keys(csvContents[0]); // Get the column names

  const csvStrings = [
    columnNames.join(","), // Generate the column headers row
    ...csvContents.map((row) =>
      columnNames
        .map((column) => {
          let value = row[column];
          value = String(value).replace(/"/g, '""'); // Escape double quotes
          if (value.includes(",") || value.includes("\n")) {
            value = `"${value}"`; // Enclose value in double quotes if it contains commas or newlines
          }
          return value;
        })
        .join(",")
    ),
  ].join("\n");

  const csvBlob = new Blob([csvStrings], { type: "text/csv;charset=utf-8;" });
  const csvUrl = URL.createObjectURL(csvBlob);

  const link = document.createElement("a");
  link.setAttribute("href", csvUrl);
  link.setAttribute("download", `${folderName}.csv`);
  link.style.display = "none";
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

// Function to inject the download button
function injectDownloadButton() {
  const parentContainer = document.querySelector(
    ".search-reusables__filters-bar-grouping"
  );
  if (parentContainer) {
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download Connections";
    downloadButton.className = "download-button";
    downloadButton.style.margin = "8px";
    downloadButton.style.backgroundColor = "rgb(112, 181, 249, 0%)";
    downloadButton.style.color = "#70b5f9";
    downloadButton.style.position = "relative";
    downloadButton.style.border = "2px solid rgb(112, 181, 249)";
    downloadButton.style.cursor = "pointer";
    downloadButton.style.borderRadius = "1.6rem";
    downloadButton.style.fontSize = "1.6rem";
    downloadButton.style.padding = "0.4rem 1.2rem";
    parentContainer.style.display = "flexbox";
    parentContainer.appendChild(downloadButton);

    // Functionality to handle button click
    downloadButton.addEventListener("click", () => {
      // Add your download logic here
      // Retrieve connections data
      console.log("Retrieving connections data...");
      var connections = downloadConnections();
      console.log(connections);
      // Download connections as an Excel file
      const file = "myConnections";
      downloadCSV(connections, file);
      console.log("Csv Download Sucessfull");
      console.log("Download button clicked!");
    });
  }
}

// MutationObserver to detect changes in the DOM
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const addedNodes = Array.from(mutation.addedNodes);
      for (const node of addedNodes) {
        if (
          node.classList &&
          node.classList.contains("search-reusables__filter-list")
        ) {
          // Filters have been applied, inject the download button
          injectDownloadButton();
          break;
        }
      }
    }
  }
});

// Start observing changes in the desired DOM section
observer.observe(document.body, { childList: true, subtree: true });

console.log("Content script initialized");
