import { DOMParser } from 'https://cdn.skypack.dev/@xmldom/xmldom?dts';
import * as xpath from 'https://cdn.skypack.dev/xpath?dts';

interface IResult {
    lastUpdated: Date;
    aircraft: IAircraft[];
}

interface IAircraft {
    registration: string;
    type: string;
    serialNumber: string;
    owner: string;
    operator: string;
}

(async () => {
    const html = await Deno.readTextFile('./data.html');
    // const xhtml = xmlserializer.serializeToString(html);
    const doc = new DOMParser().parseFromString(html);
    // const doc = parse5.parse(html);

    const table = xpath.select('.//table[ contains( ., "updated" ) ]', doc)[0] as Node;

    // get the last updated date
    const updatedDateCell = xpath.select('.//td[ contains( ., "updated" ) ]', table)[0] as Node;
    const updatedDateContent = updatedDateCell.toString();

    // some crazy parsing to get just the date
    const updatedDate = updatedDateContent.split(':').map((c) => c.trim()).map((c) => c.split(/\s/));
    console.log('updated: ', updatedDate[1][0]);

    // the total doesn't appear to be accurate
    // get the total number of aircraft
    // const totalCell = xpath.select('.//td[ contains( ., "total" ) ]', (table as Node));
    // const totalContent = (totalCell[0] as Node).toString();

    // console.log('total', totalContent);

    // get all but the first two rows, which contain our actual data
    const rows = xpath.select('.//tr[ position() > 2 ]', table) as Node[];

    console.log('number of rows', rows.length);

    const aircraft: IAircraft[] = []
    for (const row of rows) {
        // there are blank lines. if the registration is blank, skip this ling
        if (xpath.select1('.//td[1]', row) == null) {
            continue;
        }

        const registration = (xpath.select('.//td[2]', row)[0] as Node).textContent!.trim();
        const type = (xpath.select('.//td[5]', row)[0] as Node).textContent!.trim();
        const serialNumber = (xpath.select('.//td[6]', row)[0] as Node).textContent!.trim();
        const owner = (xpath.select('.//td[7]', row)[0] as Node).textContent!.trim();
        const operator = (xpath.select('.//td[8]', row)[0] as Node).textContent!.trim();

        aircraft.push({
            registration,
            type,
            serialNumber,
            owner,
            operator,
        });
    }

    console.log('number of aircraft', aircraft.length);

    const result: IResult = {
        lastUpdated: new Date(updatedDate[1][0]),
        aircraft: aircraft,
    };

    await Deno.writeTextFile('./data.json', JSON.stringify(result, null, 2));
})();