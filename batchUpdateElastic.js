const fs = require("fs");
const path = require("path");

const getMarkdownInfo = require("./getMarkdownInfos");

const updateElastic = async (dataset, filePath) => {
  const remove_variable_regx = /^\-\-\-[\s\S]*\-\-\-/gi;
  const { content, info } = getMarkdownInfo(filePath);
  if (!info.id) return content;
  // Sometimes we need to write html in markdown, remove the tags.
  const remove_html_tags_regx = /\<.*?\>/gi;
  const remove_code_tags_regx = /^```([\s\S]*?)```$/gm;

  const version_regx = /(?<=master\/)(.*)(?=\/site)/i;
  let result = content.replace(remove_html_tags_regx, "");
  result = result.replace(remove_variable_regx, "");
  result = result.replace(remove_code_tags_regx, "");

  const match = filePath.match(version_regx);
  const version = match && match[0];
  const language = filePath.includes("/en/") ? "en" : "cn";
  if (!version) return;
  const indexName =
    language === "en" ? `milvus-docs-${version}` : `milvus-docs-${version}-cn`;

  const data = [
    {
      index: {
        _index: indexName,
        _id: info.id,
      },
    },
    {
      title: info.title,
      language,
      version,
      name: info.id,
      content: result,
    },
  ];
  dataset.push(...data);
};

async function generateEsDataset(dataset, dirPath) {
  let filesList = fs.readdirSync(dirPath);
  for (let i = 0; i < filesList.length; i++) {
    let filePath = path.join(dirPath, filesList[i]);
    let stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      if (filePath.includes("fragments")) {
        continue;
      }
      await generateEsDataset(dataset, filePath);
    } else {
      await updateElastic(dataset, filePath);
    }
  }
}

module.exports = generateEsDataset;
