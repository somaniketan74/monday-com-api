import { TemplateHandler } from 'easy-template-x';
import axios from 'axios';
import logger from '../config/logger';
import { getSettingByField } from './setting.service';
import { uplaodFile } from './s3.service';

export const createXmlColumn = (data) => {
  const tableColumn = `<w:tc>
        <w:tcPr>
            <w:shd w:fill="auto" w:val="clear"/>
            <w:tcMar>
                <w:top w:w="100.0" w:type="dxa"/>
                <w:left w:w="100.0" w:type="dxa"/>
                <w:bottom w:w="100.0" w:type="dxa"/>
                <w:right w:w="100.0" w:type="dxa"/>
            </w:tcMar>
            <w:vAlign w:val="top"/>
        </w:tcPr>
        <w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="00000002">
            <w:pPr>
                <w:keepNext w:val="0"/>
                <w:keepLines w:val="0"/>
                <w:pageBreakBefore w:val="0"/>
                <w:widowControl w:val="0"/>
                <w:pBdr>
                    <w:top w:space="0" w:sz="0" w:val="nil"/>
                    <w:left w:space="0" w:sz="0" w:val="nil"/>
                    <w:bottom w:space="0" w:sz="0" w:val="nil"/>
                    <w:right w:space="0" w:sz="0" w:val="nil"/>
                    <w:between w:space="0" w:sz="0" w:val="nil"/>
                </w:pBdr>
                <w:shd w:fill="auto" w:val="clear"/>
                <w:spacing w:after="0" w:before="0" w:line="240" w:lineRule="auto"/>
                <w:ind w:left="0" w:right="0" w:firstLine="0"/>
                <w:jc w:val="left"/>
                <w:rPr/>
            </w:pPr>
            <w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000">
                <w:rPr>
                    <w:rtl w:val="0"/>
                </w:rPr>
                <w:t xml:space="preserve">${data}</w:t>
            </w:r>
        </w:p>
    </w:tc>`;
  return tableColumn;
};

export const createXmlRow = (row) => {
  let tableRow = '<w:trPr><w:cantSplit w:val="0"/><w:tblHeader w:val="0"/></w:trPr>';
  row.forEach((d) => {
    tableRow += createXmlColumn(d);
  });

  return `<w:tr>${tableRow}</w:tr>`;
};

export const createXmlTable = (data) => {
  const tableWidth = 9029.0;
  const noOfColumns = data[0].length;
  const colWidth = tableWidth / noOfColumns;
  const tblPr = `<w:tblPr>
    <w:tblStyle w:val="Table1"/>
        <w:tblW w:w="${tableWidth}" w:type="dxa"/>
        <w:jc w:val="left"/>
        <w:tblBorders>
            <w:top w:color="000000" w:space="0" w:sz="8" w:val="single"/>
            <w:left w:color="000000" w:space="0" w:sz="8" w:val="single"/>
            <w:bottom w:color="000000" w:space="0" w:sz="8" w:val="single"/>
            <w:right w:color="000000" w:space="0" w:sz="8" w:val="single"/>
            <w:insideH w:color="000000" w:space="0" w:sz="8" w:val="single"/>
            <w:insideV w:color="000000" w:space="0" w:sz="8" w:val="single"/>
        </w:tblBorders>
        <w:tblLayout w:type="fixed"/>
        <w:tblLook w:val="0600"/>
    </w:tblPr>`;
  let tblGrid = '';
  for (let i = 0; i < noOfColumns; i += 1) {
    tblGrid += `<w:gridCol w:w="${colWidth}"/>`;
  }
  tblGrid = `<w:tblGrid>${tblGrid}<w:tblGridChange w:id="0"><w:tblGrid>${tblGrid}</w:tblGrid></w:tblGridChange></w:tblGrid>`;
  let tableRows = '';
  data.forEach((row) => {
    tableRows += createXmlRow(row);
  });

  return `<w:tbl>${tblPr}${tblGrid}${tableRows}</w:tbl>`;
};

export const generateDocument = async (userId, fileKey, data) => {
  const { url } = await getSettingByField('userId', userId);
  logger.info('template url', url);
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const templateFile = response.data;
  const xmlTable = createXmlTable(data);

  const body = {
    table: {
      _type: 'rawXml',
      xml: xmlTable,
      replaceParagraph: true, // optional - should the plugin replace an entire paragraph or just the tag itself
    },
  };

  const handler = new TemplateHandler({
    delimiters: {
      tagStart: '<<',
      tagEnd: '>>',
    },
  });
  const doc = await handler.process(templateFile, body);

  await uplaodFile(doc, fileKey, 'application/msword');
};
