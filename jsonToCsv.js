const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "output.csv",
  header: [
    { id: "query", title: "Query" },
    { id: "templateInput", title: "Template Input" },
    { id: "templateResponse", title: "Template Narrative" },
    { id: "llmInput", title: "LLM Input" },
    { id: "llmResponse", title: "LLM Response" },
    { id: "nDataPoints", title: "No. of Data Points" },
  ],
});

const directoryPath = path.join(__dirname, "Responses"); // replace 'your_directory' with your directory name

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  let dataToWrite = [];

  files.forEach(function (file) {
    if (file.endsWith("json")) {
      const filename = path.basename(file, ".json");
      let rawdata = fs.readFileSync(path.join(directoryPath, file));
      let json = JSON.parse(rawdata);

      json.conversationalResponse.responses.forEach(function (response) {
        if (response.type === "narrative") {
          dataToWrite.push({
            query: filename,
            templateInput: JSON.stringify(response.templateRequestData),
            templateResponse: JSON.stringify(response.narrative),
            llmInput: JSON.stringify(response.llmInput),
            llmResponse: JSON.stringify(response.llmNarrative),
            nDataPoints: JSON.stringify(response.nDataPoints),
          });
        }
      });
    }
  });

  csvWriter.writeRecords(dataToWrite).then(() => {
    console.log("...Done");
  });
});
